// ─── CHAT TAB — drop-in replacement inside SellerDashboard.jsx ───────────────
// Also update the parent: <ChatTab userInfo={userInfo} socket={socket} role={role} />
// And in SellerDashboard add: const { userInfo, role } = useSelector(state => state.auth);

function ChatTab({ userInfo, socket }) {
  const { role } = useSelector(state => state.auth); // get role separately

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [adminId, setAdminId] = useState(null);
  const [adminOnline, setAdminOnline] = useState(false);
  const bottomRef = useRef(null);

  // Track seen message IDs to prevent duplicates
  const seenIds = useRef(new Set());

  function safeAppend(msg, mine) {
    const key = String(msg._id || msg._tempKey || '');
    if (key && seenIds.current.has(key)) return;
    if (key) seenIds.current.add(key);
    setMessages(prev => [...prev, { ...msg, mine }]);
  }

  // ── Fetch admin ID + history ───────────────────────────────────────────────
  useEffect(() => {
    const uid = userInfo?.id || userInfo?._id;
    if (!uid) return;

    api.get('/admin/info')
      .then(({ data }) => {
        const aid = data.adminId;
        setAdminId(aid);

        // Load history
        return api.get(`/messages/${uid}?adminId=${aid}`);
      })
      .then(({ data: h }) => {
        const msgs = h.messages || [];
        msgs.forEach(m => seenIds.current.add(String(m._id)));
        setMessages(msgs.map(m => ({ ...m, mine: m.senderId === uid })));
      })
      .catch(() => { });
  }, [userInfo?.id, userInfo?._id]);

  // ── Socket listeners ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const onAdminStatus = ({ online }) => {
      setAdminOnline(online);
    };

    const onReceive = (data) => {
      safeAppend(data, false);
    };

    const onSent = (data) => {
      // Replace optimistic message OR append if from another tab
      const realKey = String(data._id);
      if (seenIds.current.has(realKey)) return;
      seenIds.current.add(realKey);

      setMessages(prev => {
        // Find the first unsaved optimistic message (has _tempKey, no _id)
        const idx = prev.findIndex(m => m._tempKey && !m._id);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = { ...data, mine: true };
          return next;
        }
        return [...prev, { ...data, mine: true }];
      });
    };

    socket.on('admin_status', onAdminStatus);
    socket.on('receive_message', onReceive);
    socket.on('message_sent', onSent);

    return () => {
      socket.off('admin_status', onAdminStatus);
      socket.off('receive_message', onReceive);
      socket.off('message_sent', onSent);
    };
  }, [socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send ───────────────────────────────────────────────────────────────────
  const sendMessage = (e) => {
    e.preventDefault();
    const uid = userInfo?.id || userInfo?._id;
    if (!input.trim() || !socket || !adminId || !uid) return;

    const tempKey = `tmp_${Date.now()}`;
    const msg = {
      senderId: uid,
      receiverId: adminId,
      senderName: userInfo?.name || 'Seller',
      message: input.trim(),
      timestamp: Date.now(),
      _tempKey: tempKey,
    };

    seenIds.current.add(tempKey);
    setMessages(prev => [...prev, { ...msg, mine: true }]);
    socket.emit('send_message', msg);
    setInput('');
  };

  return (
    <div className="sd-section chat-section">
      <div className="sd-section-header">
        <div>
          <h1 className="sd-section-title">Chat with Admin</h1>
          <p className="sd-section-sub">Get support for your products and account</p>
        </div>
        <div className="sd-online-indicator">
          <span className={`sd-status-dot ${adminOnline ? 'green' : 'red'}`} />
          {adminOnline ? '● Admin Online' : '○ Admin Offline'}
        </div>
      </div>

      <div className="sd-chat-box">
        <div className="sd-chat-messages">
          {messages.length === 0 && (
            <div className="sd-chat-empty">
              <i className="ti ti-message-dots" />
              <p>No messages yet. Say hello to the admin!</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={msg._id ? String(msg._id) : (msg._tempKey || i)}
              className={`sd-msg ${msg.mine ? 'mine' : 'theirs'}`}
            >
              <div className="sd-msg-bubble">{msg.message}</div>
              <div className="sd-msg-meta">
                {msg.mine ? 'You' : 'Admin'} ·{' '}
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form className="sd-chat-input" onSubmit={sendMessage}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              !socket ? 'Connecting...' :
                !adminId ? 'Loading...' :
                  adminOnline ? 'Type a message...' :
                    'Admin offline — message will be saved'
            }
            autoComplete="off"
          />
          <button type="submit" disabled={!input.trim() || !socket}>
            <i className="ti ti-send" />
          </button>
        </form>
      </div>
    </div>
  );
}
