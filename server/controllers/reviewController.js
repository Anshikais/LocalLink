const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const Notification = require('../models/Notification');

// @desc Add Review for Completed Booking
// @route POST /api/reviews
exports.addReview = async (req, res) => {
  try {
    const { bookingId, rating, comment, images } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only review your own bookings' });
    }

    if (booking.status !== 'Completed') {
      return res.status(400).json({ message: 'You can only leave a review after the service is Completed' });
    }

    const existingReview = await Review.findOne({ booking: booking._id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already submitted a review for this booking' });
    }

    const review = await Review.create({
      customer: req.user._id,
      provider: booking.provider,
      booking: booking._id,
      rating: Number(rating),
      comment,
      images: images || []
    });

    booking.hasReview = true;
    await booking.save();

    // Recalculate Provider Rating & Review Count
    const provider = await Provider.findById(booking.provider);
    if (provider) {
      const allReviews = await Review.find({ provider: provider._id });
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = Math.round((totalRating / allReviews.length) * 10) / 10;

      provider.rating = avgRating;
      provider.reviewCount = allReviews.length;
      await provider.save();

      // Notify Provider
      await Notification.create({
        recipient: provider.user,
        title: 'New Review Received',
        message: `${req.user.name} left a ${rating}-star review for service on ${booking.bookingId}`,
        type: 'review_received',
        booking: booking._id
      });
    }

    const populatedReview = await Review.findById(review._id).populate('customer', 'name profileImage');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Reviews for Provider
// @route GET /api/providers/:id/reviews
exports.getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ provider: req.params.id })
      .populate('customer', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Report a review
// @route POST /api/reviews/:id/report
exports.reportReview = async (req, res) => {
  try {
    const { reason } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.isReported = true;
    review.reportReason = reason || 'Inappropriate content reported by user';
    await review.save();

    res.json({ message: 'Review reported for admin review' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
