const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'local_service_finder_jwt_secret_key_2026_super_secure');
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (user.isSuspended) {
        return res.status(403).json({ message: 'Account is suspended. Please contact support.' });
      }

      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({ 
          message: `Access denied. Requires one of the following roles: ${roles.join(', ')}` 
        });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  };
};

module.exports = { protect };
