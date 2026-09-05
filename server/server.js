const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ================================
// Middleware
// ================================

app.use(cors());

app.use(express.json({ limit: '10mb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

app.use(
  fileUpload({
    createParentPath: true,
  })
);

// Serve static uploaded files
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// ================================
// Routes
// ================================

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const providerRoutes = require('./routes/providerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);

// ================================
// Health Check
// ================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Local Service Finder API',
    time: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected',
  });
});

// ================================
// Global Error Handler
// ================================

app.use((err, req, res, next) => {
  console.error('API Error:', err.stack || err);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// ================================
// Database Connection
// ================================

async function connectDatabase() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error(
      'MONGO_URI environment variable is not configured.'
    );
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection failed');
    console.error(error.message);

    throw error;
  }
}

// ================================
// Seed Database
// ================================

async function seedDatabase() {
  try {
    const Provider = require('./models/Provider');

    const providerCount = await Provider.countDocuments();

    console.log(`📊 Current providers: ${providerCount}`);

    if (providerCount < 50) {
      console.log(
        '🌱 Provider dataset low. Running seed data...'
      );

      const seedData = require('./utils/seed');

      await seedData();

      console.log('✅ Seed data completed');
    } else {
      console.log('✅ Database already contains provider data');
    }
  } catch (error) {
    console.error('⚠️ Database seeding failed:', error.message);

    // Do not crash the entire server because of seed failure
  }
}

// ================================
// Start Server
// ================================

async function startServer() {
  try {
    await connectDatabase();

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(
        `🚀 Local Service Finder API running on port ${PORT}`
      );

      console.log(
        `🔗 API Base URL: http://localhost:${PORT}/api`
      );
    });
  } catch (error) {
    console.error(
      '❌ Server startup failed:',
      error.message
    );

    process.exit(1);
  }
}

startServer();

// ================================
// Graceful Shutdown
// ================================

process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...');

  await mongoose.connection.close();

  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down server...');

  await mongoose.connection.close();

  process.exit(0);
});