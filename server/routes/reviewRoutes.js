const express = require('express');
const router = express.Router();
const { addReview, getProviderReviews, reportReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect('customer'), addReview);
router.get('/provider/:id', getProviderReviews);
router.post('/:id/report', protect(), reportReview);

module.exports = router;
