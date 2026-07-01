import { useEffect, useState } from 'react';
import { categoryApi } from '../../api/categoryApi';
import { useToast } from '../../context/ToastContext';
import Spinner from '../../components/common/Spinner';
import { PlusIcon, EditIcon, TrashIcon, CloseIcon } from '../../components/common/Icons';
import './Admin.css';

const EMPTY_FORM = { name: '', imageUrl: '' };

export default function AdminCategories() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  async function fetchCategories() {
    setLoading(true);
    try {
      const { data } = await categoryApi.getAll();
      setCategories(data.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  }

  function openEditModal(category) {
    setEditingId(category.id);
    setForm({ name: category.name, imageUrl: category.imageUrl || '' });
    setErrors({});
    setModalOpen(true);
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (editingId) {
        await categoryApi.update(editingId, form);
        showToast('Category updated successfully', 'success');
      } else {
        await categoryApi.create(form);
        showToast('Category created successfully', 'success');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      const data = err.response?.data;
      if (data?.validationErrors) {
        setErrors(data.validationErrors);
      } else {
        showToast(data?.message || 'Could not save category', 'error');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category) {
    if (!window.confirm(`Delete "${category.name}"? Products in this category will be affected.`)) return;
    try {
      await categoryApi.remove(category.id);
      showToast('Category deleted', 'success');
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not delete category', 'error');
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Categories</h1>
          <p>{categories.length} categories</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <PlusIcon width={16} height={16} /> Add Category
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="admin-table-empty"><Spinner size={24} /></td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={3} className="admin-table-empty">No categories yet</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.id}>
                <td>
                  <div className="admin-table-product-cell">
                    <img src={cat.imageUrl} alt={cat.name} />
                    <span>{cat.name}</span>
                  </div>
                </td>
                <td>{cat.productCount}</td>
                <td>
                  <div className="admin-table-actions">
                    <button className="btn btn-outline btn-icon btn-sm" onClick={() => openEditModal(cat)} aria-label="Edit">
                      <EditIcon width={14} height={14} />
                    </button>
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(cat)} aria-label="Delete">
                      <TrashIcon width={14} height={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingId ? 'Edit Category' : 'Add New Category'}</h2>
              <button onClick={() => setModalOpen(false)} aria-label="Close"><CloseIcon width={20} height={20} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input name="name" className={`form-input ${errors.name ? 'has-error' : ''}`} required value={form.name} onChange={handleChange} />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input name="imageUrl" className="form-input" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <Spinner size={16} /> : editingId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
