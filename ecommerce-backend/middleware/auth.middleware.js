import jwt from 'jsonwebtoken';

// This middleware reads the same JWT that your MongoDB Backend (port 5001) issues.
// It works as a cookie ("accessToken") OR as a Bearer token in Authorization header.
export const authMiddleware = (req, res, next) => {
  try {
    // 1. Try cookie first (set by MongoDB auth backend)
    let token = req.cookies?.accessToken;

    // 2. Fall back to Authorization: Bearer <token>
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'Please login first' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded has { id, role } — same shape your MongoDB auth backend signs
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
