const mongoose = require('mongoose');

const StatusLogSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String }
});

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true }, // e.g. #LSF10293
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  serviceName: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  bookingDate: { type: String, required: true }, // e.g. "2026-08-15"
  bookingTime: { type: String, required: true }, // e.g. "04:00 PM"
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    pincode: { type: String },
    phone: { type: String, required: true }
  },
  price: { type: Number, required: true },
  commissionPercentage: { type: Number, default: 10 },
  platformFee: { type: Number, default: 0 },
  providerEarnings: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'On the Way', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  statusHistory: [StatusLogSchema],
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending'
  },
  paymentMethod: { type: String, default: 'Simulated Online Pay' },
  hasReview: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
