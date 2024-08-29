const { verifyToken } = require('../utils/jwt');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).send('Token required');

  try {
    const user = verifyToken(token);
    req.user = user;
    res.status(200).json({ user })
    next();
  } catch (err) {
    res.status(403).send('Invalid token');
  }
};

module.exports = authenticateToken;
