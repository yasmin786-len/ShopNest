import { useEffect, useState } from 'react';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import { PlusIcon, EditIcon, TrashIcon, CloseIcon } from '../../components/common/Icons';
import './Admin.css';

const EMPTY_FORM = {
  name: '', description: '', brand: '', imageUrl: '', price: '', discount: '', stock: '', rating: '', categoryId: '',
};

export default function AdminProducts() {
  const { showToast } = useToast();
  const [products, setProducts] = useState({ content: [], pageNumber: 0, totalPages: 0, totalElements: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    categoryApi.getAll().then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data } = search
        ? await productApi.search(search, { page, size: 10 })
        : await productApi.getAll({ page, size: 10 });
      setProducts(data.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  }

  function openEditModal(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      brand: product.brand || '',
      imageUrl: product.imageUrl || '',
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      rating: product.rating,
      categoryId: product.categoryId,
    });
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
      const payload = {
        ...form,
        price: parseFloat(form.price),
        discount: form.discount ? parseFloat(form.discount) : 0,
        stock: parseInt(form.stock, 10),
        rating: form.rating ? parseFloat(form.rating) : 0,
        categoryId: parseInt(form.categoryId, 10),
      };

      if (editingId) {
        await productApi.update(editingId, payload);
        showToast('Product updated successfully', 'success');
      } else {
        await productApi.create(payload);
        showToast('Product created successfully', 'success');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      const data = err.response?.data;
      if (data?.validationErrors) {
        setErrors(data.validationErrors);
      } else {
        showToast(data?.message || 'Could not save product', 'error');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await productApi.remove(product.id);
      showToast('Product deleted', 'success');
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not delete product', 'error');
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Products</h1>
          <p>{products.totalElements} products in your catalog</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <PlusIcon width={16} height={16} /> Add Product
        </button>
      </div>

      <div className="admin-toolbar">
        <input
          className="form-input admin-search-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        />
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="admin-table-empty"><Spinner size={24} /></td></tr>
            ) : products.content.length === 0 ? (
              <tr><td colSpan={6} className="admin-table-empty">No products found</td></tr>
            ) : products.content.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="admin-table-product-cell">
                    <img src={product.imageUrl} alt={product.name} />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td>{product.categoryName}</td>
                <td>{formatCurrency(product.finalPrice)}</td>
                <td>
                  <span className={`badge badge-${product.stock <= 0 ? 'danger' : product.stock <= 10 ? 'warning' : 'success'}`}>
                    {product.stock}
                  </span>
                </td>
                <td>{Number(product.rating).toFixed(1)}</td>
                <td>
                  <div className="admin-table-actions">
                    <button className="btn btn-outline btn-icon btn-sm" onClick={() => openEditModal(product)} aria-label="Edit">
                      <EditIcon width={14} height={14} />
                    </button>
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(product)} aria-label="Delete">
                      <TrashIcon width={14} height={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination pageNumber={products.pageNumber} totalPages={products.totalPages} onPageChange={setPage} />

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setModalOpen(false)} aria-label="Close"><CloseIcon width={20} height={20} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input name="name" className={`form-input ${errors.name ? 'has-error' : ''}`} required value={form.name} onChange={handleChange} />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-textarea" value={form.description} onChange={handleChange} />
              </div>

              <div className="auth-form-row">
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input name="brand" className="form-input" value={form.brand} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="categoryId" className={`form-select ${errors.categoryId ? 'has-error' : ''}`} required value={form.categoryId} onChange={handleChange}>
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && <span className="form-error">{errors.categoryId}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input name="imageUrl" className="form-input" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
              </div>

              <div className="auth-form-row">
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input name="price" type="number" step="0.01" min="0" className={`form-input ${errors.price ? 'has-error' : ''}`} required value={form.price} onChange={handleChange} />
                  {errors.price && <span className="form-error">{errors.price}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Discount (%)</label>
                  <input name="discount" type="number" step="0.01" min="0" max="100" className="form-input" value={form.discount} onChange={handleChange} />
                </div>
              </div>

              <div className="auth-form-row">
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input name="stock" type="number" min="0" className={`form-input ${errors.stock ? 'has-error' : ''}`} required value={form.stock} onChange={handleChange} />
                  {errors.stock && <span className="form-error">{errors.stock}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Rating (0-5)</label>
                  <input name="rating" type="number" step="0.1" min="0" max="5" className="form-input" value={form.rating} onChange={handleChange} />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <Spinner size={16} /> : editingId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
