const Service = require('../models/Service');
const Category = require('../models/Category');

// @desc Get all services (with optional category & status filter)
// @route GET /api/services
exports.getServices = async (req, res) => {
  try {
    const { category, search, all } = req.query;
    let query = {};

    if (all !== 'true') {
      query.isActive = true;
    }

    if (category) {
      const catObj = await Category.findById(category).catch(() => null) || await Category.findOne({ slug: category });
      if (catObj) {
        query.category = catObj._id;
      }
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    const services = await Service.find(query)
      .populate('category', 'name slug icon image')
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get service by ID
// @route GET /api/services/:id
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('category', 'name slug icon image');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin: Create Service
// @route POST /api/services
exports.createService = async (req, res) => {
  try {
    const { name, description, category, startingPrice, icon, image, estimatedDuration } = req.body;

    if (!name || !description || !category || startingPrice === undefined) {
      return res.status(400).json({ message: 'Name, description, category, and starting price are required' });
    }

    const categoryObj = await Category.findById(category);
    if (!categoryObj) {
      return res.status(404).json({ message: 'Selected category does not exist' });
    }

    const service = await Service.create({
      name,
      description,
      category: categoryObj._id,
      startingPrice: Number(startingPrice),
      icon: icon || 'Wrench',
      image: image || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=400',
      estimatedDuration: estimatedDuration || '1-2 hours'
    });

    const populated = await Service.findById(service._id).populate('category', 'name slug icon');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin: Update Service
// @route PATCH /api/services/:id
exports.updateService = async (req, res) => {
  try {
    const { name, description, category, startingPrice, icon, image, estimatedDuration, isActive } = req.body;
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (name) service.name = name;
    if (description) service.description = description;
    if (category) service.category = category;
    if (startingPrice !== undefined) service.startingPrice = Number(startingPrice);
    if (icon) service.icon = icon;
    if (image) service.image = image;
    if (estimatedDuration) service.estimatedDuration = estimatedDuration;
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();
    const populated = await Service.findById(service._id).populate('category', 'name slug icon');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin: Toggle Service Status
// @route PATCH /api/services/:id/status
exports.toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.isActive = !service.isActive;
    await service.save();

    res.json({ message: `Service ${service.isActive ? 'activated' : 'deactivated'}`, service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin: Delete Service
// @route DELETE /api/services/:id
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
