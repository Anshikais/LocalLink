const Provider = require('../models/Provider');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { getHaversineDistance } = require('../utils/haversine');

// @desc Get Providers with location, filtering & sorting
// @route GET /api/providers
exports.getProviders = async (req, res) => {
  try {
    const {
      search,
      category,
      lat,
      lng,
      radius = 20, // default 20 km
      minRating = 0,
      maxPrice,
      availableOnly,
      verifiedOnly,
      sortBy = 'recommended'
    } = req.query;

    let query = {};

    // Filter verified if requested (for non-admin, default show approved)
    if (verifiedOnly === 'true') {
      query.verificationStatus = 'approved';
    } else {
      // By default show approved providers unless admin or search
      query.verificationStatus = 'approved';
    }

    if (category) {
      // Allow category ID or category slug
      const catObj = await Category.findById(category).catch(() => null) || await Category.findOne({ slug: category });
      if (catObj) {
        query.category = catObj._id;
      }
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { businessName: searchRegex },
        { description: searchRegex }
      ];
    }

    if (minRating > 0) {
      query.rating = { $gte: Number(minRating) };
    }

    if (maxPrice) {
      query.startingPrice = { $lte: Number(maxPrice) };
    }

    if (availableOnly === 'true') {
      query.isAvailable = true;
    }

    let providers = await Provider.find(query)
      .populate('user', 'name email phone profileImage')
      .populate('category', 'name icon image slug');

    const userLat = lat ? parseFloat(lat) : null;
    const userLng = lng ? parseFloat(lng) : null;

    // Attach computed distance & filter by radius if lat/lng are provided
    let results = providers.map(p => {
      const pObj = p.toObject();
      if (userLat !== null && userLng !== null && p.location && p.location.coordinates) {
        const [pLng, pLat] = p.location.coordinates;
        pObj.distanceKm = getHaversineDistance(userLat, userLng, pLat, pLng);
      } else {
        pObj.distanceKm = 2.5; // fallback representation distance if user location disabled
      }
      return pObj;
    });

    // Filter by radius if lat & lng are specified
    if (userLat !== null && userLng !== null && radius) {
      const maxRadius = parseFloat(radius);
      results = results.filter(p => p.distanceKm <= maxRadius);
    }

    // Apply Sorting
    if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'distance') {
      results.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortBy === 'price') {
      results.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === 'reviews') {
      results.sort((a, b) => b.reviewCount - a.reviewCount);
    } else {
      // Recommended: combo of verification, featured, rating & distance
      results.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.rating - a.rating;
      });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get nearby providers using geospatial API
// @route GET /api/providers/nearby
exports.getNearbyProviders = async (req, res) => {
  try {
    const { lat, lng, radius = 10, category } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and Longitude are required for nearby search' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInKm = parseFloat(radius);

    let query = {
      verificationStatus: 'approved',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radiusInKm * 1000 // Convert km to meters
        }
      }
    };

    if (category) {
      const catObj = await Category.findById(category).catch(() => null) || await Category.findOne({ slug: category });
      if (catObj) query.category = catObj._id;
    }

    const providers = await Provider.find(query)
      .populate('user', 'name email phone profileImage')
      .populate('category', 'name icon image slug');

    const formatted = providers.map(p => {
      const pObj = p.toObject();
      const [pLng, pLat] = p.location.coordinates;
      pObj.distanceKm = getHaversineDistance(latitude, longitude, pLat, pLng);
      return pObj;
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Single Provider Profile
// @route GET /api/providers/:id
exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate('user', 'name email phone profileImage')
      .populate('category', 'name icon image slug');

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const reviews = await Review.find({ provider: provider._id })
      .populate('customer', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({
      provider,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update Provider Profile (Provider Only)
// @route PATCH /api/providers/profile
exports.updateProviderProfile = async (req, res) => {
  try {
    let provider = await Provider.findOne({ user: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const {
      businessName,
      description,
      experienceYears,
      startingPrice,
      coverImage,
      serviceAreaRadiusKm,
      workingHours,
      isAvailable,
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
    if (experienceYears !== undefined) provider.experienceYears = Number(experienceYears);
    if (startingPrice !== undefined) provider.startingPrice = Number(startingPrice);
    if (coverImage) provider.coverImage = coverImage;
    if (serviceAreaRadiusKm !== undefined) provider.serviceAreaRadiusKm = Number(serviceAreaRadiusKm);
    if (workingHours) provider.workingHours = workingHours;
    if (isAvailable !== undefined) provider.isAvailable = isAvailable;
    if (servicesOffered) provider.servicesOffered = servicesOffered;
    if (gallery) provider.gallery = gallery;

    if (latitude && longitude) {
      provider.location.coordinates = [Number(longitude), Number(latitude)];
    }
    if (formattedAddress) provider.location.formattedAddress = formattedAddress;
    if (city) provider.location.city = city;
    if (state) provider.location.state = state;

    await provider.save();

    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Provider Dashboard Metrics
// @route GET /api/providers/dashboard/stats
exports.getProviderDashboardStats = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const totalBookings = await Booking.countDocuments({ provider: provider._id });
    const pendingBookings = await Booking.countDocuments({ provider: provider._id, status: 'Pending' });
    const completedBookings = await Booking.countDocuments({ provider: provider._id, status: 'Completed' });

    // Calculate total earnings
    const completedList = await Booking.find({ provider: provider._id, status: 'Completed' });
    const totalEarnings = completedList.reduce((sum, b) => sum + (b.providerEarnings || (b.price * 0.9)), 0);

    const recentBookings = await Booking.find({ provider: provider._id })
      .populate('customer', 'name phone profileImage')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      provider,
      stats: {
        totalBookings,
        pendingBookings,
        completedJobs: completedBookings,
        totalEarnings: Math.round(totalEarnings),
        averageRating: provider.rating,
        reviewCount: provider.reviewCount
      },
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
