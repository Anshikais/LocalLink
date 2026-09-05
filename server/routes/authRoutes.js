const express = require('express');
const router = express.Router();
const { registerCustomer, registerProvider, login, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerCustomer);
router.post('/register-provider', registerProvider);
router.post('/login', login);
router.get('/profile', protect(), getProfile);
router.patch('/profile', protect(), updateProfile);

module.exports = router;
