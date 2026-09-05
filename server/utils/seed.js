const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Service = require('../models/Service');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Settings = require('../models/Settings');
const Notification = require('../models/Notification');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/local_service_finder';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`Connected to MongoDB at ${uri}`);
  } catch (err) {
    console.log('Local MongoDB not accessible. Spinning up MongoDB Memory Server for seed...');
    const mongoServer = await MongoMemoryServer.create();
    const memUri = mongoServer.getUri();
    await mongoose.connect(memUri);
    console.log(`Connected to MongoMemoryServer at ${memUri}`);
  }
}

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Service.deleteMany({});
    await Provider.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Settings.deleteMany({});
    await Notification.deleteMany({});

    console.log('Seeding default platform settings...');
    await Settings.create({
      commissionPercentage: 10,
      platformName: 'Local Service Finder',
      contactEmail: 'support@localservicefinder.com'
    });

    console.log('Creating Admin & Test users...');
    const adminUser = await User.create({
      name: 'Platform Admin',
      email: 'admin@localservicefinder.com',
      password: 'admin123',
      phone: '+91 98765 43210',
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300'
    });

    const demoCustomer = await User.create({
      name: 'Anshika Parmar',
      email: 'customer@demo.com',
      password: 'customer123',
      phone: '+91 91234 56789',
      role: 'customer',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      addresses: [
        {
          title: 'Home',
          street: 'Sector 62, Near Electronic City',
          city: 'Noida',
          state: 'Uttar Pradesh',
          pincode: '201301',
          latitude: 28.6270,
          longitude: 77.3726,
          isDefault: true
        }
      ]
    });

    console.log('Creating 20+ Categories...');
    const categoriesData = [
      { name: 'Plumbing', description: 'Leaking pipe repair, tap fitting, bathroom fixtures, and drainage solutions.', icon: 'Wrench', image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600', slug: 'plumbing', type: 'Home Services' },
      { name: 'Electrical Services', description: 'Electrician repairs, fan installation, MCB box wiring, switchboard fix.', icon: 'Zap', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600', slug: 'electrical-services', type: 'Home Services' },
      { name: 'AC Repair & Service', description: 'AC servicing, gas charging, cooling repair, installation & uninstallation.', icon: 'Wind', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=600', slug: 'ac-repair', type: 'Home Services' },
      { name: 'Home Cleaning', description: 'Deep house cleaning, kitchen deep clean, sofa shampooing, bathroom wash.', icon: 'Sparkles', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600', slug: 'home-cleaning', type: 'Home Services' },
      { name: 'Appliance Repair', description: 'Washing machine, refrigerator, microwave oven, and water purifier servicing.', icon: 'Tv', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600', slug: 'appliance-repair', type: 'Home Services' },
      { name: 'Beauty & Salon', description: 'At-home haircut, bridal makeup, facial, waxing, and spa treatments.', icon: 'Scissors', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600', slug: 'beauty-salon', type: 'Personal Services' },
      { name: 'Tutoring & Classes', description: 'Math, Science, Coding, Music, and Language private home tutors.', icon: 'BookOpen', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600', slug: 'tutoring', type: 'Personal Services' },
      { name: 'Car & Bike Repair', description: 'Doorstep vehicle service, battery jumpstart, tyre change & mechanic.', icon: 'Car', image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600', slug: 'car-bike-repair', type: 'Automotive' },
      { name: 'Painting & Waterproofing', description: 'Interior home painting, exterior walls, damp proofing & texture finish.', icon: 'Paintbrush', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600', slug: 'painting', type: 'Home Services' },
      { name: 'Carpentry', description: 'Furniture repair, door lock installation, custom wooden cupboards & fitting.', icon: 'Hammer', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600', slug: 'carpentry', type: 'Home Services' },
      
      // Additional 10 categories
      { name: 'Laptop & Mobile Repair', description: 'Screen replacement, battery fix, motherboard repair & software update.', icon: 'Tv', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=600', slug: 'laptop-mobile-repair', type: 'Technology' },
      { name: 'CCTV Installation', description: 'Security camera setup, DVR configuration, and indoor wiring.', icon: 'Tv', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=600', slug: 'cctv-installation', type: 'Technology' },
      { name: 'Pest Control', description: 'Termite treatment, cockroach control, bed bug spray & rodent control.', icon: 'Sparkles', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=600', slug: 'pest-control', type: 'Home Services' },
      { name: 'RO & Water Purifier', description: 'Filter replacement, membrane check, UV lamp fix & installation.', icon: 'Wrench', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?auto=format&fit=crop&q=80&w=600', slug: 'ro-water-purifier', type: 'Home Services' },
      { name: 'Car Wash & Detailing', description: 'Doorstep foam wash, interior vacuuming & ceramic coating.', icon: 'Car', image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=600', slug: 'car-wash-detailing', type: 'Automotive' },
      { name: 'Fitness & Yoga Trainer', description: 'Personal home gym trainer, weight loss coach & yoga instructor.', icon: 'BookOpen', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600', slug: 'fitness-yoga', type: 'Personal Services' },
      { name: 'Home Packers & Movers', description: 'Household luggage packing, furniture shifting & tempo transport.', icon: 'Car', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600', slug: 'packers-movers', type: 'Professional' },
      { name: 'Event Photography', description: 'Birthday, pre-wedding, maternity, and corporate shoot photographer.', icon: 'Scissors', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600', slug: 'event-photography', type: 'Professional' },
      { name: 'Makeup Artist', description: 'Bridal makeup, party makeover, hair styling & saree draping.', icon: 'Scissors', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=600', slug: 'makeup-artist', type: 'Personal Services' },
      { name: 'Solar Panel Installation', description: 'Rooftop solar setup, inverter wiring, and net metering assistance.', icon: 'Zap', image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=600', slug: 'solar-panel', type: 'Home Services' }
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach(c => { catMap[c.slug] = c._id; });

    console.log('Creating 50+ Services catalog...');
    const servicesData = [
      { name: 'Tap & Mixer Repair', description: 'Fix leaking taps or replace bathroom mixer unit.', category: catMap['plumbing'], startingPrice: 199 },
      { name: 'Drainage Unclogging', description: 'Clear clogged kitchen sink or bathroom drain pipe.', category: catMap['plumbing'], startingPrice: 299 },
      { name: 'Water Tank Cleaning', description: 'Complete hygienic cleaning of overhead water storage tank.', category: catMap['plumbing'], startingPrice: 799 },
      { name: 'Bathroom Pipe Leak Fix', description: 'Concealed pipe leakage detection and repair.', category: catMap['plumbing'], startingPrice: 499 },

      { name: 'Fan Repair & Fitting', description: 'Ceiling or wall fan installation and motor repair.', category: catMap['electrical-services'], startingPrice: 199 },
      { name: 'Switchboard & Socket Fix', description: 'Fix burnt switches, short circuits, and new socket points.', category: catMap['electrical-services'], startingPrice: 149 },
      { name: 'House Complete Rewiring', description: 'Safety inspection and full house copper wiring replacement.', category: catMap['electrical-services'], startingPrice: 1499 },
      { name: 'MCB & Fuse Box Repair', description: 'Trip resolution and main circuit breaker replacement.', category: catMap['electrical-services'], startingPrice: 299 },

      { name: 'AC Deep Foam Servicing', description: 'High-pressure foam jet wash for Split/Window AC.', category: catMap['ac-repair'], startingPrice: 499 },
      { name: 'AC Gas Refill (R32 / R410)', description: 'Leakage detection, pressure test, and full refrigerant refill.', category: catMap['ac-repair'], startingPrice: 1899 },
      { name: 'AC Installation / Removal', description: 'Safe mounting/unmounting with copper pipe fitting.', category: catMap['ac-repair'], startingPrice: 799 },
      { name: 'AC PCB Board Repair', description: 'Inverter AC circuit board repair & sensor replacement.', category: catMap['ac-repair'], startingPrice: 999 },

      { name: 'Full House Deep Cleaning', description: 'Includes rooms, balcony, windows, floor scrubbing & dusting.', category: catMap['home-cleaning'], startingPrice: 1999 },
      { name: 'Bathroom Deep Clean', description: 'Hard water stain removal, tile sanitization & mirror polish.', category: catMap['home-cleaning'], startingPrice: 499 },
      { name: 'Sofa & Mattress Shampoo', description: 'Deep vacuuming, organic shampoo spray & stain extraction.', category: catMap['home-cleaning'], startingPrice: 699 },
      { name: 'Kitchen Chimney & Degreasing', description: 'Degreasing mesh filter, rotor fan wash & outer polish.', category: catMap['home-cleaning'], startingPrice: 599 },

      { name: 'Washing Machine Repair', description: 'Fix drum issue, water intake, or PCB board failure.', category: catMap['appliance-repair'], startingPrice: 349 },
      { name: 'Refrigerator Cooling Repair', description: 'Compressor check, thermostat fix, and defrost timer.', category: catMap['appliance-repair'], startingPrice: 449 },
      { name: 'Microwave Oven Fix', description: 'Magnetron replacement, heating issue fix & door switch.', category: catMap['appliance-repair'], startingPrice: 399 },

      { name: 'Men Haircut & Beard Trim', description: 'Styling haircut, beard shape up & head massage.', category: catMap['beauty-salon'], startingPrice: 249 },
      { name: 'Women Glow Facial & Cleanup', description: 'Herbal facial, fruit facial, and skin radiance treatment.', category: catMap['beauty-salon'], startingPrice: 699 },
      { name: 'Full Body Waxing & Spa', description: 'Rica wax treatment with relaxing body oil massage.', category: catMap['beauty-salon'], startingPrice: 999 },

      { name: 'Class 9-12 Math & Physics Tutor', description: 'Personalized 1-on-1 home tuitions by experienced faculty.', category: catMap['tutoring'], startingPrice: 500 },
      { name: 'Python & Web Development Tutor', description: 'Learn JavaScript, React, and Python hands-on.', category: catMap['tutoring'], startingPrice: 750 },

      { name: 'Full Car Wash & Polish', description: 'Foam wash, interior vacuuming & dashboard polish.', category: catMap['car-bike-repair'], startingPrice: 499 },
      { name: 'Bike General Servicing', description: 'Engine oil change, brake adjustment, and chain lube.', category: catMap['car-bike-repair'], startingPrice: 399 },

      { name: 'Full Room Painting', description: 'Asian Paints tractor emulsion coating with primer base.', category: catMap['painting'], startingPrice: 2499 },
      { name: 'Door & Lock Installation', description: 'Main door lock replacement, hinge repair & latch fix.', category: catMap['carpentry'], startingPrice: 299 },

      // Additional Services
      { name: 'Laptop Display Screen Replace', description: 'HD IPS display panel replacement with 6 months warranty.', category: catMap['laptop-mobile-repair'], startingPrice: 2499 },
      { name: 'iPhone & Android Battery Fix', description: 'Original high capacity battery installation.', category: catMap['laptop-mobile-repair'], startingPrice: 999 },
      { name: '4-Camera HD CCTV Kit Setup', description: '4 Night vision IP cameras with 1TB DVR recording.', category: catMap['cctv-installation'], startingPrice: 5999 },
      { name: 'Full Home Anti-Termite Control', description: 'Drill-fill-seal chemical barrier with 2 years warranty.', category: catMap['pest-control'], startingPrice: 1499 },
      { name: 'RO Filter & Membrane Replace', description: 'Sediment, Carbon filter & 75 GPD Membrane change.', category: catMap['ro-water-purifier'], startingPrice: 599 },
      { name: 'Full Body Car Ceramic Coat', description: '9H Hardness hydrophobic ceramic paint protection.', category: catMap['car-wash-detailing'], startingPrice: 3999 },
      { name: 'Personal Home Fitness Coach', description: 'Dedicated personal trainer for strength & weight loss.', category: catMap['fitness-yoga'], startingPrice: 600 },
      { name: 'Local City Luggage Shifting', description: 'Tempo transport with loader boys for safe shifting.', category: catMap['packers-movers'], startingPrice: 1800 },
      { name: 'Pre-Wedding Couple Shoot', description: 'Outdoor shoot with drone footage & color graded album.', category: catMap['event-photography'], startingPrice: 9999 },
      { name: 'HD Bridal Makeup Package', description: 'Mac/Kryolan HD bridal makeup with hair styling & draping.', category: catMap['makeup-artist'], startingPrice: 4999 },
      { name: '3KW Rooftop Solar Installation', description: 'Mono PERC solar panels with 3KW On-Grid Inverter.', category: catMap['solar-panel'], startingPrice: 150000 }
    ];

    await Service.insertMany(servicesData);

    console.log('Creating 100+ Realistic Service Providers across Indian Cities...');

    const targetCities = [
      { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
      { city: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910 },
      { city: 'Greater Noida', state: 'Uttar Pradesh', lat: 28.4744, lng: 77.5040 },
      { city: 'Delhi', state: 'Delhi NCR', lat: 28.6139, lng: 77.2090 },
      { city: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538 },
      { city: 'Gurgaon', state: 'Haryana', lat: 28.4595, lng: 77.0266 }
    ];

    const categorySlugsList = [
      'plumbing', 'electrical-services', 'ac-repair', 'home-cleaning', 'appliance-repair',
      'beauty-salon', 'tutoring', 'car-bike-repair', 'painting', 'carpentry',
      'laptop-mobile-repair', 'cctv-installation', 'pest-control', 'ro-water-purifier',
      'car-wash-detailing', 'fitness-yoga', 'packers-movers', 'event-photography',
      'makeup-artist', 'solar-panel'
    ];

    const namesSeed = [
      'Rahul Sharma', 'Amit Verma', 'Sanjay Kumar', 'Priya Kapoor', 'Deepak Yadav',
      'Rohan Gupta', 'Dr. Alok Nath', 'Vikas Auto', 'Manish Carpenter', 'Ramesh Painters',
      'Suresh Singh', 'Karan Malhotra', 'Sunita Beauty', 'Harish Electric', 'CleanSquad',
      'Gaurav Mechanic', 'Neha Tutor', 'Satish Fix', 'Woodland Crafts', 'Perfect Colors',
      'Anand Tech', 'Sunil Plumbing', 'Pooja Makeup', 'Vikram Solar', 'Tarun Cameras',
      'Neeraj Packers', 'Shruti Yoga', 'Rajiv Repair', 'Nitin Pest Control', 'Arjun Detailing',
      'Bhavna Salon', 'Chetan Tutors', 'Dinesh Electricals', 'Ekta Beauty', 'Farhan AC Care',
      'Girish Plumber', 'Himanshu Auto', 'Isha Studio', 'Jitin Services', 'Kavita Clean',
      'Lokesh Tech', 'Mayank Solar', 'Nisha Spa', 'Om Prakash', 'Pradeep RO',
      'Qasim Repair', 'Ritu Tutors', 'Sachin Movers', 'Trupti Beauty', 'Umesh Paint',
      'Varun CCTV', 'Yash Mobile', 'Zubair Plumbing', 'Abhay Electric', 'Bala Carpentry',
      'Chandan AC', 'Divya Hair', 'Eshwar Auto', 'Geeta Fitness', 'Hemant Pest',
      'Inder Water', 'Jaya Photo', 'Kapil Tech', 'Lata Salon', 'Mohit Solar',
      'Naveen Movers', 'Ojas Tutors', 'Preeti Makeup', 'Rakesh Plumber', 'Suraj AC',
      'Tanvi Spa', 'Upendra Electric', 'Vineet Auto', 'Yogesh Cleaners', 'Aarti Tutor',
      'Bhavesh Repair', 'Charu Beauty', 'Dhiraj Solar', 'Gautam Packers', 'Ishita Photo',
      'Jagdish Pest', 'Kiran RO', 'Lalit Detailing', 'Monika Salon', 'Nandan Paint',
      'Omkar Carpentry', 'Parul Tutors', 'Raman Electric', 'Seema Clean', 'Tushar Tech',
      'Utkarsh CCTV', 'Vandana Makeup', 'Wasim Plumber', 'Yuvraj Auto', 'Zaheer Solar',
      'Aakash Repair', 'Brijesh AC', 'Chetna Fitness', 'Devendra Packers', 'Gargi Studio'
    ];

    let createdProviders = [];

    for (let i = 0; i < namesSeed.length; i++) {
      const name = namesSeed[i];
      const catSlug = categorySlugsList[i % categorySlugsList.length];
      const cityObj = targetCities[i % targetCities.length];
      const catObjId = catMap[catSlug] || createdCategories[0]._id;

      // Small geographic offset for realistic distribution around city center
      const latOffset = (Math.sin(i) * 0.04);
      const lngOffset = (Math.cos(i) * 0.04);

      const user = await User.create({
        name: name,
        email: `provider_${i + 1}@localservice.com`,
        password: 'provider123',
        phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: 'provider',
        profileImage: `https://i.pravatar.cc/300?img=${(i % 70) + 1}`
      });

      const basePrice = 199 + (i % 8) * 100;
      const ratingVal = Math.round((4.0 + (i % 10) * 0.1) * 10) / 10;
      const reviewCountVal = 10 + (i * 7) % 300;

      const provider = await Provider.create({
        user: user._id,
        businessName: `${name.split(' ')[0]} ${categoriesData.find(c => c.slug === catSlug)?.name || 'Local'} Services`,
        description: `Verified professional ${name} providing expert services across ${cityObj.city} with over ${3 + (i % 12)} years of experience.`,
        category: catObjId,
        servicesOffered: [
          { name: `Standard ${categoriesData.find(c => c.slug === catSlug)?.name || 'Service'}`, price: basePrice, description: 'Diagnostic and standard service work.' },
          { name: `Express Premium Package`, price: basePrice + 250, description: 'Priority doorstep delivery with premium parts.' }
        ],
        experienceYears: 3 + (i % 12),
        startingPrice: basePrice,
        coverImage: `https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1000`,
        location: {
          type: 'Point',
          coordinates: [cityObj.lng + lngOffset, cityObj.lat + latOffset],
          formattedAddress: `Sector ${10 + (i % 40)}, ${cityObj.city}, ${cityObj.state}`,
          city: cityObj.city,
          state: cityObj.state
        },
        serviceAreaRadiusKm: 10 + (i % 15),
        workingHours: 'Mon-Sat: 9:00 AM - 8:00 PM',
        isAvailable: true,
        gallery: [
          'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=500',
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=500'
        ],
        verificationStatus: (i % 15 === 0) ? 'pending' : ((i % 25 === 0) ? 'rejected' : 'approved'),
        verificationDocumentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
        isFeatured: (i % 5 === 0),
        rating: ratingVal > 5 ? 5.0 : ratingVal,
        reviewCount: reviewCountVal,
        totalJobsCompleted: reviewCountVal + 20
      });

      createdProviders.push(provider);
    }

    console.log('Creating Demo Provider account (provider@demo.com)...');
    const demoProviderUser = await User.create({
      name: 'Rahul Sharma',
      email: 'provider@demo.com',
      password: 'provider123',
      phone: '+91 98111 22233',
      role: 'provider',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
    });

    const demoProvider = await Provider.create({
      user: demoProviderUser._id,
      businessName: 'Rahul Electrical & AC Services',
      description: 'Certified Master Electrician and AC repair technician serving Noida Sector 62 & nearby areas. 8 years experience in commercial & domestic repairs.',
      category: catMap['electrical-services'],
      servicesOffered: [
        { name: 'Electrical Switchboard Fix', price: 199, description: 'Fix burnt wiring and switch sockets.' },
        { name: 'Ceiling Fan Installation', price: 149, description: 'Mounting and connection of ceiling fan.' },
        { name: 'AC Deep Foam Jet Cleaning', price: 499, description: 'High pressure foam wash for Split AC.' }
      ],
      experienceYears: 8,
      startingPrice: 199,
      coverImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200',
      location: {
        type: 'Point',
        coordinates: [77.3726, 28.6270],
        formattedAddress: 'Sector 62, Noida, Uttar Pradesh',
        city: 'Noida',
        state: 'Uttar Pradesh'
      },
      serviceAreaRadiusKm: 20,
      workingHours: 'Mon-Sat: 9:00 AM - 7:00 PM',
      isAvailable: true,
      gallery: [
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600'
      ],
      verificationStatus: 'approved',
      isFeatured: true,
      rating: 4.8,
      reviewCount: 246,
      totalJobsCompleted: 260
    });

    console.log('Creating sample bookings and reviews...');

    const sampleBooking = await Booking.create({
      bookingId: '#LSF10293',
      customer: demoCustomer._id,
      provider: demoProvider._id,
      serviceName: 'Ceiling Fan Installation',
      description: 'Need assistance installing 2 new ceiling fans in bedroom and living room.',
      bookingDate: '2026-08-15',
      bookingTime: '04:00 PM',
      address: {
        street: 'Flat 402, Block B, Royal Palms, Sector 62',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        phone: '+91 91234 56789'
      },
      price: 398,
      commissionPercentage: 10,
      platformFee: 40,
      providerEarnings: 358,
      status: 'Completed',
      statusHistory: [
        { status: 'Pending', timestamp: new Date(Date.now() - 86400000 * 2), note: 'Booking requested by customer' },
        { status: 'Accepted', timestamp: new Date(Date.now() - 86400000 * 1.5), note: 'Provider accepted request' },
        { status: 'On the Way', timestamp: new Date(Date.now() - 86400000 * 1), note: 'Technician on the way' },
        { status: 'In Progress', timestamp: new Date(Date.now() - 3600000 * 5), note: 'Service started' },
        { status: 'Completed', timestamp: new Date(Date.now() - 3600000 * 2), note: 'Service completed successfully' }
      ],
      paymentStatus: 'Paid',
      hasReview: true
    });

    await Review.create({
      customer: demoCustomer._id,
      provider: demoProvider._id,
      booking: sampleBooking._id,
      rating: 5,
      comment: 'Rahul arrived right on time, had all professional tools, and installed both fans very neatly within 45 minutes! Highly recommended.',
      images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400']
    });

    await Booking.create({
      bookingId: '#LSF10488',
      customer: demoCustomer._id,
      provider: demoProvider._id,
      serviceName: 'AC Deep Foam Jet Cleaning',
      description: 'Split AC is not cooling properly and making slight noise. Needs deep foam cleaning.',
      bookingDate: '2026-08-16',
      bookingTime: '02:30 PM',
      address: {
        street: 'Flat 402, Block B, Royal Palms, Sector 62',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        phone: '+91 91234 56789'
      },
      price: 499,
      commissionPercentage: 10,
      platformFee: 50,
      providerEarnings: 449,
      status: 'Pending',
      statusHistory: [
        { status: 'Pending', timestamp: new Date(), note: 'Booking requested by customer' }
      ],
      paymentStatus: 'Pending',
      hasReview: false
    });

    console.log('✅ Database Seeding Completed Successfully!');
    console.log(`📊 Total Seeded: ${createdCategories.length} Categories, ${servicesData.length} Services, ${createdProviders.length + 1} Providers.`);
    console.log('==================================================');
    console.log('Test Login Credentials:');
    console.log('1. Admin:    admin@localservicefinder.com  / admin123');
    console.log('2. Customer: customer@demo.com             / customer123');
    console.log('3. Provider: provider@demo.com             / provider123');
    console.log('==================================================');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (err) {
    console.error('Error seeding database:', err);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
