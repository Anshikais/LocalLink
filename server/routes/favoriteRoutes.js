const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.get('/', protect('customer'), getFavorites);
router.post('/:providerId', protect('customer'), addFavorite);
router.delete('/:providerId', protect('customer'), removeFavorite);

module.exports = router;
