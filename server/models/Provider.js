const mongoose = require('mongoose');

const OfferedServiceSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String }
});

const ProviderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  servicesOffered: [OfferedServiceSchema],
  experienceYears: { type: Number, required: true, default: 1 },
  startingPrice: { type: Number, required: true },
  coverImage: { 
    type: String, 
    default: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200' 
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    formattedAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: 'Delhi NCR' }
  },
  serviceAreaRadiusKm: { type: Number, default: 15 },
  workingHours: {
    type: String,
    default: 'Mon-Sat: 9:00 AM - 7:00 PM'
  },
  isAvailable: { type: Boolean, default: true },
  gallery: [{ type: String }],
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  verificationDocumentUrl: { type: String },
  isFeatured: { type: Boolean, default: false },
  subscriptionTier: { type: String, enum: ['free', 'premium'], default: 'free' },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  totalJobsCompleted: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// GeoJSON 2dsphere index for location search
ProviderSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Provider', ProviderSchema);
