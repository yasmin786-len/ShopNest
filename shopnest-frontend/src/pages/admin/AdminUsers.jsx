import { useEffect, useState } from 'react';
import { userApi } from '../../api/userApi';
import { formatDate } from '../../utils/formatters';
import Spinner from '../../components/common/Spinner';
import './Admin.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    userApi.getAllUsers()
      .then((res) => setUsers(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(term) ||
      u.lastName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Users</h1>
          <p>{users.length} registered users</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          className="form-input admin-search-input"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="admin-table-empty"><Spinner size={24} /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="admin-table-empty">No users found</td></tr>
            ) : filtered.map((user) => (
              <tr key={user.id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phone || '—'}</td>
                <td><span className={`badge badge-${user.role === 'ADMIN' ? 'indigo' : 'success'}`}>{user.role}</span></td>
                <td>{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
