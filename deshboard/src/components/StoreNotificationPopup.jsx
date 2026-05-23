import { useState, useEffect, useRef } from "react";

/**
 * StoreNotificationPopup — Compact MrBeast-style notification
 *
 * Props:
 *   storeName    – "MyStore.com"
 *   logoSrc      – "/logo.png"  ← put logo in /public, pass "/logo.png"
 *   logoAlt      – alt text for logo
 *   title        – override headline
 *   description  – override body text
 *   emoji        – emoji after title (default "🛍️")
 *   allowLabel   – confirm button text (default "Allow")
 *   laterLabel   – dismiss button text (default "Later")
 *   onAllow      – callback on Allow click
 *   onLater      – callback on Later click
 *   delayMs      – ms before popup shows (default 1500)
 *   storageKey   – localStorage key name
 *   revisitMs    – ms after leaving before showing again (default 60000 = 1 min)
 */
export default function StoreNotificationPopup({
  storeName = "MyStore.com",
  logoSrc = null,
  logoAlt = "Store Logo",
  title,
  description,
  emoji = "🛍️",
  allowLabel = "Allow",
  laterLabel = "Later",
  onAllow,
  onLater,
  delayMs = 1500,
  storageKey = "store_notif",
  revisitMs = 60_000,
}) {
  const [visible, setVisible] = useState(false);
  const [animOut, setAnimOut] = useState(false);
  const timerRef = useRef(null);

  const headlineText = title ?? `Stay Connected With ${storeName} ${emoji}`;
  const bodyText =
    description ??
    "Be the first to know about a new drop, new offers, and rad new collectibles!";

  // ── Show logic ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const { dismissed, ts } = JSON.parse(raw);
      if (dismissed === "permanent") return;                        // clicked Allow → never again
      if (dismissed === "later" && Date.now() - ts < revisitMs) return; // too soon
    }
    timerRef.current = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(timerRef.current);
  }, [delayMs, storageKey, revisitMs]);

  // ── When user leaves / hides tab → clear "later" so 1-min timer resets ──────
  useEffect(() => {
    const clearOnLeave = () => {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const { dismissed } = JSON.parse(raw);
      if (dismissed !== "permanent") localStorage.removeItem(storageKey);
    };
    window.addEventListener("pagehide", clearOnLeave);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") clearOnLeave();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", clearOnLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [storageKey]);

  // ── Dismiss helper ───────────────────────────────────────────────────────────
  const dismiss = (type, cb) => {
    setAnimOut(true);
    setTimeout(() => {
      setVisible(false);
      setAnimOut(false);
      localStorage.setItem(
        storageKey,
        JSON.stringify({ dismissed: type, ts: Date.now() })
      );
      cb?.();
    }, 280);
  };

  const handleAllow = () => {
    if ("Notification" in window) Notification.requestPermission();
    dismiss("permanent", onAllow);
  };
  const handleLater = () => dismiss("later", onLater);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes snp-drop {
          0%   { opacity:0; transform:translateY(-20px) scale(.92); }
          60%  { transform:translateY(3px) scale(1.01); }
          100% { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes snp-rise {
          from { opacity:1; transform:translateY(0) scale(1); }
          to   { opacity:0; transform:translateY(-14px) scale(.95); }
        }
        @keyframes snp-logo-bounce {
          0%,100% { transform:rotate(0deg) scale(1); }
          20%     { transform:rotate(-7deg) scale(1.05); }
          50%     { transform:rotate(6deg) scale(1.05); }
          75%     { transform:rotate(-3deg) scale(1); }
        }

        [data-snp-wrap] {
          position:fixed; top:14px; left:50%;
          transform:translateX(-50%);
          z-index:99999; pointer-events:none;
        }

        [data-snp-card] {
          pointer-events:all;
          background:#fff;
          border-radius:13px;
          box-shadow:0 2px 6px rgba(0,0,0,.07),0 8px 20px rgba(0,0,0,.13);
          padding:10px 13px 10px 10px;
          width:320px;
          max-width:calc(100vw - 20px);
          display:flex; align-items:center; gap:10px;
          animation:snp-drop .4s cubic-bezier(.22,.68,0,1.28) forwards;
        }
        [data-snp-card][data-out] {
          animation:snp-rise .26s ease-in forwards;
        }

        [data-snp-logo-img] {
          flex-shrink:0; width:34px; height:34px;
          object-fit:contain; border-radius:7px; display:block;
          animation:snp-logo-bounce .55s ease .55s 1;
        }
        [data-snp-logo-fb] {
          flex-shrink:0; width:34px; height:34px;
          background:#111; border-radius:7px;
          display:flex; align-items:center; justify-content:center;
          font-size:7.5px; font-weight:900; color:#fff;
          font-family:system-ui,sans-serif; text-align:center; line-height:1.2;
          animation:snp-logo-bounce .55s ease .55s 1;
        }

        [data-snp-texts] { flex:1; min-width:0; }

        [data-snp-title] {
          margin:0 0 2px;
          font-family:system-ui,-apple-system,"Segoe UI",sans-serif;
          font-size:12px; font-weight:700; color:#111;
          line-height:1.3; white-space:nowrap;
          overflow:hidden; text-overflow:ellipsis;
        }
        [data-snp-desc] {
          margin:0;
          font-family:system-ui,-apple-system,"Segoe UI",sans-serif;
          font-size:10.5px; color:#6b7280; line-height:1.4;
          display:-webkit-box; -webkit-line-clamp:2;
          -webkit-box-orient:vertical; overflow:hidden;
        }

        [data-snp-btns] {
          flex-shrink:0; display:flex; align-items:center; gap:4px;
        }
        [data-snp-later] {
          background:transparent; border:none;
          padding:5px 8px; border-radius:7px;
          font-family:system-ui,-apple-system,"Segoe UI",sans-serif;
          font-size:11.5px; font-weight:500; color:#9ca3af;
          cursor:pointer; transition:color .12s,background .12s; white-space:nowrap;
        }
        [data-snp-later]:hover { color:#374151; background:#f3f4f6; }

        [data-snp-allow] {
          background:#38bdf8; border:none;
          padding:6px 12px; border-radius:8px;
          font-family:system-ui,-apple-system,"Segoe UI",sans-serif;
          font-size:11.5px; font-weight:700; color:#fff;
          cursor:pointer; white-space:nowrap;
          transition:background .12s,transform .1s,box-shadow .12s;
          box-shadow:0 2px 8px rgba(56,189,248,.4);
        }
        [data-snp-allow]:hover {
          background:#0ea5e9; transform:translateY(-1px);
          box-shadow:0 4px 14px rgba(56,189,248,.45);
        }
        [data-snp-allow]:active { transform:translateY(0); }
      `}</style>

      <div data-snp-wrap>
        <div data-snp-card {...(animOut ? { "data-out": "" } : {})}>

          {logoSrc ? (
            <img data-snp-logo-img src={logoSrc} alt={logoAlt} />
          ) : (
            <div data-snp-logo-fb aria-hidden="true">
              {storeName.replace(/\..+$/, "").toUpperCase().slice(0, 6)}
            </div>
          )}

          <div data-snp-texts>
            <p data-snp-title>{headlineText}</p>
            <p data-snp-desc>{bodyText}</p>
          </div>

          <div data-snp-btns>
            <button data-snp-later onClick={handleLater}>{laterLabel}</button>
            <button data-snp-allow onClick={handleAllow}>{allowLabel}</button>
          </div>

        </div>
      </div>
    </>
  );
}
