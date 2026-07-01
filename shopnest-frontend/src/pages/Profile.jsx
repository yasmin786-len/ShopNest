import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userApi } from '../api/userApi';
import Spinner from '../components/common/Spinner';
import { UserIcon } from '../components/common/Icons';
import './Profile.css';

export default function Profile() {
  const { user, updateUserInfo } = useAuth();
  const { showToast } = useToast();

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  function handleProfileChange(e) {
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePasswordChange(e) {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileErrors({});
    setSavingProfile(true);
    try {
      const { data } = await userApi.updateProfile(profileForm);
      updateUserInfo(data.data);
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData?.validationErrors) {
        setProfileErrors(responseData.validationErrors);
      } else {
        showToast(responseData?.message || 'Could not update profile', 'error');
      }
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordErrors({});
    setSavingPassword(true);
    try {
      await userApi.changePassword(passwordForm);
      showToast('Password changed successfully', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData?.validationErrors) {
        setPasswordErrors(responseData.validationErrors);
      } else {
        showToast(responseData?.message || 'Could not change password', 'error');
      }
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="container profile-page">
      <div className="products-page-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and account security</p>
      </div>

      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <UserIcon width={32} height={32} />
          </div>
          <strong>{user?.firstName} {user?.lastName}</strong>
          <span>{user?.email}</span>
          <span className="badge badge-indigo" style={{ marginTop: 'var(--space-2)' }}>{user?.role}</span>
        </div>

        <div className="profile-forms">
          <form className="checkout-section" onSubmit={handleProfileSubmit}>
            <h2>Personal Information</h2>
            <div className="auth-form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">First Name</label>
                <input
                  id="firstName" name="firstName" className={`form-input ${profileErrors.firstName ? 'has-error' : ''}`}
                  required value={profileForm.firstName} onChange={handleProfileChange}
                />
                {profileErrors.firstName && <span className="form-error">{profileErrors.firstName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">Last Name</label>
                <input
                  id="lastName" name="lastName" className={`form-input ${profileErrors.lastName ? 'has-error' : ''}`}
                  required value={profileForm.lastName} onChange={handleProfileChange}
                />
                {profileErrors.lastName && <span className="form-error">{profileErrors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" value={user?.email || ''} disabled />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <input
                id="phone" name="phone" className={`form-input ${profileErrors.phone ? 'has-error' : ''}`}
                value={profileForm.phone} onChange={handleProfileChange} placeholder="9876543210"
              />
              {profileErrors.phone && <span className="form-error">{profileErrors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">Address</label>
              <textarea
                id="address" name="address" className="form-textarea"
                value={profileForm.address} onChange={handleProfileChange}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={savingProfile}>
              {savingProfile ? <Spinner size={16} /> : 'Save Changes'}
            </button>
          </form>

          <form className="checkout-section" onSubmit={handlePasswordSubmit}>
            <h2>Change Password</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword" name="currentPassword" type="password"
                className={`form-input ${passwordErrors.currentPassword ? 'has-error' : ''}`}
                required value={passwordForm.currentPassword} onChange={handlePasswordChange}
              />
              {passwordErrors.currentPassword && <span className="form-error">{passwordErrors.currentPassword}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">New Password</label>
              <input
                id="newPassword" name="newPassword" type="password"
                className={`form-input ${passwordErrors.newPassword ? 'has-error' : ''}`}
                required value={passwordForm.newPassword} onChange={handlePasswordChange}
                placeholder="At least 6 characters"
              />
              {passwordErrors.newPassword && <span className="form-error">{passwordErrors.newPassword}</span>}
            </div>
            <button type="submit" className="btn btn-secondary" disabled={savingPassword}>
              {savingPassword ? <Spinner size={16} /> : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
