const API_BASE = import.meta.env.VITE_API_URL;

async function runFullStackE2ETest() {
  console.log('🧪 Starting Full-Stack End-to-End Automated Test Routine...\n');

  if (!API_BASE) {
    throw new Error(
      'VITE_API_URL is not configured. Add it to the Client Vercel Environment Variables.'
    );
  }

  console.log(`🌐 API Base URL: ${API_BASE}\n`);

  try {
    // =========================================================
    // 1. HEALTH CHECK
    // =========================================================
    console.log('1️⃣ Checking API Health...');

    const healthRes = await fetch(`${API_BASE}/health`);

    if (!healthRes.ok) {
      throw new Error(`Health API failed with status ${healthRes.status}`);
    }

    const health = await healthRes.json();

    console.log('   ✅ API Health:', health.status);


    // =========================================================
    // 2. FETCH CATEGORIES
    // =========================================================
    console.log('\n2️⃣ Fetching Service Categories...');

    const catRes = await fetch(`${API_BASE}/categories`);

    if (!catRes.ok) {
      throw new Error(
        `Categories API failed with status ${catRes.status}`
      );
    }

    const categories = await catRes.json();

    if (!Array.isArray(categories)) {
      throw new Error('Categories API did not return an array.');
    }

    console.log(`   ✅ Total Categories in DB: ${categories.length}`);

    categories.slice(0, 4).forEach((category) => {
      console.log(
        `      - ${category.name} (${category.type || 'N/A'})`
      );
    });


    // =========================================================
    // 3. LOCATION-BASED PROVIDER SEARCH
    // =========================================================
    console.log(
      '\n3️⃣ Performing Location-Aware Provider Discovery (Noida Sector 62)...'
    );

    const searchRes = await fetch(
      `${API_BASE}/providers?lat=28.6270&lng=77.3726&radius=25&sortBy=recommended`
    );

    if (!searchRes.ok) {
      throw new Error(
        `Providers API failed with status ${searchRes.status}`
      );
    }

    const providers = await searchRes.json();

    if (!Array.isArray(providers)) {
      throw new Error('Providers API did not return an array.');
    }

    console.log(
      `   ✅ Providers found within 25 km radius: ${providers.length}`
    );

    // IMPORTANT:
    // Do not continue if there are no providers.
    if (providers.length === 0) {
      throw new Error(
        'No providers found. Check MongoDB Atlas data, provider coordinates, approval status, and seed data.'
      );
    }

    const topProvider = providers[0];

    console.log(
      `      🏆 Top Recommended Provider: "${topProvider.businessName}"`
    );

    console.log(
      `      📍 Distance: ${topProvider.distanceKm ?? 'N/A'} km`
    );

    console.log(
      `      ⭐ Rating: ${topProvider.rating ?? 'N/A'}`
    );


    // =========================================================
    // 4. CUSTOMER LOGIN
    // =========================================================
    console.log(
      '\n4️⃣ Authenticating Customer (customer@demo.com)...'
    );

    const custLoginRes = await fetch(
      `${API_BASE}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'customer@demo.com',
          password: 'customer123'
        })
      }
    );

    const customerLogin = await custLoginRes.json();

    if (!custLoginRes.ok) {
      throw new Error(
        `Customer login failed: ${
          customerLogin.message || JSON.stringify(customerLogin)
        }`
      );
    }

    if (!customerLogin.token) {
      throw new Error('Customer login did not return a token.');
    }

    const customerToken = customerLogin.token;

    console.log(
      `   ✅ Customer Logged In: ${
        customerLogin.user?.name || 'Unknown'
      }`
    );

    console.log(
      `      Role: ${customerLogin.user?.role || 'Unknown'}`
    );


    // =========================================================
    // 5. CUSTOMER CREATES BOOKING
    // =========================================================
    console.log('\n5️⃣ Submitting Booking Request...');

    const serviceName =
      topProvider.servicesOffered?.[0]?.name ||
      'Standard Inspection';

    const bookingRes = await fetch(
      `${API_BASE}/bookings`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`
        },
        body: JSON.stringify({
          providerId: topProvider._id,

          serviceName,

          description:
            'Automated E2E Test Request: Appliance inspection and deep service required.',

          // Future date
          bookingDate: '2026-12-15',

          bookingTime: '03:00 PM',

          address: {
            street: 'Sector 62, Royal Palms',
            city: 'Noida',
            pincode: '201301',
            phone: '+91 91234 56789'
          },

          price: topProvider.startingPrice || 299
        })
      }
    );

    const booking = await bookingRes.json();

    if (!bookingRes.ok) {
      throw new Error(
        `Booking creation failed: ${
          booking.message || JSON.stringify(booking)
        }`
      );
    }

    console.log(
      `   ✅ Booking Created! ID: ${
        booking.bookingId || booking._id
      }`
    );

    console.log(
      `      Status: ${booking.status || 'N/A'}`
    );

    console.log(
      `      Price: ₹${booking.price ?? 'N/A'}`
    );

    console.log(
      `      Platform Fee: ₹${booking.platformFee ?? 'N/A'}`
    );

    console.log(
      `      Provider Earnings: ₹${
        booking.providerEarnings ?? 'N/A'
      }`
    );


    // Make sure booking ID exists
    const bookingId = booking._id;

    if (!bookingId) {
      throw new Error(
        'Booking was created but _id was not returned by the API.'
      );
    }


    // =========================================================
    // 6. PROVIDER LOGIN
    // =========================================================
    console.log(
      '\n6️⃣ Authenticating Service Provider (provider@demo.com)...'
    );

    const provLoginRes = await fetch(
      `${API_BASE}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'provider@demo.com',
          password: 'provider123'
        })
      }
    );

    const providerLogin = await provLoginRes.json();

    if (!provLoginRes.ok) {
      throw new Error(
        `Provider login failed: ${
          providerLogin.message ||
          JSON.stringify(providerLogin)
        }`
      );
    }

    if (!providerLogin.token) {
      throw new Error(
        'Provider login did not return a token.'
      );
    }

    const providerToken = providerLogin.token;

    console.log(
      `   ✅ Provider Logged In: ${
        providerLogin.user?.name || 'Unknown'
      }`
    );


    // =========================================================
    // HELPER FUNCTION FOR BOOKING STATUS
    // =========================================================
    async function updateBookingStatus(status) {
      const response = await fetch(
        `${API_BASE}/bookings/${bookingId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${providerToken}`
          },
          body: JSON.stringify({
            status
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `Failed to update booking to "${status}": ${
            data.message || JSON.stringify(data)
          }`
        );
      }

      console.log(`   ✅ Status updated to: ${status}`);
    }


    // =========================================================
    // 7. BOOKING STATUS LIFECYCLE
    // =========================================================
    console.log(
      '\n7️⃣ Provider Updating Booking Status Lifecycle...'
    );

    await updateBookingStatus('Accepted');

    await updateBookingStatus('On the Way');

    await updateBookingStatus('Completed');

    console.log('   🎉 Booking lifecycle completed successfully.');


    // =========================================================
    // 8. CUSTOMER SUBMITS REVIEW
    // =========================================================
    console.log(
      '\n8️⃣ Customer Submitting 5-Star Review...'
    );

    const revRes = await fetch(
      `${API_BASE}/reviews`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`
        },
        body: JSON.stringify({
          bookingId,
          rating: 5,
          comment:
            'Outstanding E2E test service! Prompt arrival and top tier professionalism.'
        })
      }
    );

    const reviewData = await revRes.json();

    if (!revRes.ok) {
      throw new Error(
        `Review submission failed: ${
          reviewData.message ||
          JSON.stringify(reviewData)
        }`
      );
    }

    console.log(
      `   ✅ Review Submitted!`
    );

    console.log(
      `      Rating: ${reviewData.rating ?? 5}★`
    );

    console.log(
      `      Comment: "${
        reviewData.comment ||
        'Outstanding E2E test service!'
      }"`
    );


    // =========================================================
    // 9. ADMIN LOGIN
    // =========================================================
    console.log(
      '\n9️⃣ Authenticating Admin (admin@localservicefinder.com)...'
    );

    const adminLoginRes = await fetch(
      `${API_BASE}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@localservicefinder.com',
          password: 'admin123'
        })
      }
    );

    const adminLogin = await adminLoginRes.json();

    if (!adminLoginRes.ok) {
      throw new Error(
        `Admin login failed: ${
          adminLogin.message ||
          JSON.stringify(adminLogin)
        }`
      );
    }

    if (!adminLogin.token) {
      throw new Error(
        'Admin login did not return a token.'
      );
    }

    const adminToken = adminLogin.token;

    console.log(
      `   ✅ Admin Logged In: ${
        adminLogin.user?.name || 'Admin'
      }`
    );


    // =========================================================
    // 10. ADMIN STATISTICS
    // =========================================================
    console.log('\n🔟 Fetching Admin Platform Metrics...');

    const statsRes = await fetch(
      `${API_BASE}/admin/statistics`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      }
    );

    const statsData = await statsRes.json();

    if (!statsRes.ok) {
      throw new Error(
        `Admin statistics failed: ${
          statsData.message ||
          JSON.stringify(statsData)
        }`
      );
    }

    const stats = statsData.stats;

    if (!stats) {
      throw new Error(
        'Admin statistics API did not return stats.'
      );
    }

    console.log('\n📊 Admin Platform Analytics:');

    console.log(
      `   - Total Customers: ${stats.totalUsers ?? 0}`
    );

    console.log(
      `   - Total Providers: ${
        stats.totalProviders ?? 0
      }`
    );

    console.log(
      `   - Approved Providers: ${
        stats.approvedProviders ?? 0
      }`
    );

    console.log(
      `   - Pending Providers: ${
        stats.pendingProviders ?? 0
      }`
    );

    console.log(
      `   - Total Bookings: ${
        stats.totalBookings ?? 0
      }`
    );

    console.log(
      `   - Completed Bookings: ${
        stats.completedBookings ?? 0
      }`
    );

    console.log(
      `   - Gross Transaction Value: ₹${
        stats.grossTransactionValue ?? 0
      }`
    );

    console.log(
      `   - Platform Commission: ${
        stats.commissionPercentage ?? 0
      }%`
    );

    console.log(
      `   - Platform Revenue: ₹${
        stats.platformRevenue ?? 0
      }`
    );


    // =========================================================
    // SUCCESS
    // =========================================================
    console.log(
      '\n🎉 ALL FULL-STACK END-TO-END TESTS PASSED SUCCESSFULLY!'
    );

    console.log(
      '✅ API'
    );

    console.log(
      '✅ MongoDB'
    );

    console.log(
      '✅ Categories'
    );

    console.log(
      '✅ Providers'
    );

    console.log(
      '✅ Customer Authentication'
    );

    console.log(
      '✅ Booking'
    );

    console.log(
      '✅ Provider Authentication'
    );

    console.log(
      '✅ Booking Status Lifecycle'
    );

    console.log(
      '✅ Reviews'
    );

    console.log(
      '✅ Admin Authentication'
    );

    console.log(
      '✅ Admin Statistics'
    );

  } catch (error) {
    console.error(
      '\n❌ E2E Test Failed:'
    );

    console.error(
      error.message
    );

    console.error(
      '\n🔍 Check the API URL, MongoDB Atlas connection, database seed data, and authentication credentials.'
    );
  }
}

runFullStackE2ETest();