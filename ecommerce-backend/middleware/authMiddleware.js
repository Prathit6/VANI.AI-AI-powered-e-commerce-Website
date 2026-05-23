import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    // 1. Try cookie first
    let token = req.cookies?.accessToken;

    // 2. Fallback to Authorization header (Bearer token from localStorage)
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'Please login first' });
    }

    // ✅ FIXED: fallback covers both JWT_SECRET and SECRET env var names
    const secret = process.env.JWT_SECRET || process.env.SECRET;

    if (!secret) {
      console.error('❌ No JWT secret found in environment variables!');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch (err) {
    console.error('Auth error:', err.message); // ✅ log the real reason
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
