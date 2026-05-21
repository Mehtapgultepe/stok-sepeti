const { verifyToken } = require('../services/authService');

function authenticate(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Token gerekli' });
  const token = header.split(' ')[1];
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Geçersiz token' });
  }
}

module.exports = authenticate;
