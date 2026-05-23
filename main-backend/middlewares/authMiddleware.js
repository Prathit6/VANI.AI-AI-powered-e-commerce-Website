const jwt = require('jsonwebtoken');

module.exports.authMiddleware = async (req, res, next) => {
  const { accessToken } = req.cookies
  const authHeader = req.headers.authorization;

  let token = accessToken;
  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(409).json({ error: 'Please Login First' })
  } else {
    try {
      const deCodeToken = await jwt.verify(token, process.env.JWT_SECRET)
      req.role = deCodeToken.role
      req.id = deCodeToken.id
      next()
    } catch (error) {
      return res.status(409).json({ error: 'Please Login' })
    }
  }

}
