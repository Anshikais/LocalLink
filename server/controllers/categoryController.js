const Category = require('../models/Category');
const Service = require('../models/Service');

// @desc Get all categories
// @route GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get category by ID or slug with services
// @route GET /api/categories/:id
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).catch(() => null) || await Category.findOne({ slug: id });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const services = await Service.find({ category: category._id });
    res.json({ category, services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin: Create Category
// @route POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon, image, type } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const category = await Category.create({
      name,
      description,
      icon: icon || 'Wrench',
      image: image || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600',
      slug,
      type: type || 'Home Services'
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin: Update Category
// @route PATCH /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, icon, image, type } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    if (description) category.description = description;
    if (icon) category.icon = icon;
    if (image) category.image = image;
    if (type) category.type = type;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin: Delete Category
// @route DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
