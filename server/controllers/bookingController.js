const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const Notification = require('../models/Notification');
const Settings = require('../models/Settings');

// Helper to generate unique booking ID
const generateBookingId = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `#LSF${randomNum}`;
};

// @desc Create Booking Request
// @route POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const {
      providerId,
      serviceName,
      description,
      images,
      bookingDate,
      bookingTime,
      address,
      price
    } = req.body;

    const provider = await Provider.findById(providerId).populate('user');
    if (!provider) {
      return res.status(404).json({ message: 'Service Provider not found' });
    }

    if (!provider.isAvailable) {
      return res.status(400).json({ message: 'Provider is currently unavailable' });
    }

    // Get current platform settings for commission
    const settings = await Settings.findOne() || { commissionPercentage: 10 };
    const commPct = settings.commissionPercentage || 10;

    const bookingPrice = Number(price) || provider.startingPrice;
    const platformFee = Math.round((bookingPrice * commPct) / 100);
    const providerEarnings = bookingPrice - platformFee;

    const bookingId = generateBookingId();

    const booking = await Booking.create({
      bookingId,
      customer: req.user._id,
      provider: provider._id,
      serviceName: serviceName || 'General Service',
      description,
      images: images || [],
      bookingDate,
      bookingTime,
      address: {
        street: address.street,
        city: address.city || provider.location.city,
        state: address.state || provider.location.state,
        pincode: address.pincode || '201301',
        phone: address.phone || req.user.phone
      },
      price: bookingPrice,
      commissionPercentage: commPct,
      platformFee,
      providerEarnings,
      status: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date(),
          note: 'Booking requested by customer'
        }
      ]
    });

    // Notify Provider
    await Notification.create({
      recipient: provider.user._id,
      title: 'New Booking Request',
      message: `You have received a new booking request (${bookingId}) for ${serviceName} from ${req.user.name}.`,
      type: 'new_request',
      booking: booking._id
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('customer', 'name email phone profileImage')
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name phone profileImage' }
      });

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get User / Provider / Admin Bookings
// @route GET /api/bookings
exports.getBookings = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (req.user.role === 'customer') {
      query.customer = req.user._id;
    } else if (req.user.role === 'provider') {
      const provider = await Provider.findOne({ user: req.user._id });
      if (!provider) {
        return res.json([]);
      }
      query.provider = provider._id;
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone profileImage')
      .populate({
        path: 'provider',
        populate: [
          { path: 'user', select: 'name phone profileImage' },
          { path: 'category', select: 'name icon' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Booking Details
// @route GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone profileImage')
      .populate({
        path: 'provider',
        populate: [
          { path: 'user', select: 'name phone profileImage' },
          { path: 'category', select: 'name icon' }
        ]
      });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update Booking Status
// @route PATCH /api/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const allowedStatuses = ['Pending', 'Accepted', 'Rejected', 'On the Way', 'In Progress', 'Completed', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email')
      .populate({ path: 'provider', populate: { path: 'user', select: 'name' } });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    booking.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`
    });

    if (status === 'Completed') {
      booking.paymentStatus = 'Paid';
      // Increment provider completed jobs
      await Provider.findByIdAndUpdate(booking.provider._id, {
        $inc: { totalJobsCompleted: 1 }
      });
    }

    await booking.save();

    // Send notifications to both Customer and Provider
    const notificationTarget = req.user.role === 'provider' ? booking.customer._id : booking.provider.user._id;
    await Notification.create({
      recipient: notificationTarget,
      title: `Booking ${status}`,
      message: `Booking ${booking.bookingId} status has been updated to "${status}".`,
      type: 'booking_update',
      booking: booking._id
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
