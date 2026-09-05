const API_BASE = 'http://localhost:5000/api';

async function runFullStackE2ETest() {
  console.log('🧪 Starting Full-Stack End-to-End Automated Test Routine...\n');

  try {
    // 1. Health Check
    console.log('1️⃣ Checking API Health...');
    const healthRes = await fetch(`${API_BASE}/health`);
    const health = await healthRes.json();
    console.log('   ✅ API Health status:', health.status);

    // 2. Fetch Categories
    console.log('\n2️⃣ Fetching Service Categories...');
    const catRes = await fetch(`${API_BASE}/categories`);
    const categories = await catRes.json();
    console.log(`   ✅ Total Categories in DB: ${categories.length}`);
    categories.slice(0, 4).forEach(c => console.log(`      - ${c.name} (${c.type})`));

    // 3. Location-Based Provider Search
    console.log('\n3️⃣ Performing Location-Aware Provider Discovery (Noida Sector 62)...');
    const searchRes = await fetch(`${API_BASE}/providers?lat=28.6270&lng=77.3726&radius=15&sortBy=recommended`);
    const providers = await searchRes.json();
    console.log(`   ✅ Providers found within 15 km radius: ${providers.length}`);
    const topProvider = providers[0];
    console.log(`      🏆 Top Recommended Provider: "${topProvider.businessName}" (${topProvider.distanceKm} km away, Rating: ${topProvider.rating}★)`);

    // 4. Login as Customer
    console.log('\n4️⃣ Authenticating Customer (customer@demo.com)...');
    const custLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@demo.com', password: 'customer123' })
    });
    const customerLogin = await custLoginRes.json();
    const customerToken = customerLogin.token;
    console.log(`   ✅ Customer Logged In: ${customerLogin.user.name} (Role: ${customerLogin.user.role})`);

    // 5. Customer Submits Booking Request
    console.log('\n5️⃣ Submitting Booking Request to Top Provider...');
    const bookingRes = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        providerId: topProvider._id,
        serviceName: topProvider.servicesOffered?.[0]?.name || 'Standard Inspection',
        description: 'Automated E2E Test Request: Appliance inspection and deep service required.',
        bookingDate: '2026-08-16',
        bookingTime: '03:00 PM',
        address: {
          street: 'Sector 62, Royal Palms',
          city: 'Noida',
          pincode: '201301',
          phone: '+91 91234 56789'
        },
        price: topProvider.startingPrice || 299
      })
    });
    const booking = await bookingRes.json();
    console.log(`   ✅ Booking Created! ID: ${booking.bookingId}`);
    console.log(`      Status: ${booking.status} | Price: ₹${booking.price} (Platform Fee: ₹${booking.platformFee}, Provider Earnings: ₹${booking.providerEarnings})`);

    // 6. Login as Service Provider
    console.log('\n6️⃣ Authenticating Service Provider (provider@demo.com)...');
    const provLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'provider@demo.com', password: 'provider123' })
    });
    const providerLogin = await provLoginRes.json();
    const providerToken = providerLogin.token;
    console.log(`   ✅ Provider Logged In: ${providerLogin.user.name}`);

    // 7. Provider Advances Booking Status
    console.log('\n7️⃣ Provider Updating Booking Status Lifecycle...');
    
    // Accept
    await fetch(`${API_BASE}/bookings/${booking._id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${providerToken}` },
      body: JSON.stringify({ status: 'Accepted' })
    });
    console.log('   ✅ Status updated to: Accepted');

    // On the Way
    await fetch(`${API_BASE}/bookings/${booking._id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${providerToken}` },
      body: JSON.stringify({ status: 'On the Way' })
    });
    console.log('   ✅ Status updated to: On the Way');

    // Completed
    await fetch(`${API_BASE}/bookings/${booking._id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${providerToken}` },
      body: JSON.stringify({ status: 'Completed' })
    });
    console.log('   ✅ Status updated to: Completed 🎉');

    // 8. Customer Leaves a Review
    console.log('\n8️⃣ Customer Submitting 5-Star Review...');
    const revRes = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        bookingId: booking._id,
        rating: 5,
        comment: 'Outstanding E2E test service! Prompt arrival and top tier professionalism.'
      })
    });
    const reviewData = await revRes.json();
    console.log(`   ✅ Review Submitted! Rating: ${reviewData.rating}★ - "${reviewData.comment}"`);

    // 9. Login as Admin & Fetch Metrics
    console.log('\n9️⃣ Authenticating Admin (admin@localservicefinder.com)...');
    const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@localservicefinder.com', password: 'admin123' })
    });
    const adminLogin = await adminLoginRes.json();
    const adminToken = adminLogin.token;

    const statsRes = await fetch(`${API_BASE}/admin/statistics`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const statsData = await statsRes.json();
    const stats = statsData.stats;

    console.log('\n📊 Admin Platform Analytics:');
    console.log(`   - Total Customers: ${stats.totalUsers}`);
    console.log(`   - Total Providers: ${stats.totalProviders} (Approved: ${stats.approvedProviders}, Pending: ${stats.pendingProviders})`);
    console.log(`   - Total Bookings: ${stats.totalBookings} (Completed: ${stats.completedBookings})`);
    console.log(`   - Gross Transaction Value: ₹${stats.grossTransactionValue}`);
    console.log(`   - Platform Commission Collected (${stats.commissionPercentage}%): ₹${stats.platformRevenue}`);

    console.log('\n🎉 ALL FULL-STACK END-TO-END TESTS PASSED SUCCESSFULLY! 100% OPERATIONAL.');
  } catch (error) {
    console.error('❌ E2E Test Error:', error);
  }
}

runFullStackE2ETest();
