const express = require('express');
const router = express.Router();
const {
  getAdminStatistics,
  getAdminCategories,
  getUsers,
  toggleUserSuspension,
  updateUserRole,
  deleteUser,
  getAdminProviders,
  createAdminProvider,
  updateAdminProvider,
  deleteAdminProvider,
  approveProvider,
  rejectProvider,
  toggleFeatured,
  getAdminBookings,
  updateBookingStatus,
  getAdminReviews,
  toggleHideReview,
  deleteReview,
  generateAIDescription,
  updateSettings
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

router.use(protect('admin'));

// Statistics & Analytics
router.get('/statistics', getAdminStatistics);

// Category Management
router.get('/categories', getAdminCategories);

// Provider Management
router.get('/providers', getAdminProviders);
router.post('/providers', createAdminProvider);
router.patch('/providers/:id', updateAdminProvider);
router.delete('/providers/:id', deleteAdminProvider);
router.patch('/providers/:id/approve', approveProvider);
router.patch('/providers/:id/reject', rejectProvider);
router.patch('/providers/:id/featured', toggleFeatured);

// User Management
router.get('/users', getUsers);
router.patch('/users/:id/suspend', toggleUserSuspension);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Booking Management
router.get('/bookings', getAdminBookings);
router.patch('/bookings/:id/status', updateBookingStatus);

// Review Management
router.get('/reviews', getAdminReviews);
router.get('/reviews/reported', getAdminReviews);
router.patch('/reviews/:id/toggle-hide', toggleHideReview);
router.delete('/reviews/:id', deleteReview);

// AI & Settings
router.post('/generate-description', generateAIDescription);
router.patch('/settings', updateSettings);

module.exports = router;
