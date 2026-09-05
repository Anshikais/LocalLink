const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Provider = require('../models/Provider');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'local_service_finder_jwt_secret_key_2026_super_secure', {
    expiresIn: '30d'
  });
};

// @desc Register Customer
// @route POST /api/auth/register
exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'customer'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        addresses: user.addresses,
        favorites: user.favorites
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Register Provider
// @route POST /api/auth/register-provider
exports.registerProvider = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      businessName,
      description,
      category,
      experienceYears,
      startingPrice,
      formattedAddress,
      city,
      state,
      latitude,
      longitude,
      serviceAreaRadiusKm,
      workingHours,
      verificationDocumentUrl
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user with provider role
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'provider'
    });

    // Create provider business profile
    const provider = await Provider.create({
      user: user._id,
      businessName,
      description,
      category,
      experienceYears: Number(experienceYears) || 1,
      startingPrice: Number(startingPrice) || 299,
      location: {
        type: 'Point',
        coordinates: [Number(longitude) || 77.3910, Number(latitude) || 28.5355],
        formattedAddress: formattedAddress || `${city}, ${state}`,
        city: city || 'Noida',
        state: state || 'Uttar Pradesh'
      },
      serviceAreaRadiusKm: Number(serviceAreaRadiusKm) || 15,
      workingHours: workingHours || 'Mon-Sat: 9:00 AM - 7:00 PM',
      verificationDocumentUrl: verificationDocumentUrl || '',
      verificationStatus: 'pending' // Initially pending until admin approves
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        providerId: provider._id
      },
      provider
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login User
// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.isSuspended) {
      return res.status(403).json({ message: 'Your account has been suspended by administration.' });
    }

    let provider = null;
    if (user.role === 'provider') {
      provider = await Provider.findOne({ user: user._id });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        addresses: user.addresses,
        favorites: user.favorites,
        providerId: provider ? provider._id : null
      },
      provider
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get current user profile
// @route GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let provider = null;
    if (user.role === 'provider') {
      provider = await Provider.findOne({ user: user._id }).populate('category');
    }

    res.json({
      user,
      provider
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update Profile / Addresses
// @route PATCH /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, profileImage, addresses } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profileImage) user.profileImage = profileImage;
    if (addresses) user.addresses = addresses;

    await user.save();

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        addresses: user.addresses,
        favorites: user.favorites
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
