import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/common/Spinner';
import './Auth.css';

export default function Register() {
  const { register, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '', address: '',
  });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState('');

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBanner('');
    setErrors({});
    try {
      const result = await register(form);
      showToast(`Welcome to ShopNest, ${result.user.firstName}!`, 'success');
      navigate('/', { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data?.validationErrors) {
        setErrors(data.validationErrors);
      } else {
        setBanner(data?.message || 'Registration failed. Please try again.');
      }
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <span className="navbar-logo-mark" style={{ display: 'inline-flex' }}>S</span>
          <h1>Create your account</h1>
          <p>Join ShopNest and start shopping today</p>
        </div>

        {banner && <div className="auth-banner-error">{banner}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">First Name</label>
              <input
                id="firstName" name="firstName" className={`form-input ${errors.firstName ? 'has-error' : ''}`}
                required value={form.firstName} onChange={handleChange} placeholder="Jane"
              />
              {errors.firstName && <span className="form-error">{errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="lastName">Last Name</label>
              <input
                id="lastName" name="lastName" className={`form-input ${errors.lastName ? 'has-error' : ''}`}
                required value={form.lastName} onChange={handleChange} placeholder="Doe"
              />
              {errors.lastName && <span className="form-error">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email" name="email" type="email" className={`form-input ${errors.email ? 'has-error' : ''}`}
              required value={form.email} onChange={handleChange} placeholder="you@example.com"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password" className={`form-input ${errors.password ? 'has-error' : ''}`}
              required value={form.password} onChange={handleChange} placeholder="At least 6 characters"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number (optional)</label>
            <input
              id="phone" name="phone" className={`form-input ${errors.phone ? 'has-error' : ''}`}
              value={form.phone} onChange={handleChange} placeholder="9876543210"
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">Address (optional)</label>
            <input
              id="address" name="address" className="form-input"
              value={form.address} onChange={handleChange} placeholder="123 Main Street, City"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? <Spinner size={18} /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
