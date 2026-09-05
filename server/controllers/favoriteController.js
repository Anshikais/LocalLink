const User = require('../models/User');
const Provider = require('../models/Provider');

// @desc Add Provider to Favorites
// @route POST /api/favorites/:providerId
exports.addFavorite = async (req, res) => {
  try {
    const { providerId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user.favorites.includes(providerId)) {
      user.favorites.push(providerId);
      await user.save();
    }

    res.json({ message: 'Provider added to favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Remove Provider from Favorites
// @route DELETE /api/favorites/:providerId
exports.removeFavorite = async (req, res) => {
  try {
    const { providerId } = req.params;
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(id => id.toString() !== providerId);
    await user.save();

    res.json({ message: 'Provider removed from favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Favorite Providers
// @route GET /api/favorites
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      populate: [
        { path: 'user', select: 'name email phone profileImage' },
        { path: 'category', select: 'name icon image slug' }
      ]
    });

    res.json(user.favorites || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
