// src/views/Pages/Landing/Footer.jsx
import { useState } from "react";
import {
  FaCcAmazonPay,
  FaCcAmex,
  FaApplePay,
  FaCcDinersClub,
  FaCcDiscover,
  FaGooglePay,
  FaCcMastercard,
  FaPaypal,
  FaCcVisa,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPinterestP,
  FaSnapchatGhost,
} from "react-icons/fa";
import { SiTiktok, SiPhonepe, SiPaytm } from "react-icons/si";
import { RiTwitterXFill } from "react-icons/ri";

const SUPPORT_LINKS = [
  "FAQs",
  "Size Details",
  "Track Your Order",
  "Account Login",
  "Start a Return / Exchange",
  "Contact Us",
];

const COMPANY_LINKS = [
  "About Us",
  "Reviews",
  "Accessibility Statement",
  "Terms and Conditions",
  "Privacy Policy",
  "Reseller Policy",
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: <FaFacebookF />,
    color: "#1877F2",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: <FaInstagram />,
    color: "#E4405F",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: <FaYoutube />,
    color: "#FF0000",
  },
  {
    label: "TikTok",
    href: "https://tiktok.com",
    icon: <SiTiktok />,
    color: "#ffffff",
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com",
    icon: <FaPinterestP />,
    color: "#E60023",
  },
  {
    label: "Snapchat",
    href: "https://snapchat.com",
    icon: <FaSnapchatGhost />,
    color: "#FFFC00",
  },
  {
    label: "X",
    href: "https://x.com",
    icon: <RiTwitterXFill />,
    color: "#ffffff",
  },
];

const PAYMENT_METHODS = [
  { name: "Amazon Pay", icon: <FaCcAmazonPay /> },
  { name: "Amex", icon: <FaCcAmex /> },
  { name: "Apple Pay", icon: <FaApplePay /> },
  { name: "Diners", icon: <FaCcDinersClub /> },
  { name: "Discover", icon: <FaCcDiscover /> },
  { name: "Google Pay", icon: <FaGooglePay /> },
  { name: "Mastercard", icon: <FaCcMastercard /> },
  { name: "PayPal", icon: <FaPaypal /> },
  { name: "PhonePe", icon: <SiPhonepe /> },
  { name: "Paytm", icon: <SiPaytm /> },
  { name: "Visa", icon: <FaCcVisa /> },
];

const LEGAL_LINKS = [
  "Refund Policy",
  "Privacy Policy",
  "Terms of Service",
  "Shipping Policy",
  "Contact Information",
  "Cancellation Policy",
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSubmitted(true);
    setEmail("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

        .ft-root {
          background: #050505;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          border-top: 1px solid rgba(255,255,255,.06);
          overflow: hidden;
        }

        .ft-top {
          max-width: 1280px;
          margin: 0 auto;
          padding: 65px 24px 0;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 56px;
        }

        .ft-signup-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: .06em;
          text-transform: uppercase;
          margin: 0 0 12px;
        }

        .ft-signup-desc {
          font-size: 13.5px;
          color: rgba(255,255,255,.42);
          margin: 0 0 22px;
          line-height: 1.7;
          max-width: 460px;
        }

        .ft-form {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .ft-input {
          flex: 1;
          min-width: 180px;
          background: #101010;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 12px;
          padding: 13px 16px;
          font-size: 13px;
          color: #fff;
          outline: none;
          transition: all .18s ease;
        }

        .ft-input:focus {
          border-color: #22d3ee;
          box-shadow: 0 0 0 4px rgba(34,211,238,.08);
        }

        .ft-input::placeholder {
          color: rgba(255,255,255,.25);
        }

        .ft-submit {
          background: linear-gradient(135deg, #22d3ee, #3b82f6);
          color: #fff;
          border: none;
          cursor: pointer;
          padding: 13px 22px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
          transition: all .18s ease;
          white-space: nowrap;
        }

        .ft-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(34,211,238,.22);
        }

        .ft-success {
          font-size: 12.5px;
          color: #22c55e;
          margin-top: 10px;
          font-weight: 600;
        }

        .ft-error {
          font-size: 12px;
          color: #ef4444;
          margin-top: 8px;
        }

        .ft-privacy {
          font-size: 11px;
          color: rgba(255,255,255,.22);
          margin-top: 14px;
          cursor: pointer;
          text-decoration: underline;
          display: inline-block;
          transition: color .15s ease;
        }

        .ft-privacy:hover {
          color: rgba(255,255,255,.55);
        }

        .ft-col-title {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: rgba(255,255,255,.3);
          margin: 0 0 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }

        .ft-link {
          display: block;
          font-size: 13px;
          color: rgba(255,255,255,.5);
          text-decoration: none;
          padding: 7px 0;
          transition: all .15s ease;
        }

        .ft-link:hover {
          color: #22d3ee;
          transform: translateX(3px);
        }

        .ft-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,.06);
          margin: 54px 0 0;
        }

        .ft-bottom {
          max-width: 1280px;
          margin: 0 auto;
          padding: 30px 24px 40px;
        }

        .ft-socials-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: rgba(255,255,255,.24);
          margin-bottom: 14px;
        }

        .ft-socials {
          display: flex;
          gap: 14px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .ft-social-btn {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          text-decoration: none;
          transition: all .18s ease;
          backdrop-filter: blur(8px);
        }

        .ft-social-btn:hover {
          transform: translateY(-4px) scale(1.06);
          background: rgba(255,255,255,.08);
          box-shadow: 0 10px 24px rgba(0,0,0,.28);
        }

        .ft-payments {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        .ft-pay-badge {
          width: 58px;
          height: 38px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: rgba(255,255,255,.8);
          transition: all .18s ease;
        }

        .ft-pay-badge:hover {
          transform: translateY(-3px);
          border-color: #22d3ee;
          color: #22d3ee;
          background: rgba(34,211,238,.08);
          box-shadow: 0 8px 18px rgba(34,211,238,.12);
        }

        .ft-legal {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 14px;
          align-items: center;
          font-size: 11.5px;
          color: rgba(255,255,255,.22);
          line-height: 1.7;
        }

        .ft-legal a {
          color: rgba(255,255,255,.22);
          text-decoration: none;
          transition: color .15s ease;
        }

        .ft-legal a:hover {
          color: rgba(255,255,255,.55);
        }

        .ft-legal-dot {
          color: rgba(255,255,255,.12);
        }

        @media (max-width: 900px) {
          .ft-top {
            grid-template-columns: 1fr 1fr;
            gap: 38px;
          }

          .ft-signup-col {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 560px) {
          .ft-top {
            grid-template-columns: 1fr;
            gap: 34px;
            padding-top: 52px;
          }

          .ft-signup-col {
            grid-column: auto;
          }

          .ft-social-btn {
            width: 42px;
            height: 42px;
            font-size: 17px;
          }

          .ft-pay-badge {
            width: 54px;
            height: 36px;
            font-size: 24px;
          }
        }
      `}</style>

      <footer className="ft-root">
        <div className="ft-top">
          {/* Signup */}
          <div className="ft-signup-col">
            <h3 className="ft-signup-title">Sign Up and Save</h3>

            <p className="ft-signup-desc">
              Be the first to know about our latest drops, exclusive offers,
              premium collections, and upcoming fashion launches.
            </p>

            {!submitted ? (
              <>
                <div className="ft-form">
                  <input
                    className="ft-input"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSubmit()
                    }
                  />

                  <button className="ft-submit" onClick={handleSubmit}>
                    Subscribe
                  </button>
                </div>

                {error && <p className="ft-error">{error}</p>}
              </>
            ) : (
              <p className="ft-success">
                ✓ You're on the list! Thanks for subscribing.
              </p>
            )}

            <span className="ft-privacy">Privacy Policy</span>
          </div>

          {/* Support */}
          <div>
            <p className="ft-col-title">Support</p>

            {SUPPORT_LINKS.map((l) => (
              <a key={l} href="#" className="ft-link">
                {l}
              </a>
            ))}
          </div>

          {/* Company */}
          <div>
            <p className="ft-col-title">Company</p>

            {COMPANY_LINKS.map((l) => (
              <a key={l} href="#" className="ft-link">
                {l}
              </a>
            ))}
          </div>
        </div>

        <hr className="ft-divider" />

        <div className="ft-bottom">
          <p className="ft-socials-label">Connect With Us</p>

          <div className="ft-socials">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                className="ft-social-btn"
                href={s.href}
                target="_blank"
                rel="noreferrer"
                title={s.label}
                style={{ color: s.color }}
              >
                {s.icon}
              </a>
            ))}
          </div>

          <div className="ft-payments">
            {PAYMENT_METHODS.map((p) => (
              <div
                key={p.name}
                className="ft-pay-badge"
                title={p.name}
              >
                {p.icon}
              </div>
            ))}
          </div>

          <div className="ft-legal">
            <span>
              © {new Date().getFullYear()} VANI AI Fashion. All rights reserved.
            </span>

            <span className="ft-legal-dot">·</span>

            {LEGAL_LINKS.map((l, i) => (
              <span
                key={l}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <a href="#">{l}</a>

                {i < LEGAL_LINKS.length - 1 && (
                  <span className="ft-legal-dot">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
