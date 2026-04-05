import { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '../services/api';
import Toast from '../components/Toast';
import Dropdown from '../components/Dropdown';
import {
  Users, Shield, ChevronLeft, ChevronRight, UserCheck, UserX,
} from 'lucide-react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await usersAPI.getAll({ page, limit: 10 });
      setUsers(data.data.users);
      setPagination(data.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await usersAPI.updateRole(userId, newRole);
      setToast({ type: 'success', message: `Role updated to ${newRole}` });
      fetchUsers();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to update role' });
    }
  };

  const handleToggleActive = async (user) => {
    try {
      if (user.isActive) {
        await usersAPI.deactivate(user._id);
        setToast({ type: 'success', message: `${user.name} deactivated` });
      } else {
        await usersAPI.activate(user._id);
        setToast({ type: 'success', message: `${user.name} activated` });
      }
      fetchUsers();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Operation failed' });
    }
  };

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'rgba(139, 92, 246, 0.15)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)',
          }}>
            <Shield size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Admin Panel</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Manage users and roles · {pagination.total || 0} total users
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div className="loader"><div className="spinner"></div></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.75rem', color: 'white',
                      }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <Dropdown
                      style={{ width: '130px', fontSize: '0.8rem' }}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      options={[
                        { label: 'Viewer', value: 'Viewer' },
                        { label: 'Analyst', value: 'Analyst' },
                        { label: 'Admin', value: 'Admin' }
                      ]}
                    />
                  </td>
                  <td>
                    <span className={`badge badge-${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className={user.isActive ? 'btn-danger' : 'btn-success'}
                      onClick={() => handleToggleActive(user)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                    >
                      {user.isActive ? <><UserX size={14} /> Deactivate</> : <><UserCheck size={14} /> Activate</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft size={14} />
              </button>
              <button disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
