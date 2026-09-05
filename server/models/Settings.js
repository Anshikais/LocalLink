const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  commissionPercentage: { type: Number, default: 10 },
  platformName: { type: String, default: 'Local Service Finder' },
  contactEmail: { type: String, default: 'support@localservicefinder.com' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', SettingsSchema);
