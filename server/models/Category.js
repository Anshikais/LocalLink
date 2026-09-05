const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Wrench' }, // Lucide icon identifier
  image: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Home Services', 'Personal Services', 'Automotive', 'Professional', 'Technology'], default: 'Home Services' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', CategorySchema);
