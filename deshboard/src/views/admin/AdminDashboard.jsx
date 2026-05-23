// src/views/admin/AdminDashboard.jsx
import React, { useEffect, useState, useRef } from 'react';
import { MdCurrencyExchange, MdProductionQuantityLimits } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import Chart from 'react-apexcharts';
import moment from 'moment';
import { useSocket } from '../../context/SocketProvider';
import { useSelector } from 'react-redux';
import api from '../../api/authApi';
import './AdminDashboard.css';

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Icon = {
  Send: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Refresh: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  ),
  Check: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Ban: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Chat: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  Back: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Package: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l9 4.9V17L12 22l-9-5.1V6.9L12 2z" /><polyline points="12 22 12 12" /><polyline points="21 7 12 12" /><polyline points="3 7 12 12" />
    </svg>
  ),
  Store: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  ImageOff: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" /><line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  ),
};

const AdminDashboard = () => {
  const socket = useSocket();
  const { userInfo } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('dashboard');

  // ── Data ──────────────────────────────────────────────────────────────────
  const [sellers, setSellers] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Socket: online sellers ────────────────────────────────────────────────
  const [onlineSellers, setOnlineSellers] = useState([]);

  // ── Chat ──────────────────────────────────────────────────────────────────
  const [currentSellerId, setCurrentSellerId] = useState(null);
  const [conversations, setConversations] = useState({});
  const [input, setInput] = useState('');
  const seenIds = useRef(new Set());
  const bottomRef = useRef(null);

  // ── Seller detail view ────────────────────────────────────────────────────
  const [viewingSeller, setViewingSeller] = useState(null); // seller object

  // ── Fetch data ────────────────────────────────────────────────────────────
  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('/admin/sellers'),
      api.get('/admin/users'),
      api.get('/admin/products'),
    ]).then(([sRes, uRes, pRes]) => {
      setSellers(sRes.data.sellers || []);
      setUsers(uRes.data.users || []);
      setProducts(pRes.data.products || []);
    }).catch(err => console.error('fetchData error:', err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  // ── Approve / Reject seller ───────────────────────────────────────────────
  const updateSellerStatus = async (sellerId, status) => {
    try {
      await api.put(`/admin/seller/${sellerId}/status`, { status });
      setSellers(prev => prev.map(s => String(s._id) === String(sellerId) ? { ...s, status } : s));
    } catch (err) {
      console.error('Status update failed:', err.message);
    }
  };

  // ── Approve / Reject product ──────────────────────────────────────────────
  const updateProductStatus = async (productId, status) => {
    try {
      await api.put(`/admin/product/${productId}/status`, { status });
      setProducts(prev => prev.map(p => String(p._id) === String(productId) ? { ...p, status } : p));
    } catch (err) {
      console.error('Product status update failed:', err.message);
    }
  };

  // ── Socket listeners ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;
    socket.on('online_sellers', list => setOnlineSellers(list));
    socket.on('receive_message', data => {
      const sid = String(data.senderId);
      const key = String(data._id);
      if (seenIds.current.has(key)) return;
      seenIds.current.add(key);
      setConversations(prev => ({
        ...prev,
        [sid]: [...(prev[sid] || []), { ...data, mine: false }],
      }));
    });
    socket.on('message_sent', data => {
      const rid = String(data.receiverId);
      const key = String(data._id);
      if (seenIds.current.has(key)) return;
      seenIds.current.add(key);
      setConversations(prev => {
        const msgs = prev[rid] || [];
        const idx = msgs.findIndex(m => m._tempKey && !m._id);
        if (idx !== -1) {
          const next = [...msgs];
          next[idx] = { ...data, mine: true };
          return { ...prev, [rid]: next };
        }
        return { ...prev, [rid]: [...msgs, { ...data, mine: true }] };
      });
    });
    return () => {
      socket.off('online_sellers');
      socket.off('receive_message');
      socket.off('message_sent');
    };
  }, [socket]);

  // ── Load chat history ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentSellerId || !userInfo) return;
    if (conversations[currentSellerId]) return;
    const adminId = userInfo.id || userInfo._id;
    api.get(`/messages/${currentSellerId}?adminId=${adminId}`)
      .then(({ data }) => {
        const msgs = (data.messages || []).map(m => {
          seenIds.current.add(String(m._id));
          return { ...m, _id: String(m._id), mine: String(m.senderId) === String(adminId) };
        });
        setConversations(prev => ({ ...prev, [currentSellerId]: msgs }));
      })
      .catch(err => console.error('Load history error:', err.message));
  }, [currentSellerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, currentSellerId]);

  // ── Send reply ────────────────────────────────────────────────────────────
  const sendReply = e => {
    e.preventDefault();
    const adminId = userInfo?.id || userInfo?._id;
    if (!input.trim() || !currentSellerId || !socket || !adminId) return;
    const tempKey = `tmp_${Date.now()}`;
    const msg = {
      senderId: String(adminId), receiverId: String(currentSellerId),
      senderName: userInfo?.name || 'Admin', message: input.trim(),
      timestamp: Date.now(), _tempKey: tempKey,
    };
    seenIds.current.add(tempKey);
    setConversations(prev => ({
      ...prev,
      [currentSellerId]: [...(prev[currentSellerId] || []), { ...msg, mine: true }],
    }));
    socket.emit('send_message', msg);
    setInput('');
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const isOnline = id => onlineSellers.some(s => String(s.id) === String(id));
  const getInitials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const adminId = userInfo?.id || userInfo?._id;
  const currentSeller = sellers.find(s => String(s._id) === String(currentSellerId));
  const activeMessages = currentSellerId ? (conversations[currentSellerId] || []) : [];

  // Products for a specific seller
  const sellerProducts = viewingSeller
    ? products.filter(p => String(p.sellerId || p.seller) === String(viewingSeller._id))
    : [];

  // ── Chart data ────────────────────────────────────────────────────────────
  const monthLabels = Array.from({ length: 12 }, (_, i) => moment().subtract(11 - i, 'months').format('MMM'));
  const usersPerMonth = Array(12).fill(0);
  const sellersPerMonth = Array(12).fill(0);
  users.forEach(u => { const d = moment().diff(moment(u.createdAt), 'months'); if (d < 12) usersPerMonth[11 - d]++; });
  sellers.forEach(s => { const d = moment().diff(moment(s.createdAt), 'months'); if (d < 12) sellersPerMonth[11 - d]++; });

  const chartOptions = {
    chart: { background: 'transparent', foreColor: '#64748b', toolbar: { show: false }, type: 'bar' },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: monthLabels, axisBorder: { color: '#e2e8f0' }, axisTicks: { color: '#e2e8f0' } },
    legend: { position: 'top' },
    theme: { mode: 'light' },
    colors: ['#6366f1', '#f59e0b'],
    grid: { borderColor: '#f1f5f9' },
    tooltip: { theme: 'light' },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
  };
  const chartSeries = [
    { name: 'Users', data: usersPerMonth },
    { name: 'Sellers', data: sellersPerMonth },
  ];

  const TABS = ['dashboard', 'sellers', 'products', 'users'];

  // ── Seller detail view ─────────────────────────────────────────────────────
  if (viewingSeller) {
    return (
      <div className="ad-root">
        <div className="ad-seller-detail">
          {/* Header */}
          <div className="ad-detail-header">
            <button className="ad-back-btn" onClick={() => setViewingSeller(null)}>
              <Icon.Back /> Back to Sellers
            </button>
            <div className="ad-detail-seller-info">
              <div className="ad-detail-avatar">{getInitials(viewingSeller.name)}</div>
              <div>
                <h1 className="ad-detail-name">{viewingSeller.name}</h1>
                <div className="ad-detail-meta">
                  <span>{viewingSeller.email}</span>
                  <span className="ad-dot-sep">·</span>
                  <span>{viewingSeller.shopInfo?.shopName || 'No shop name'}</span>
                  <span className="ad-dot-sep">·</span>
                  <StatusBadge status={viewingSeller.status} />
                  {isOnline(viewingSeller._id) && <span className="ad-online-pill">● Online</span>}
                </div>
              </div>
            </div>
            <div className="ad-detail-actions">
              {viewingSeller.status !== 'active' && (
                <button className="ad-btn success" onClick={() => { updateSellerStatus(viewingSeller._id, 'active'); setViewingSeller(s => ({ ...s, status: 'active' })); }}>
                  <Icon.Check /> Approve Seller
                </button>
              )}
              {viewingSeller.status !== 'suspended' && (
                <button className="ad-btn danger" onClick={() => { updateSellerStatus(viewingSeller._id, 'suspended'); setViewingSeller(s => ({ ...s, status: 'suspended' })); }}>
                  <Icon.Ban /> Suspend
                </button>
              )}
              <button className="ad-btn primary" onClick={() => { setCurrentSellerId(String(viewingSeller._id)); setViewingSeller(null); setActiveTab('dashboard'); }}>
                <Icon.Chat /> Chat
              </button>
            </div>
          </div>

          {/* Shop info cards */}
          <div className="ad-shop-cards">
            {[
              ['Shop Name', viewingSeller.shopInfo?.shopName || '—'],
              ['Category', viewingSeller.shopInfo?.category || '—'],
              ['District', viewingSeller.shopInfo?.district || '—'],
              ['Joined', viewingSeller.createdAt ? moment(viewingSeller.createdAt).format('DD MMM YYYY') : '—'],
              ['Products', sellerProducts.length],
              ['Active Products', sellerProducts.filter(p => p.status === 'active').length],
            ].map(([k, v]) => (
              <div key={k} className="ad-shop-card">
                <div className="ad-shop-card-val">{v}</div>
                <div className="ad-shop-card-key">{k}</div>
              </div>
            ))}
          </div>

          {/* Products */}
          <div className="ad-panel">
            <div className="ad-panel-header">
              <h2 className="ad-panel-title">
                <Icon.Package /> Products by {viewingSeller.name}
                <span className="ad-count-chip">{sellerProducts.length}</span>
              </h2>
            </div>

            {sellerProducts.length === 0 ? (
              <div className="ad-empty">
                <Icon.ImageOff />
                <p>This seller hasn't added any products yet.</p>
              </div>
            ) : (
              <div className="ad-product-grid">
                {sellerProducts.map(p => (
                  <div key={p._id} className="ad-product-card">
                    <div className="ad-product-img-wrap">
                      {p.image
                        ? <img src={p.image} alt={p.name} className="ad-product-img" />
                        : <div className="ad-product-img-placeholder"><Icon.ImageOff /></div>
                      }
                      <span className={`ad-product-status-chip ${p.status === 'active' ? 'green' : p.status === 'pending' ? 'amber' : 'red'}`}>
                        {p.status || 'pending'}
                      </span>
                    </div>
                    <div className="ad-product-body">
                      <div className="ad-product-name">{p.name}</div>
                      <div className="ad-product-cat">{p.category || 'Uncategorised'}</div>
                      <div className="ad-product-price">${(p.price / 100).toFixed(2)}</div>
                      {p.description && <div className="ad-product-desc">{p.description}</div>}
                      {p.keywords?.length > 0 && (
                        <div className="ad-product-tags">
                          {p.keywords.slice(0, 4).map(k => <span key={k} className="ad-tag">{k}</span>)}
                        </div>
                      )}
                      <div className="ad-product-stock">Stock: {p.stock ?? '—'}</div>
                    </div>
                    <div className="ad-product-foot">
                      {p.status !== 'active' && (
                        <button className="ad-btn success sm" onClick={() => updateProductStatus(p._id, 'active')}>
                          <Icon.Check /> Approve
                        </button>
                      )}
                      {p.status !== 'rejected' && (
                        <button className="ad-btn danger sm" onClick={() => updateProductStatus(p._id, 'rejected')}>
                          <Icon.Ban /> Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Main Dashboard ─────────────────────────────────────────────────────────
  return (
    <div className="ad-root">
      {/* Tab Bar */}
      <div className="ad-tabbar">
        <div className="ad-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`ad-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <button className="ad-refresh-btn" onClick={fetchData}>
          <Icon.Refresh /> Refresh
        </button>
      </div>

      {/* ── DASHBOARD TAB ─────────────────────────────────────────────────── */}
      {activeTab === 'dashboard' && (
        <>
          <div className="ad-stat-grid">
            <StatCard icon={<MdCurrencyExchange size={20} />} label="Total Sales" value="$0" color="red" />
            <StatCard icon={<MdProductionQuantityLimits size={20} />} label="Products" value={products.length} color="violet" />
            <StatCard icon={<FaUsers size={18} />} label="Sellers" value={sellers.length} color="green" />
            <StatCard icon={<FaUsers size={18} />} label="Users" value={users.length} color="blue" />
            <StatCard icon={<FaCartShopping size={18} />} label="Online Sellers" value={onlineSellers.length} color="amber" />
          </div>

          <div className="ad-dashboard-grid">
            {/* Chart */}
            <div className="ad-panel">
              <h3 className="ad-panel-title">Registrations — Last 12 Months</h3>
              {loading
                ? <p className="ad-loading-text">Loading chart data…</p>
                : <Chart options={chartOptions} series={chartSeries} type="bar" height={290} />
              }
            </div>

            {/* Chat */}
            <div className="ad-panel ad-chat-panel">
              <div className="ad-chat-head">
                <div>
                  <h3 className="ad-panel-title">
                    {currentSeller ? `Chat — ${currentSeller.name}` : 'Seller Live Chat'}
                  </h3>
                  {currentSeller && (
                    <span className={`ad-chat-status ${isOnline(currentSellerId) ? 'online' : 'offline'}`}>
                      {isOnline(currentSellerId) ? '● Online' : '○ Offline'}
                    </span>
                  )}
                </div>
                <div className="ad-seller-pills">
                  {onlineSellers.length === 0
                    ? <span className="ad-no-sellers">No sellers online</span>
                    : onlineSellers.map(s => (
                      <button
                        key={s.id}
                        className={`ad-seller-pill${currentSellerId === s.id ? ' active' : ''}`}
                        onClick={() => setCurrentSellerId(s.id)}
                      >
                        {s.name}
                      </button>
                    ))
                  }
                </div>
              </div>

              <div className="ad-chat-messages">
                {!currentSellerId ? (
                  <div className="ad-chat-empty">Select a seller above to start chatting</div>
                ) : activeMessages.length === 0 ? (
                  <div className="ad-chat-empty">No messages yet</div>
                ) : activeMessages.map((m, i) => {
                  const mine = String(m.senderId) === String(adminId) || m.mine;
                  return (
                    <div key={m._id || m._tempKey || i} className={`ad-msg ${mine ? 'mine' : 'theirs'}`}>
                      {!mine && <div className="ad-msg-avatar">{getInitials(currentSeller?.name)}</div>}
                      <div className="ad-bubble-wrap">
                        <div className={`ad-bubble ${mine ? 'mine' : 'theirs'}`}>{m.message}</div>
                        <div className="ad-msg-time">{moment(m.timestamp).fromNow()}</div>
                      </div>
                      {mine && <div className="ad-msg-avatar admin">A</div>}
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <form className="ad-chat-form" onSubmit={sendReply}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={currentSellerId ? `Message ${currentSeller?.name || 'seller'}…` : 'Select a seller first'}
                  disabled={!currentSellerId}
                  autoComplete="off"
                />
                <button type="submit" disabled={!currentSellerId || !input.trim()}>
                  <Icon.Send />
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* ── SELLERS TAB ───────────────────────────────────────────────────── */}
      {activeTab === 'sellers' && (
        <div className="ad-panel">
          <div className="ad-panel-header">
            <h2 className="ad-panel-title"><Icon.Store /> Sellers <span className="ad-count-chip">{sellers.length}</span></h2>
          </div>
          {loading ? <p className="ad-loading-text">Loading…</p> : (
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Seller</th><th>Email</th><th>Shop</th>
                    <th>Category</th><th>District</th><th>Status</th>
                    <th>Online</th><th>Joined</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.length === 0
                    ? <tr><td colSpan={9} className="ad-td-empty">No sellers yet</td></tr>
                    : sellers.map(s => (
                      <tr key={s._id}>
                        <td>
                          <div className="ad-cell-user">
                            {s.image
                              ? <img src={s.image} alt={s.name} className="ad-cell-avatar-img" />
                              : <div className="ad-cell-avatar">{getInitials(s.name)}</div>
                            }
                            <span className="ad-cell-name">{s.name}</span>
                          </div>
                        </td>
                        <td className="ad-td-muted">{s.email}</td>
                        <td>{s.shopInfo?.shopName || '—'}</td>
                        <td>{s.shopInfo?.category || '—'}</td>
                        <td>{s.shopInfo?.district || '—'}</td>
                        <td><StatusBadge status={s.status} /></td>
                        <td>
                          <span className={`ad-online-text ${isOnline(s._id) ? 'online' : 'offline'}`}>
                            {isOnline(s._id) ? '● Online' : '○ Offline'}
                          </span>
                        </td>
                        <td className="ad-td-muted">{s.createdAt ? moment(s.createdAt).format('DD MMM YYYY') : '—'}</td>
                        <td>
                          <div className="ad-row-actions">
                            <button className="ad-btn primary sm" onClick={() => setViewingSeller(s)} title="View products">
                              <Icon.Eye /> View
                            </button>
                            {s.status !== 'active' && (
                              <button className="ad-btn success sm" onClick={() => updateSellerStatus(s._id, 'active')} title="Approve">
                                <Icon.Check />
                              </button>
                            )}
                            {s.status !== 'suspended' && (
                              <button className="ad-btn danger sm" onClick={() => updateSellerStatus(s._id, 'suspended')} title="Suspend">
                                <Icon.Ban />
                              </button>
                            )}
                            <button className="ad-btn ghost sm" onClick={() => { setCurrentSellerId(String(s._id)); setActiveTab('dashboard'); }} title="Chat">
                              <Icon.Chat />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── PRODUCTS TAB ──────────────────────────────────────────────────── */}
      {activeTab === 'products' && (
        <div className="ad-panel">
          <div className="ad-panel-header">
            <h2 className="ad-panel-title"><Icon.Package /> All Products <span className="ad-count-chip">{products.length}</span></h2>
            <div className="ad-product-legend">
              <span className="ad-legend-chip green">Active</span>
              <span className="ad-legend-chip amber">Pending</span>
              <span className="ad-legend-chip red">Rejected</span>
            </div>
          </div>
          {loading ? <p className="ad-loading-text">Loading…</p> : products.length === 0 ? (
            <div className="ad-empty"><Icon.ImageOff /><p>No products uploaded yet.</p></div>
          ) : (
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Product</th><th>Seller</th><th>Category</th>
                    <th>Price</th><th>Stock</th><th>Status</th>
                    <th>Added</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => {
                    const seller = sellers.find(s => String(s._id) === String(p.sellerId || p.seller));
                    return (
                      <tr key={p._id}>
                        <td>
                          <div className="ad-cell-product">
                            {p.image
                              ? <img src={p.image} alt={p.name} className="ad-product-thumb" />
                              : <div className="ad-product-thumb placeholder"><Icon.ImageOff /></div>
                            }
                            <div>
                              <div className="ad-cell-name">{p.name}</div>
                              {p.keywords?.length > 0 && (
                                <div className="ad-mini-tags">
                                  {p.keywords.slice(0, 3).map(k => <span key={k} className="ad-tag mini">{k}</span>)}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          {seller ? (
                            <button className="ad-seller-link" onClick={() => setViewingSeller(seller)}>
                              {seller.name}
                            </button>
                          ) : <span className="ad-td-muted">—</span>}
                        </td>
                        <td className="ad-td-muted">{p.category || '—'}</td>
                        <td className="ad-td-price">${(p.price / 100).toFixed(2)}</td>
                        <td>{p.stock ?? '—'}</td>
                        <td>
                          <span className={`ad-status-chip ${p.status === 'active' ? 'green' : p.status === 'pending' ? 'amber' : 'red'}`}>
                            {p.status || 'pending'}
                          </span>
                        </td>
                        <td className="ad-td-muted">{p.createdAt ? moment(p.createdAt).format('DD MMM YY') : '—'}</td>
                        <td>
                          <div className="ad-row-actions">
                            {p.status !== 'active' && (
                              <button className="ad-btn success sm" onClick={() => updateProductStatus(p._id, 'active')}>
                                <Icon.Check /> Approve
                              </button>
                            )}
                            {p.status !== 'rejected' && (
                              <button className="ad-btn danger sm" onClick={() => updateProductStatus(p._id, 'rejected')}>
                                <Icon.Ban /> Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── USERS TAB ─────────────────────────────────────────────────────── */}
      {activeTab === 'users' && (
        <div className="ad-panel">
          <div className="ad-panel-header">
            <h2 className="ad-panel-title"><Icon.Store /> Users <span className="ad-count-chip">{users.length}</span></h2>
          </div>
          {loading ? <p className="ad-loading-text">Loading…</p> : (
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  {users.length === 0
                    ? <tr><td colSpan={4} className="ad-td-empty">No users yet</td></tr>
                    : users.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div className="ad-cell-user">
                            <div className="ad-cell-avatar blue">{getInitials(u.name)}</div>
                            <span className="ad-cell-name">{u.name}</span>
                          </div>
                        </td>
                        <td className="ad-td-muted">{u.email}</td>
                        <td><span className="ad-role-chip">{u.role || 'user'}</span></td>
                        <td className="ad-td-muted">{u.createdAt ? moment(u.createdAt).format('DD MMM YYYY') : '—'}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  return (
    <div className={`ad-stat-card ${color}`}>
      <div className="ad-stat-icon">{icon}</div>
      <div>
        <div className="ad-stat-val">{value}</div>
        <div className="ad-stat-label">{label}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cls = status === 'active' ? 'green' : status === 'suspended' ? 'red' : 'amber';
  return <span className={`ad-status-chip ${cls}`}>{status || 'pending'}</span>;
}

export default AdminDashboard;
