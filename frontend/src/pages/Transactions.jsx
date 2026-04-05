import { useState, useEffect, useCallback } from 'react';
import { recordsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import Dropdown from '../components/Dropdown';
import DatePicker from '../components/DatePicker';
import {
  Plus, Search, Filter, Edit2, Trash2, X, ChevronLeft, ChevronRight,
} from 'lucide-react';

const Transactions = () => {
  const { isAnalystOrAdmin, isAdmin } = useAuth();
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    page: 1, limit: 10, sortBy: 'date', order: 'desc',
    type: '', category: '', startDate: '', endDate: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);

  // Modal
  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [formData, setFormData] = useState({
    amount: '', type: 'income', category: '', date: '', notes: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await recordsAPI.getAll(params);
      setRecords(data.data.records);
      setPagination(data.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    recordsAPI.getCategories().then((res) => setCategories(res.data.data || [])).catch(() => {});
  }, []);

  const openCreateModal = () => {
    setFormData({ amount: '', type: 'income', category: '', date: new Date().toISOString().split('T')[0], notes: '' });
    setModal({ open: true, mode: 'create', data: null });
  };

  const openEditModal = (record) => {
    setFormData({
      amount: record.amount,
      type: record.type,
      category: record.category,
      date: new Date(record.date).toISOString().split('T')[0],
      notes: record.notes || '',
    });
    setModal({ open: true, mode: 'edit', data: record });
  };

  const closeModal = () => setModal({ open: false, mode: 'create', data: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (modal.mode === 'create') {
        await recordsAPI.create({ ...formData, amount: Number(formData.amount) });
        setToast({ type: 'success', message: 'Record created successfully' });
      } else {
        await recordsAPI.update(modal.data._id, { ...formData, amount: Number(formData.amount) });
        setToast({ type: 'success', message: 'Record updated successfully' });
      }
      closeModal();
      fetchRecords();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Operation failed' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await recordsAPI.delete(id);
      setToast({ type: 'success', message: 'Record deleted' });
      fetchRecords();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Delete failed' });
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Transactions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {pagination.total || 0} total records
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={16} /> Filters
          </button>
          {isAnalystOrAdmin() && (
            <button className="btn-primary" onClick={openCreateModal}>
              <Plus size={16} /> Add Record
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Type</label>
              <Dropdown
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
                options={[
                  { label: 'All Types', value: '' },
                  { label: 'Income', value: 'income' },
                  { label: 'Expense', value: 'expense' }
                ]}
              />
            </div>
            <div>
              <label className="form-label">Category</label>
              <Dropdown
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
                options={[
                  { label: 'All Categories', value: '' },
                  ...categories.map(c => ({ label: c, value: c }))
                ]}
              />
            </div>
            <div>
              <label className="form-label">Start Date</label>
              <DatePicker value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })} />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <DatePicker value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value, page: 1 })} />
            </div>
            <div>
              <label className="form-label">Sort By</label>
              <Dropdown
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                options={[
                  { label: 'Date', value: 'date' },
                  { label: 'Amount', value: 'amount' },
                  { label: 'Category', value: 'category' }
                ]}
              />
            </div>
            <div>
              <label className="form-label">Order</label>
              <Dropdown
                value={filters.order}
                onChange={(e) => setFilters({ ...filters, order: e.target.value })}
                options={[
                  { label: 'Newest First', value: 'desc' },
                  { label: 'Oldest First', value: 'asc' }
                ]}
              />
            </div>
          </div>
          <button
            className="btn-secondary"
            style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}
            onClick={() => setFilters({ page: 1, limit: 10, sortBy: 'date', order: 'desc', type: '', category: '', startDate: '', endDate: '' })}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {loading ? (
          <div className="loader"><div className="spinner"></div></div>
        ) : records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Search size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No records found.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Notes</th>
                <th>Created By</th>
                {isAnalystOrAdmin() && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td>{record.category}</td>
                  <td><span className={`badge badge-${record.type}`}>{record.type}</span></td>
                  <td style={{ fontWeight: 600, color: record.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                    {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {record.notes || '—'}
                  </td>
                  <td>{record.createdBy?.name || '—'}</td>
                  {isAnalystOrAdmin() && (
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                        <button className="btn-secondary" style={{ padding: '0.375rem 0.5rem' }}
                          onClick={() => openEditModal(record)}>
                          <Edit2 size={14} />
                        </button>
                        {isAdmin() && (
                          <button className="btn-danger" style={{ padding: '0.375rem 0.5rem' }}
                            onClick={() => handleDelete(record._id)}>
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Page {pagination.page} of {pagination.totalPages} · {pagination.total} records
            </span>
            <div className="pagination">
              <button disabled={pagination.page <= 1}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const start = Math.max(1, pagination.page - 2);
                const page = start + i;
                if (page > pagination.totalPages) return null;
                return (
                  <button key={page} className={page === pagination.page ? 'active' : ''}
                    onClick={() => setFilters({ ...filters, page })}>
                    {page}
                  </button>
                );
              })}
              <button disabled={pagination.page >= pagination.totalPages}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modal.open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {modal.mode === 'create' ? 'Add Record' : 'Edit Record'}
              </h2>
              <button onClick={closeModal}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label className="form-label">Amount</label>
                  <input type="number" className="form-input" placeholder="0.00" step="0.01" min="0"
                    value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Type</label>
                  <Dropdown
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    options={[
                      { label: 'Income', value: 'income' },
                      { label: 'Expense', value: 'expense' }
                    ]}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label className="form-label">Category</label>
                  <input type="text" className="form-input" placeholder="e.g. Salary, Rent"
                    value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Date</label>
                  <DatePicker
                    value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Notes</label>
                <input type="text" className="form-input" placeholder="Optional notes"
                  value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={formLoading}>
                  {formLoading ? 'Saving...' : modal.mode === 'create' ? 'Create Record' : 'Update Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
