const express = require('express');
const router = express.Router();
const {
  getProviders,
  getNearbyProviders,
  getProviderById,
  updateProviderProfile,
  getProviderDashboardStats
} = require('../controllers/providerController');
const { protect } = require('../middleware/auth');

router.get('/', getProviders);
router.get('/nearby', getNearbyProviders);
router.get('/dashboard/stats', protect('provider'), getProviderDashboardStats);
router.patch('/profile', protect('provider'), updateProviderProfile);
router.get('/:id', getProviderById);

module.exports = router;
