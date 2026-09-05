const User = require('../models/User');
const Provider = require('../models/Provider');
const Category = require('../models/Category');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Settings = require('../models/Settings');
const Notification = require('../models/Notification');

// @desc Get Platform Statistics
// @route GET /api/admin/statistics
exports.getAdminStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const customerUsers = await User.countDocuments({ role: 'customer' });
    const providerUsers = await User.countDocuments({ role: 'provider' });

    const totalProviders = await Provider.countDocuments();
    const pendingProviders = await Provider.countDocuments({ verificationStatus: 'pending' });
    const approvedProviders = await Provider.countDocuments({ verificationStatus: 'approved' });
    const rejectedProviders = await Provider.countDocuments({ verificationStatus: 'rejected' });

    const totalCategories = await Category.countDocuments();
    const totalServices = await Service.countDocuments();

    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'Completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'Cancelled' });
    const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
    const acceptedBookings = await Booking.countDocuments({ status: 'Accepted' });

    // Average Platform Rating
    const allProviders = await Provider.find();
    const avgRating = allProviders.length > 0 
      ? Math.round((allProviders.reduce((sum, p) => sum + (p.rating || 5), 0) / allProviders.length) * 10) / 10 
      : 5.0;

    // Financial calculations
    const completedList = await Booking.find({ status: 'Completed' });
    const platformRevenue = completedList.reduce((sum, b) => sum + (b.platformFee || 0), 0);
    const grossTransactionValue = completedList.reduce((sum, b) => sum + (b.price || 0), 0);

    const reportedReviewsCount = await Review.countDocuments({ isReported: true });
    const settings = await Settings.findOne() || { commissionPercentage: 10 };

    res.json({
      stats: {
        totalUsers,
        customerUsers,
        providerUsers,
        totalProviders,
        pendingProviders,
        approvedProviders,
        rejectedProviders,
        totalCategories,
        totalServices,
        totalBookings,
        completedBookings,
        cancelledBookings,
        pendingBookings,
        acceptedBookings,
        averageRating: avgRating,
        grossTransactionValue: Math.round(grossTransactionValue),
        platformRevenue: Math.round(platformRevenue),
        commissionPercentage: settings.commissionPercentage || 10,
        reportedReviewsCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Categories with Provider & Service Counts
// @route GET /api/admin/categories
exports.getAdminCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    // Attach provider and service count
    const enriched = await Promise.all(categories.map(async (cat) => {
      const providerCount = await Provider.countDocuments({ category: cat._id });
      const serviceCount = await Service.countDocuments({ category: cat._id });
      return {
        ...cat.toObject(),
        providerCount,
        serviceCount
      };
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get All Users with Filter & Pagination
// @route GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 50 } = req.query;
    let query = {};

    if (role) query.role = role;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle User Suspension
// @route PATCH /api/admin/users/:id/suspend
exports.toggleUserSuspension = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.json({ message: `User ${user.isSuspended ? 'suspended' : 'unsuspended'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update User Role
// @route PATCH /api/admin/users/:id/role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['customer', 'provider', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();
    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete User
// @route DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete associated provider profile if exists
    if (user.role === 'provider') {
      await Provider.findOneAndDelete({ user: user._id });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get All Providers with Search & Filters
// @route GET /api/admin/providers
exports.getAdminProviders = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 50 } = req.query;
    let query = {};

    if (status) query.verificationStatus = status;
    if (category) query.category = category;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ businessName: regex }, { description: regex }];
    }

    const total = await Provider.countDocuments(query);
    const providers = await Provider.find(query)
      .populate('user', 'name email phone profileImage isSuspended')
      .populate('category', 'name icon image slug')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      providers,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin: Create Provider Record
// @route POST /api/admin/providers
exports.createAdminProvider = async (req, res) => {
  try {
    const {
      name,
      email,
      password = 'provider123',
      phone,
      businessName,
      description,
      category,
      experienceYears = 1,
      startingPrice = 299,
      coverImage,
      servicesOffered = [],
      formattedAddress = 'Sector 62, Noida',
      city = 'Noida',
      state = 'Delhi NCR',
      latitude = 28.6273,
      longitude = 77.3725,
      serviceAreaRadiusKm = 15,
      isAvailable = true,
      verificationStatus = 'approved',
      isFeatured = false
    } = req.body;

    if (!businessName || !category || !phone || !email) {
      return res.status(400).json({ message: 'Business name, category, email, and phone are required' });
    }

    // Find or create User
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name: name || businessName,
        email: email.toLowerCase(),
        password,
        phone,
        role: 'provider'
      });
    } else {
      user.role = 'provider';
      await user.save();
    }

    const categoryObj = await Category.findById(category);
    if (!categoryObj) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const provider = await Provider.create({
      user: user._id,
      businessName,
      description: description || `${businessName} provides high quality ${categoryObj.name} services.`,
      category: categoryObj._id,
      experienceYears: Number(experienceYears),
      startingPrice: Number(startingPrice),
      coverImage: coverImage || categoryObj.image,
      servicesOffered,
      location: {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)],
        formattedAddress,
        city,
        state
      },
      serviceAreaRadiusKm: Number(serviceAreaRadiusKm),
      isAvailable,
      verificationStatus,
      isFeatured,
      rating: 5.0,
      reviewCount: 0
    });

    const populated = await Provider.findById(provider._id)
      .populate('user', 'name email phone profileImage')
      .populate('category', 'name icon');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin: Update Provider Record
// @route PATCH /api/admin/providers/:id
exports.updateAdminProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).populate('user');
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const {
      name,
      phone,
      email,
      businessName,
      description,
      category,
      experienceYears,
      startingPrice,
      coverImage,
      serviceAreaRadiusKm,
      workingHours,
      isAvailable,
      verificationStatus,
      isFeatured,
      rating,
      servicesOffered,
      gallery,
      formattedAddress,
      city,
      state,
      latitude,
      longitude
    } = req.body;

    if (businessName) provider.businessName = businessName;
    if (description) provider.description = description;
    if (category) provider.category = category;
    if (experienceYears !== undefined) provider.experienceYears = Number(experienceYears);
    if (startingPrice !== undefined) provider.startingPrice = Number(startingPrice);
    if (coverImage) provider.coverImage = coverImage;
    if (serviceAreaRadiusKm !== undefined) provider.serviceAreaRadiusKm = Number(serviceAreaRadiusKm);
    if (workingHours) provider.workingHours = workingHours;
    if (isAvailable !== undefined) provider.isAvailable = isAvailable;
    if (verificationStatus) provider.verificationStatus = verificationStatus;
    if (isFeatured !== undefined) provider.isFeatured = isFeatured;
    if (rating !== undefined) provider.rating = Number(rating);
    if (servicesOffered) provider.servicesOffered = servicesOffered;
    if (gallery) provider.gallery = gallery;

    // Location coordinates update
    if (latitude !== undefined && longitude !== undefined) {
      provider.location.coordinates = [Number(longitude), Number(latitude)];
    }
    if (formattedAddress) provider.location.formattedAddress = formattedAddress;
    if (city) provider.location.city = city;
    if (state) provider.location.state = state;

    await provider.save();

    // Update associated User profile info
    if (provider.user) {
      const userObj = await User.findById(provider.user._id);
      if (userObj) {
        if (name) userObj.name = name;
        if (phone) userObj.phone = phone;
        if (email) userObj.email = email;
        await userObj.save();
      }
    }

    const updated = await Provider.findById(provider._id)
      .populate('user', 'name email phone profileImage')
      .populate('category', 'name icon');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin: Delete Provider Record
// @route DELETE /api/admin/providers/:id
exports.deleteAdminProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    await Provider.findByIdAndDelete(req.params.id);
    res.json({ message: 'Provider deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Approve Provider
// @route PATCH /api/admin/providers/:id/approve
exports.approveProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).populate('user');
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    provider.verificationStatus = 'approved';
    await provider.save();

    if (provider.user) {
      await Notification.create({
        recipient: provider.user._id,
        title: 'Provider Account Approved! 🎉',
        message: 'Congratulations! Your provider business profile has been verified and approved.',
        type: 'verification'
      });
    }

    res.json({ message: 'Provider approved successfully', provider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Reject Provider
// @route PATCH /api/admin/providers/:id/reject
exports.rejectProvider = async (req, res) => {
  try {
    const { reason } = req.body;
    const provider = await Provider.findById(req.params.id).populate('user');
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    provider.verificationStatus = 'rejected';
    await provider.save();

    if (provider.user) {
      await Notification.create({
        recipient: provider.user._id,
        title: 'Verification Update',
        message: `Your provider registration was not approved. ${reason ? `Reason: ${reason}` : 'Please verify details.'}`,
        type: 'verification'
      });
    }

    res.json({ message: 'Provider verification rejected', provider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle Featured Status
// @route PATCH /api/admin/providers/:id/featured
exports.toggleFeatured = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    provider.isFeatured = !provider.isFeatured;
    await provider.save();

    res.json({ message: `Provider ${provider.isFeatured ? 'featured' : 'unfeatured'}`, provider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get All Bookings for Admin
// @route GET /api/admin/bookings
exports.getAdminBookings = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    let query = {};
    if (status) query.status = status;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone profileImage')
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email phone' }
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      bookings,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update Booking Status
// @route PATCH /api/admin/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Accepted', 'On the Way', 'In Progress', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    booking.timeline.push({ status, note: 'Updated by Admin' });
    await booking.save();

    res.json({ message: 'Booking status updated by Admin', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get All Reviews for Admin
// @route GET /api/admin/reviews
exports.getAdminReviews = async (req, res) => {
  try {
    const { reportedOnly, search } = req.query;
    let query = {};
    if (reportedOnly === 'true') query.isReported = true;

    const reviews = await Review.find(query)
      .populate('customer', 'name email profileImage')
      .populate({
        path: 'provider',
        select: 'businessName category'
      })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle Hide/Show Review
// @route PATCH /api/admin/reviews/:id/toggle-hide
exports.toggleHideReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.isReported = !review.isReported;
    await review.save();

    res.json({ message: `Review ${review.isReported ? 'hidden' : 'restored'}`, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete Review
// @route DELETE /api/admin/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const providerId = review.provider;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate Provider average rating
    const provider = await Provider.findById(providerId);
    if (provider) {
      const remainingReviews = await Review.find({ provider: providerId });
      if (remainingReviews.length > 0) {
        const total = remainingReviews.reduce((s, r) => s + r.rating, 0);
        provider.rating = Math.round((total / remainingReviews.length) * 10) / 10;
        provider.reviewCount = remainingReviews.length;
      } else {
        provider.rating = 5.0;
        provider.reviewCount = 0;
      }
      await provider.save();
    }

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc AI Assistant Description Generator
// @route POST /api/admin/generate-description
exports.generateAIDescription = async (req, res) => {
  try {
    const { title, type = 'category' } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required for AI generation' });
    }

    let description = '';
    if (type === 'category') {
      description = `Professional, reliable, and background-verified ${title} services delivered directly to your doorstep.`;
    } else if (type === 'service') {
      description = `Expert ${title} inspection, diagnostics, repair, and maintenance performed by certified professionals with transparent pricing.`;
    } else {
      description = `Certified ${title} expert offering top-rated local services with prompt arrival and guaranteed satisfaction.`;
    }

    res.json({ title, type, generatedDescription: description });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update Platform Settings
// @route PATCH /api/admin/settings
exports.updateSettings = async (req, res) => {
  try {
    const { commissionPercentage, platformName, contactEmail } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    if (commissionPercentage !== undefined) settings.commissionPercentage = Number(commissionPercentage);
    if (platformName) settings.platformName = platformName;
    if (contactEmail) settings.contactEmail = contactEmail;
    settings.updatedAt = new Date();

    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
