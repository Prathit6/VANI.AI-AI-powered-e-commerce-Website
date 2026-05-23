// src/components/Header.jsx
// White-themed — uses the version from document 5 as base.
// CHANGES: ProfileModal wired in, outside-click closes dropdown,
//          avatar shows image if uploaded else first letter (no emoji).

import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useCart } from "../context/CartProvider.jsx";
import { user_logout } from "../store/Reducers/authReducer.js";
import { useState, useRef, useEffect } from "react";
import ProfileModal from "./Profilemodal.jsx";

// ─── Mega-menu data ───────────────────────────────────────────────────────────
const NAV_MENU = [
  {
    label: "Men",
    sections: [
      { heading: "New & Featured", links: [{ text: "Latest Arrivals", tag: "NEW", to: "/?cat=men" }, { text: "Best Sellers", tag: "HOT", to: "/?cat=men" }, { text: "New Releases", tag: "", to: "/?cat=men" }] },
      { heading: "Apparel", links: [{ text: "Hoodies & Sweaters", tag: "", to: "/?cat=men" }, { text: "T-Shirts & Polos", tag: "", to: "/?cat=men" }, { text: "Pants & Chinos", tag: "", to: "/?cat=men" }] },
      { heading: "Footwear", links: [{ text: "Sneakers", tag: "", to: "/?cat=men" }, { text: "Athletic Shoes", tag: "", to: "/?cat=men" }] },
      { heading: "Accessories", links: [{ text: "Sunglasses", tag: "", to: "/?cat=men" }, { text: "Hats", tag: "", to: "/?cat=men" }] },
    ],
  },
  {
    label: "Women",
    sections: [
      { heading: "New & Featured", links: [{ text: "Latest Arrivals", tag: "NEW", to: "/?cat=women" }, { text: "Trending Now", tag: "HOT", to: "/?cat=women" }] },
      { heading: "Apparel", links: [{ text: "Sweaters & Tops", tag: "", to: "/?cat=women" }, { text: "Dresses", tag: "", to: "/?cat=women" }, { text: "Shorts & Pants", tag: "", to: "/?cat=women" }, { text: "Loungewear", tag: "", to: "/?cat=women" }] },
      { heading: "Footwear", links: [{ text: "Heels & Sandals", tag: "", to: "/?cat=women" }, { text: "Ballet Flats", tag: "", to: "/?cat=women" }, { text: "Sneakers", tag: "", to: "/?cat=women" }] },
      { heading: "Accessories", links: [{ text: "Earrings", tag: "NEW", to: "/?cat=women" }, { text: "Sunglasses", tag: "", to: "/?cat=women" }, { text: "Beanies", tag: "", to: "/?cat=women" }] },
    ],
  },
  {
    label: "Youth",
    sections: [
      { heading: "New & Featured", links: [{ text: "Latest Arrivals", tag: "NEW", to: "/?cat=youth" }, { text: "Best Sellers", tag: "", to: "/?cat=youth" }] },
      { heading: "Apparel", links: [{ text: "T-Shirts", tag: "", to: "/?cat=youth" }, { text: "Socks", tag: "", to: "/?cat=youth" }] },
      { heading: "Footwear", links: [{ text: "Sneakers", tag: "NEW", to: "/?cat=youth" }, { text: "Skate Shoes", tag: "", to: "/?cat=youth" }] },
    ],
  },
  {
    label: "Kitchen",
    sections: [
      { heading: "Appliances", links: [{ text: "Toasters", tag: "", to: "/?cat=kitchen" }, { text: "Kettles", tag: "", to: "/?cat=kitchen" }, { text: "Blenders", tag: "", to: "/?cat=kitchen" }, { text: "Espresso Makers", tag: "NEW", to: "/?cat=kitchen" }] },
      { heading: "Cookware", links: [{ text: "Cooking Sets", tag: "HOT", to: "/?cat=kitchen" }, { text: "Non-Stick Pans", tag: "", to: "/?cat=kitchen" }, { text: "Bowl Sets", tag: "", to: "/?cat=kitchen" }] },
      { heading: "Storage", links: [{ text: "Food Containers", tag: "", to: "/?cat=kitchen" }, { text: "Paper Towels", tag: "", to: "/?cat=kitchen" }] },
    ],
  },
  {
    label: "Home",
    sections: [
      { heading: "Bath", links: [{ text: "Towel Sets", tag: "HOT", to: "/?cat=home" }, { text: "Bath Mats", tag: "", to: "/?cat=home" }] },
      { heading: "Bedroom", links: [{ text: "Duvet Covers", tag: "NEW", to: "/?cat=home" }, { text: "Blackout Curtains", tag: "", to: "/?cat=home" }] },
      { heading: "Decor", links: [{ text: "Vanity Mirrors", tag: "HOT", to: "/?cat=home" }] },
    ],
  },
  {
    label: "Sports",
    sections: [
      { heading: "Equipment", links: [{ text: "Basketballs", tag: "NEW", to: "/?cat=sports" }, { text: "Soccer Balls", tag: "", to: "/?cat=sports" }] },
      { heading: "Apparel", links: [{ text: "Athletic Shoes", tag: "", to: "/?cat=sports" }, { text: "Socks", tag: "", to: "/?cat=sports" }, { text: "Hats", tag: "", to: "/?cat=sports" }] },
    ],
  },
];

// ─── Role config (no emoji) ───────────────────────────────────────────────────
const ROLE_CONFIG = {
  admin: { label: "Admin", color: "#ef4444", accentBg: "#fef2f2" },
  seller: { label: "Seller", color: "#d97706", accentBg: "#fffbeb" },
  user: { label: "Customer", color: "#6366f1", accentBg: "#eef2ff" },
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconPackage = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconSettings = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);
const IconStore = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IconLogOut = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconFlame = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────
export function Header() {
  const { getTotalQuantity } = useCart();
  const { token, userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const closeTimer = useRef(null);
  const dropdownRef = useRef(null);

  const cartCount = getTotalQuantity();
  const isLoggedIn = !!token;
  const role = userInfo?.role?.toLowerCase() || "user";
  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG.user;

  // First letter only
  const getInitial = (name) => (name ? name.trim()[0].toUpperCase() : "?");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await dispatch(user_logout());
    setDropdownOpen(false);
    navigate("/login");
  };

  const openDrop = (label) => { clearTimeout(closeTimer.current); setOpenMenu(label); };
  const closeDrop = () => { closeTimer.current = setTimeout(() => setOpenMenu(null), 130); };

  // ── Avatar: shows uploaded image, else first letter ───────────────────────
  const Avatar = ({ size = 32 }) => {
    const hasImage =
      userInfo?.image &&
      userInfo.image !== "user.png" &&
      !userInfo.image.endsWith("user.png");

    const src = hasImage
      ? (userInfo.image.startsWith("http")
        ? userInfo.image
        : `http://localhost:5001/${userInfo.image}`)
      : null;

    return (
      <div style={{
        width: size, height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        background: hasImage ? "transparent" : roleConfig.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 700,
        fontSize: size * 0.40,
        color: "#fff",
        border: `2px solid ${roleConfig.color}33`,
      }}>
        {hasImage
          ? <img src={src} alt={userInfo.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { e.target.style.display = "none"; e.target.parentNode.textContent = getInitial(userInfo?.name); }} />
          : getInitial(userInfo?.name)
        }
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .mm-banner {
          background: #f4f4f5; color: #18181b; text-align: center;
          font-size: 12.5px; letter-spacing: .02em; padding: 8px 16px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
          border-bottom: 1px solid #e4e4e7;
        }
        .mm-nav { display: flex; align-items: center; gap: 4px; flex: 1; }
        .mm-trigger {
          position: relative; background: none; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600;
          color: #52525b; padding: 8px 14px; border-radius: 8px;
          display: flex; align-items: center; gap: 4px;
          transition: all .2s ease; white-space: nowrap;
        }
        .mm-trigger:hover, .mm-trigger.mm-open { color: #000; background: #f4f4f5; }
        .mm-trigger svg { transition: transform .2s ease; flex-shrink: 0; opacity: 0.6; }
        .mm-trigger.mm-open svg { transform: rotate(180deg); opacity: 1; }

        .mm-plain {
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600;
          color: #52525b; padding: 8px 14px; border-radius: 8px; text-decoration: none;
          transition: all .2s ease; white-space: nowrap;
          display: flex; align-items: center; gap: 5px;
        }
        .mm-plain:hover { color: #000; background: #f4f4f5; }
        .mm-plain.mm-hot { color: #ef4444; }
        .mm-plain.mm-hot:hover { color: #dc2626; background: #fef2f2; }

        .mm-drop {
          position: absolute; top: calc(100% + 8px); left: 0;
          background: #ffffff; border: 1px solid #e4e4e7; border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
          padding: 24px; display: flex; gap: 32px;
          animation: mmDrop .2s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 2000; min-width: 600px;
        }
        @keyframes mmDrop {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .mm-section { min-width: 130px; }
        .mm-section-heading {
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 700;
          letter-spacing: .05em; text-transform: uppercase; color: #a1a1aa;
          margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #f4f4f5;
        }
        .mm-link {
          display: flex; align-items: center; gap: 6px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 500;
          color: #71717a; text-decoration: none; padding: 6px 0; white-space: nowrap;
          transition: color .15s ease;
        }
        .mm-link:hover { color: #000; }
        .mm-tag-new { font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: #dcfce7; color: #166534; }
        .mm-tag-hot { font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: #fee2e2; color: #991b1b; }

        .site-header { background: #ffffff; border-bottom: 1px solid #e4e4e7; z-index: 1000; }
        .header-inner {
          max-width: 1400px; margin: 0 auto; padding: 0 24px; height: 72px;
          display: flex; align-items: center; gap: 40px;
        }
        .header-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .logo-badge {
          background: #000; color: #fff; width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; font-weight: 800; font-size: 18px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .logo-name { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 20px; color: #000; letter-spacing: -0.02em; }
        .logo-dot { color: #ef4444; }

        .mm-mobile-overlay {
          display: none; position: fixed; inset: 0; background: #ffffff;
          z-index: 3000; overflow-y: auto; padding: 24px; flex-direction: column;
        }
        .mm-mobile-overlay.open { display: flex; }
        .mm-mobile-close {
          align-self: flex-end; background: #f4f4f5; border: none; cursor: pointer;
          color: #18181b; width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; margin-bottom: 32px; transition: background .2s;
        }
        .mm-mobile-close:hover { background: #e4e4e7; }
        .mm-mobile-close svg { width: 18px; height: 18px; }
        .mm-mobile-item {
          display: block; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 700;
          color: #18181b; padding: 16px 0; border-bottom: 1px solid #f4f4f5;
          text-decoration: none; transition: color .2s;
        }
        .mm-mobile-item:hover { color: #ef4444; }

        @media (max-width: 900px) {
          .mm-nav { display: none; }
          .mm-hamburger { display: flex !important; }
          .header-inner { gap: 20px; justify-content: space-between; }
        }

        .header-actions { display: flex; align-items: center; gap: 16px; margin-left: auto; }
        .nb-icon-btn {
          background: none; border: none; cursor: pointer; color: #52525b; padding: 8px;
          border-radius: 8px; transition: all .2s; position: relative;
          display: flex; align-items: center; justify-content: center; text-decoration: none;
        }
        .nb-icon-btn:hover { background: #f4f4f5; color: #000; }
        .cart-badge {
          position: absolute; top: 4px; right: 4px; background: #ef4444; color: #fff;
          font-size: 10px; font-weight: 700; min-width: 16px; height: 16px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
        }

        /* ── User trigger pill ── */
        .user-menu {
          display: flex; align-items: center; gap: 9px;
          padding: 5px 10px 5px 5px; border-radius: 40px; cursor: pointer;
          border: 1.5px solid #e4e4e7; background: #fff;
          transition: all .2s ease; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .user-menu:hover { border-color: #d4d4d8; background: #fafafa; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .user-info { display: flex; flex-direction: column; line-height: 1.2; }
        .user-name { font-size: 13px; font-weight: 700; color: #18181b; max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .user-role { font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }

        /* ── Dropdown ── */
        .user-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: #fff; border: 1.5px solid #e4e4e7; border-radius: 16px;
          box-shadow: 0 16px 32px -8px rgba(0,0,0,0.12), 0 4px 8px -2px rgba(0,0,0,0.06);
          min-width: 260px; padding: 6px; z-index: 2000;
          animation: mmDrop .18s cubic-bezier(0.16,1,0.3,1);
        }

        /* profile card inside dropdown */
        .dropdown-profile-card {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 10px 14px; border-radius: 10px; margin-bottom: 2px;
        }
        .dropdown-profile-info { flex: 1; min-width: 0; }
        .dropdown-profile-name { font-size: 14px; font-weight: 700; color: #18181b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dropdown-profile-email { font-size: 12px; color: #71717a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
        .dropdown-profile-location { font-size: 11px; color: #a1a1aa; margin-top: 3px; display: flex; align-items: center; gap: 3px; }
        .role-pill {
          display: inline-flex; align-items: center; padding: 2px 8px;
          border-radius: 20px; font-size: 10px; font-weight: 700;
          letter-spacing: .04em; text-transform: uppercase; margin-top: 4px;
        }

        .dropdown-divider { height: 1px; background: #f4f4f5; margin: 4px 0; }

        /* dropdown row items */
        .dropdown-item {
          display: flex; align-items: center; gap: 10px; padding: 10px 12px;
          border-radius: 9px; text-decoration: none; color: #3f3f46;
          font-size: 13.5px; font-weight: 500; font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; transition: all .15s ease;
          background: none; border: none; width: 100%; text-align: left;
        }
        .dropdown-item:hover { background: #f4f4f5; color: #18181b; }
        .dropdown-item.logout-item:hover { color: #ef4444; background: #fef2f2; }
        .dropdown-item svg { flex-shrink: 0; opacity: 0.65; }
        .dropdown-item:hover svg { opacity: 1; }
        .dropdown-item.logout-item:hover svg { color: #ef4444; }

        .auth-buttons { display: flex; gap: 8px; }
        .btn-ghost { padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; color: #52525b; transition: all .2s; font-family: 'Plus Jakarta Sans', sans-serif; }
        .btn-ghost:hover { background: #f4f4f5; color: #000; }
        .btn-solid { padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; background: #000; color: #fff; transition: all .2s; font-family: 'Plus Jakarta Sans', sans-serif; }
        .btn-solid:hover { background: #27272a; }
      `}</style>

      {/* ── Banner ── */}
      <div className="mm-banner">Free Shipping on Orders over $75 (Indore Only)</div>

      {/* ── Main header ── */}
      <header className="site-header" style={{ position: "sticky", top: 0 }}>
        <div className="header-inner">

          {/* Logo */}
          <Link to="/" className="header-logo">
            <span className="logo-badge">V</span>
            <span className="logo-name">ANI<span className="logo-dot">.</span>AI</span>
          </Link>

          {/* Mega-menu nav */}
          <nav className="mm-nav">
            {NAV_MENU.map((item) => (
              <div key={item.label} style={{ position: "relative" }}
                onMouseEnter={() => openDrop(item.label)}
                onMouseLeave={closeDrop}
              >
                <button className={`mm-trigger ${openMenu === item.label ? "mm-open" : ""}`}>
                  {item.label}
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {openMenu === item.label && (
                  <div className="mm-drop"
                    onMouseEnter={() => openDrop(item.label)}
                    onMouseLeave={closeDrop}
                  >
                    {item.sections.map((sec) => (
                      <div key={sec.heading} className="mm-section">
                        <p className="mm-section-heading">{sec.heading}</p>
                        {sec.links.map((link) => (
                          <Link key={link.text} to={link.to} className="mm-link">
                            {link.text}
                            {link.tag === "NEW" && <span className="mm-tag-new">NEW</span>}
                            {link.tag === "HOT" && <span className="mm-tag-hot">HOT</span>}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link to="/" className="mm-plain">Shop All</Link>
            <Link to="/?cat=new" className="mm-plain mm-hot">
              <IconFlame />New Releases
            </Link>
          </nav>

          {/* Right actions */}
          <div className="header-actions">
            {/* Cart */}
            <Link to="/checkout" className="nb-icon-btn" title="Shopping Cart">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
                <path d="M3 6h18M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* User account */}
            {isLoggedIn && userInfo ? (
              <div ref={dropdownRef} style={{ position: "relative" }}>
                {/* Pill trigger */}
                <div className="user-menu" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <Avatar size={30} />
                  <div className="user-info">
                    <span className="user-name">{userInfo.name?.split(" ")[0]}</span>
                    <span className="user-role" style={{ color: roleConfig.color }}>{roleConfig.label}</span>
                  </div>
                  <svg style={{ transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "none", opacity: 0.5 }}
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="user-dropdown">
                    {/* Profile card */}
                    <div className="dropdown-profile-card">
                      <Avatar size={42} />
                      <div className="dropdown-profile-info">
                        <div className="dropdown-profile-name">{userInfo.name}</div>
                        <div className="dropdown-profile-email">{userInfo.email}</div>
                        {userInfo.location && (
                          <div className="dropdown-profile-location">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            {userInfo.location}
                          </div>
                        )}
                        <span className="role-pill" style={{ background: roleConfig.accentBg, color: roleConfig.color }}>
                          {roleConfig.label}
                        </span>
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    {/* Edit Profile */}
                    <button className="dropdown-item" onClick={() => { setProfileOpen(true); setDropdownOpen(false); }}>
                      <IconUser />
                      Edit Profile
                    </button>

                    {/* Orders */}
                    <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <IconPackage />
                      My Orders
                    </Link>

                    {/* Seller Dashboard */}
                    {role === "seller" && (
                      <Link to="/seller/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <IconStore />
                        Seller Dashboard
                      </Link>
                    )}

                    {/* Admin Dashboard */}
                    {role === "admin" && (
                      <Link to="/admin/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <IconSettings />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="dropdown-divider" />

                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <IconLogOut />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-ghost">Sign In</Link>
                <Link to="/register" className="btn-solid">Register</Link>
              </div>
            )}

            {/* Hamburger */}
            <button className="nb-icon-btn mm-hamburger" style={{ display: "none" }} onClick={() => setMobileOpen(true)}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className={`mm-mobile-overlay ${mobileOpen ? "open" : ""}`}>
        <button className="mm-mobile-close" onClick={() => setMobileOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <Link to="/" className="header-logo" style={{ marginBottom: 32 }} onClick={() => setMobileOpen(false)}>
          <span className="logo-badge">V</span>
          <span className="logo-name">ANI<span className="logo-dot">.</span>AI</span>
        </Link>

        {NAV_MENU.map((item) => (
          <Link key={item.label} to={`/?cat=${item.label.toLowerCase()}`}
            className="mm-mobile-item" onClick={() => setMobileOpen(false)}>
            {item.label}
          </Link>
        ))}
        <Link to="/" className="mm-mobile-item" onClick={() => setMobileOpen(false)}>Shop All</Link>
        <Link to="/?cat=new" className="mm-mobile-item" style={{ color: "#ef4444" }} onClick={() => setMobileOpen(false)}>
          New Releases
        </Link>

        <div style={{ marginTop: "auto", paddingTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
          {isLoggedIn ? (
            <button className="btn-solid"
              style={{ padding: "12px 16px", border: "none", cursor: "pointer", borderRadius: 8, textAlign: "center" }}
              onClick={() => { handleLogout(); setMobileOpen(false); }}>
              Sign Out
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-ghost" style={{ textAlign: "center" }} onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn-solid" style={{ textAlign: "center" }} onClick={() => setMobileOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
    </>
  );
}

export default Header;
