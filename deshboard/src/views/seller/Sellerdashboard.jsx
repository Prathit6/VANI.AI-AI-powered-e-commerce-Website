import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../../context/SocketProvider';
import api from '../../api/authApi';
import cartApi from '../../api/api';
import toast from 'react-hot-toast';
import './SellerDashboard.css';

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Package: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l9 4.9V17L12 22l-9-5.1V6.9L12 2z" /><polyline points="12 22 12 12" /><polyline points="21 7 12 12" /><polyline points="3 7 12 12" />
    </svg>
  ),
  Chat: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  Clock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Alert: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Edit: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Trash: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  ),
  Cart: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      <line x1="17" y1="9" x2="17" y2="15" /><line x1="14" y1="12" x2="20" y2="12" />
    </svg>
  ),
  Photo: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  Upload: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
    </svg>
  ),
  Send: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  MessageDots: () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      <line x1="9" y1="10" x2="9" y2="10" /><line x1="12" y1="10" x2="12" y2="10" /><line x1="15" y1="10" x2="15" y2="10" />
    </svg>
  ),
  PackageOff: () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l9 4.9V17L12 22l-9-5.1V6.9L12 2z" /><line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  ),
};

export default function SellerDashboard() {
  const { userInfo } = useSelector(state => state.auth);
  const socket = useSocket();
  const [activeTab, setActiveTab] = useState('overview');

  const NAV = [
    { id: 'overview', Icon: Icons.Dashboard, label: 'Overview' },
    { id: 'products', Icon: Icons.Package, label: 'My Products' },
    { id: 'chat', Icon: Icons.Chat, label: 'Chat with Admin' },
  ];

  return (
    <div className="sd-root">
      <aside className="sd-sidebar">
        <div className="sd-brand">
          <div className="sd-avatar">{(userInfo?.name || 'S')[0].toUpperCase()}</div>
          <div>
            <div className="sd-brand-name">{userInfo?.name || 'Seller'}</div>
            <div className="sd-brand-role">Seller Portal</div>
          </div>
        </div>

        <nav className="sd-nav">
          {NAV.map(({ id, Icon, label }) => (
            <button
              key={id}
              className={`sd-nav-item${activeTab === id ? ' active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon />
              {label}
            </button>
          ))}
        </nav>

        <div className="sd-status-bar">
          <div className={`sd-dot ${userInfo?.status === 'active' ? 'green' : 'amber'}`} />
          <span>{userInfo?.status === 'active' ? 'Active' : 'Pending Approval'}</span>
        </div>
      </aside>

      <main className="sd-main">
        {activeTab === 'overview' && <OverviewTab userInfo={userInfo} />}
        {activeTab === 'products' && <ProductsTab userInfo={userInfo} />}
        {activeTab === 'chat' && <ChatTab userInfo={userInfo} socket={socket} />}
      </main>
    </div>
  );
}

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────
function OverviewTab({ userInfo }) {
  const [stats, setStats] = useState({ products: 0, active: 0, pending: 0 });

  useEffect(() => {
    api.get('/seller/products')
      .then(({ data }) => {
        const p = data.products || [];
        setStats({
          products: p.length,
          active: p.filter(x => x.status === 'active').length,
          pending: p.filter(x => x.status === 'pending').length,
        });
      })
      .catch(() => { });
  }, []);

  const cards = [
    { Icon: Icons.Package, color: 'indigo', val: stats.products, label: 'Total Products' },
    { Icon: Icons.CheckCircle, color: 'green', val: stats.active, label: 'Active' },
    { Icon: Icons.Clock, color: 'amber', val: stats.pending, label: 'Pending' },
  ];

  return (
    <div className="sd-section">
      <div className="sd-page-header">
        <h1>Overview</h1>
        <p>Welcome back, {userInfo?.name}</p>
      </div>

      {userInfo?.status === 'pending' && (
        <div className="sd-alert amber">
          <Icons.Alert />
          Your account is pending admin approval. Products won't be visible until approved.
        </div>
      )}

      <div className="sd-stat-grid">
        {cards.map(({ Icon, color, val, label }) => (
          <div key={label} className="sd-stat-card">
            <div className={`sd-stat-icon ${color}`}><Icon /></div>
            <div className="sd-stat-body">
              <div className="sd-stat-val">{val}</div>
              <div className="sd-stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="sd-info-card">
        <h2 className="sd-card-title">Shop Information</h2>
        <div className="sd-info-grid">
          {[
            ['Shop Name', userInfo?.shopInfo?.shopName || '—'],
            ['Category', userInfo?.shopInfo?.category || '—'],
            ['Email', userInfo?.email],
            ['Status', null, userInfo?.status || 'pending'],
          ].map(([label, val, badge]) => (
            <div key={label} className="sd-info-row">
              <span className="sd-info-label">{label}</span>
              {badge
                ? <span className={`sd-badge ${badge === 'active' ? 'green' : 'amber'}`}>{badge}</span>
                : <span className="sd-info-val">{val}</span>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [cartLoading, setCartLoading] = useState({});
  const [imagePreview, setImagePreview] = useState('');   // base64 or URL for preview
  const fileInputRef = useRef(null);

  const blankForm = { name: '', description: '', price: '', category: '', image: '', stock: '', keywords: '' };
  const [form, setForm] = useState(blankForm);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/seller/products')
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });

  // ── Image file selection → convert to base64 ──────────────────────────────
  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => {
      const base64 = ev.target.result;   // "data:image/jpeg;base64,..."
      setImagePreview(base64);
      setForm(prev => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const openAdd = () => {
    setEditProduct(null);
    setForm(blankForm);
    setImagePreview('');
    setShowForm(true);
  };

  const openEdit = p => {
    setEditProduct(p);
    setForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      category: p.category || '',
      image: p.image || '',
      stock: p.stock || '',
      keywords: (p.keywords || []).join(', '),
    });
    setImagePreview(p.image || '');
    setShowForm(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
    };

    const ecomPayload = {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      image: payload.image,
      keywords: payload.keywords,
      stock: payload.stock,
    };

    try {
      if (editProduct) {
        await api.put(`/seller/product/${editProduct._id}`, payload);
        if (editProduct.ecomId) {
          try { await cartApi.put(`/products/${editProduct.ecomId}`, ecomPayload); }
          catch { toast('Note: main catalog update failed', { icon: '⚠️' }); }
        }
        toast.success('Product updated');
      } else {
        const { data: sellerRes } = await api.post('/seller/product', payload);
        try {
          const { data: ecomRes } = await cartApi.post('/products', ecomPayload);
          if (ecomRes?.id && sellerRes?.product?._id) {
            await api.put(`/seller/product/${sellerRes.product._id}`, { ...payload, ecomId: ecomRes.id }).catch(() => { });
          }
        } catch {
          toast('Saved to your store. Note: main catalog sync failed.', { icon: '⚠️' });
        }
        toast.success('Product added — pending admin approval');
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save product');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const product = products.find(p => p._id === id);
      await api.delete(`/seller/product/${id}`);
      if (product?.ecomId) {
        try { await cartApi.delete(`/products/${product.ecomId}`); } catch { }
      }
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleAddToCart = async product => {
    setCartLoading(prev => ({ ...prev, [product._id]: true }));
    try {
      const { data: deliveryOptions } = await cartApi.get('/delivery-options');
      const defaultDelivery = deliveryOptions[0];
      if (!defaultDelivery) throw new Error('No delivery options found');
      await cartApi.post('/cart-items', { productId: product._id, quantity: 1, deliveryOptionId: defaultDelivery.id });
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add to cart');
    } finally {
      setCartLoading(prev => ({ ...prev, [product._id]: false }));
    }
  };

  // ── Format price as $ ─────────────────────────────────────────────────────
  const formatPrice = price => `$${(Number(price) / 100).toFixed(2)}`;

  return (
    <div className="sd-section">
      <div className="sd-page-header">
        <div>
          <h1>My Products</h1>
          <p>{products.length} product{products.length !== 1 ? 's' : ''} total</p>
        </div>
        <button className="sd-btn primary" onClick={openAdd}>
          <Icons.Plus /> Add Product
        </button>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {showForm && (
        <div className="sd-overlay" onClick={() => setShowForm(false)}>
          <div className="sd-modal" onClick={e => e.stopPropagation()}>
            <div className="sd-modal-head">
              <h2>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="sd-close-btn" onClick={() => setShowForm(false)}><Icons.X /></button>
            </div>

            <form className="sd-form" onSubmit={handleSubmit}>
              <div className="sd-form-row">
                <div className="sd-field">
                  <label>Product Name</label>
                  <input name="name" value={form.name} onChange={handleInput} placeholder="e.g. Cotton T-Shirt" required />
                </div>
                <div className="sd-field">
                  <label>Category</label>
                  <input name="category" value={form.category} onChange={handleInput} placeholder="e.g. Clothing" />
                </div>
              </div>

              <div className="sd-form-row">
                <div className="sd-field">
                  <label>Price (in cents)</label>
                  <input name="price" type="number" value={form.price} onChange={handleInput} placeholder="e.g. 1999 = $19.99" required />
                </div>
                <div className="sd-field">
                  <label>Stock Quantity</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleInput} placeholder="e.g. 100" />
                </div>
              </div>

              {/* ── Image upload ──────────────────────────────────────────── */}
              <div className="sd-field">
                <label>Product Image</label>
                <div
                  className="sd-upload-zone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="sd-upload-preview">
                      <img src={imagePreview} alt="Preview" />
                      <div className="sd-upload-overlay">
                        <Icons.Upload />
                        <span>Change photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="sd-upload-placeholder">
                      <Icons.Upload />
                      <span className="sd-upload-title">Click to upload photo</span>
                      <span className="sd-upload-sub">JPG, PNG, WebP — max 5 MB</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                {/* Fallback: manual URL field */}
                <div className="sd-field" style={{ marginTop: 8 }}>
                  <label style={{ fontSize: '0.74rem', color: '#a0a7b8' }}>or paste an image URL</label>
                  <input
                    name="image"
                    value={form.image.startsWith('data:') ? '' : form.image}
                    onChange={e => {
                      setForm(prev => ({ ...prev, image: e.target.value }));
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>

              <div className="sd-field">
                <label>Keywords <span className="sd-hint">(comma separated)</span></label>
                <input name="keywords" value={form.keywords} onChange={handleInput} placeholder="e.g. shirt, cotton, casual" />
              </div>
              <div className="sd-field">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleInput} placeholder="Product description…" rows={3} />
              </div>

              <div className="sd-form-actions">
                <button type="button" className="sd-btn ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="sd-btn primary">
                  {editProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="sd-loading"><div className="sd-spinner" /> Loading products…</div>
      ) : products.length === 0 ? (
        <div className="sd-empty">
          <Icons.PackageOff />
          <p>No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="sd-table-wrap">
          <table className="sd-table">
            <thead>
              <tr>
                <th>Product</th><th>Category</th><th>Price</th>
                <th>Stock</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>
                    <div className="sd-product-cell">
                      {p.image
                        ? <img src={p.image} alt={p.name} className="sd-thumb" />
                        : <div className="sd-thumb placeholder"><Icons.Photo /></div>
                      }
                      <span className="sd-product-name">{p.name}</span>
                    </div>
                  </td>
                  <td className="sd-muted">{p.category || '—'}</td>
                  <td className="sd-price">{formatPrice(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`sd-badge ${p.status === 'active' ? 'green' : p.status === 'pending' ? 'amber' : 'red'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className="sd-actions">
                      <button
                        className="sd-icon-btn cart"
                        onClick={() => handleAddToCart(p)}
                        disabled={cartLoading[p._id]}
                        title="Add to cart"
                      >
                        {cartLoading[p._id] ? <div className="sd-spinner small" /> : <Icons.Cart />}
                      </button>
                      <button className="sd-icon-btn edit" onClick={() => openEdit(p)} title="Edit"><Icons.Edit /></button>
                      <button className="sd-icon-btn delete" onClick={() => handleDelete(p._id)} title="Delete"><Icons.Trash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
function ChatTab({ userInfo, socket }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [adminId, setAdminId] = useState(null);
  const [adminOnline, setAdminOnline] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const seenIds = useRef(new Set());
  const myId = userInfo?.id || userInfo?._id;

  function safeAppend(msg, mine) {
    const key = String(msg._id || msg._tempKey || '');
    if (key && seenIds.current.has(key)) return;
    if (key) seenIds.current.add(key);
    setMessages(prev => [...prev, { ...msg, mine }]);
  }

  useEffect(() => {
    if (!myId) return;
    api.get('/admin/info')
      .then(({ data }) => {
        setAdminId(data.adminId);
        return api.get(`/messages/${myId}?adminId=${data.adminId}`);
      })
      .then(({ data: h }) => {
        const msgs = h.messages || [];
        msgs.forEach(m => seenIds.current.add(String(m._id)));
        setMessages(msgs.map(m => ({ ...m, _id: String(m._id), mine: String(m.senderId) === String(myId) })));
      })
      .catch(() => { });
  }, [myId]);

  useEffect(() => {
    if (!socket) return;
    const onStatus = ({ online }) => setAdminOnline(online);
    const onReceive = data => {
      if (String(data.senderId) !== String(adminId) && String(data.receiverId) !== String(myId)) return;
      safeAppend(data, false);
    };
    const onSent = data => {
      const realKey = String(data._id);
      if (seenIds.current.has(realKey)) return;
      seenIds.current.add(realKey);
      setMessages(prev => {
        const idx = prev.findIndex(m => m._tempKey && !m._id);
        if (idx !== -1) { const next = [...prev]; next[idx] = { ...data, _id: realKey, mine: true }; return next; }
        return [...prev, { ...data, _id: realKey, mine: true }];
      });
      setSending(false);
    };
    socket.on('admin_status', onStatus);
    socket.on('receive_message', onReceive);
    socket.on('message_sent', onSent);
    socket.on('message_error', () => setSending(false));
    return () => {
      socket.off('admin_status', onStatus);
      socket.off('receive_message', onReceive);
      socket.off('message_sent', onSent);
      socket.off('message_error');
    };
  }, [socket, adminId, myId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = e => {
    e.preventDefault();
    if (!input.trim() || !socket || !adminId || !myId || sending) return;
    const tempKey = `tmp_${Date.now()}`;
    const msg = {
      senderId: String(myId),
      receiverId: String(adminId),
      senderName: userInfo?.name || 'Seller',
      message: input.trim(),
      timestamp: Date.now(),
      _tempKey: tempKey,
    };
    seenIds.current.add(tempKey);
    setMessages(prev => [...prev, { ...msg, mine: true }]);
    setSending(true);
    socket.emit('send_message', msg);
    setInput('');
  };

  return (
    <div className="sd-section chat-section">
      <div className="sd-page-header">
        <div>
          <h1>Chat with Admin</h1>
          <p>Messages are saved even when admin is offline</p>
        </div>
        <div className="sd-online-pill">
          <span className={`sd-dot ${adminOnline ? 'green' : 'red'}`} />
          <span>{adminOnline ? 'Admin Online' : 'Admin Offline'}</span>
          {!adminOnline && adminId && <span className="sd-hint">· messages saved</span>}
        </div>
      </div>

      <div className="sd-chat-box">
        <div className="sd-chat-messages">
          {messages.length === 0 ? (
            <div className="sd-chat-empty">
              <Icons.MessageDots />
              <p>No messages yet — say hello!</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={msg._id || msg._tempKey || i} className={`sd-msg ${msg.mine ? 'mine' : 'theirs'}`}>
                <div className="sd-bubble" style={{ opacity: msg._tempKey && !msg._id ? 0.65 : 1 }}>
                  {msg.message}
                  {msg._tempKey && !msg._id && <span className="sd-sending">sending…</span>}
                </div>
                <div className="sd-msg-meta">
                  {msg.mine ? 'You' : 'Admin'} ·{' '}
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {msg.mine && msg._id && <span className="sd-delivered">✓✓</span>}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <form className="sd-chat-form" onSubmit={sendMessage}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              !socket ? 'Connecting…' :
                !adminId ? 'Loading…' :
                  adminOnline ? 'Type a message…' :
                    'Admin offline — message will be saved'
            }
            autoComplete="off"
          />
          <button type="submit" disabled={!input.trim() || !socket || !adminId || sending}>
            <Icons.Send />
          </button>
        </form>
      </div>
    </div>
  );
}
