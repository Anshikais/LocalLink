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
  if (mongoose.connection.readyState === 1) {
    return;
  }
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

    console.log('Creating Admin & Customer users...');
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
          street: 'Gomti Nagar, Near Riverside Mall',
          city: 'Lucknow',
          state: 'Uttar Pradesh',
          pincode: '226010',
          latitude: 26.8990,
          longitude: 81.0500,
          isDefault: true
        }
      ]
    });

    console.log('Creating 20+ Categories with Topic-Accurate Images...');
    const categoriesData = [
      { name: 'Plumbing', description: 'Leaking pipe repair, tap fitting, bathroom fixtures, and drainage solutions.', icon: 'Wrench', image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=800', slug: 'plumbing', type: 'Home Services' },
      { name: 'Electrical Services', description: 'Electrician repairs, fan installation, MCB box wiring, switchboard fix.', icon: 'Zap', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800', slug: 'electrical-services', type: 'Home Services' },
      { name: 'AC Repair & Service', description: 'AC servicing, gas charging, cooling repair, installation & uninstallation.', icon: 'Wind', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800', slug: 'ac-repair', type: 'Home Services' },
      { name: 'Home Cleaning', description: 'Deep house cleaning, kitchen deep clean, sofa shampooing, bathroom wash.', icon: 'Sparkles', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800', slug: 'home-cleaning', type: 'Home Services' },
      { name: 'Appliance Repair', description: 'Washing machine, refrigerator, microwave oven, and water purifier servicing.', icon: 'Tv', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', slug: 'appliance-repair', type: 'Home Services' },
      { name: 'Beauty & Salon', description: 'At-home haircut, bridal makeup, facial, waxing, and spa treatments.', icon: 'Scissors', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800', slug: 'beauty-salon', type: 'Personal Services' },
      { name: 'Tutoring & Classes', description: 'Math, Science, Coding, Music, and Language private home tutors.', icon: 'BookOpen', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800', slug: 'tutoring', type: 'Personal Services' },
      { name: 'Car & Bike Repair', description: 'Doorstep vehicle service, battery jumpstart, tyre change & mechanic.', icon: 'Car', image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800', slug: 'car-bike-repair', type: 'Automotive' },
      { name: 'Painting & Waterproofing', description: 'Interior home painting, exterior walls, damp proofing & texture finish.', icon: 'Paintbrush', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800', slug: 'painting', type: 'Home Services' },
      { name: 'Carpentry', description: 'Furniture repair, door lock installation, custom wooden cupboards & fitting.', icon: 'Hammer', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800', slug: 'carpentry', type: 'Home Services' },
      { name: 'Laptop & Mobile Repair', description: 'Screen replacement, battery fix, motherboard repair & software update.', icon: 'Tv', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800', slug: 'laptop-mobile-repair', type: 'Technology' },
      { name: 'CCTV Installation', description: 'Security camera setup, DVR configuration, and indoor wiring.', icon: 'Tv', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800', slug: 'cctv-installation', type: 'Technology' },
      { name: 'Pest Control', description: 'Termite treatment, cockroach control, bed bug spray & rodent control.', icon: 'Sparkles', image: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&q=80&w=800', slug: 'pest-control', type: 'Home Services' },
      { name: 'RO & Water Purifier', description: 'Filter replacement, membrane check, UV lamp fix & installation.', icon: 'Wrench', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?auto=format&fit=crop&q=80&w=800', slug: 'ro-water-purifier', type: 'Home Services' },
      { name: 'Car Wash & Detailing', description: 'Doorstep foam wash, interior vacuuming & ceramic coating.', icon: 'Car', image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=800', slug: 'car-wash-detailing', type: 'Automotive' },
      { name: 'Fitness & Yoga Trainer', description: 'Personal home gym trainer, weight loss coach & yoga instructor.', icon: 'BookOpen', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800', slug: 'fitness-yoga', type: 'Personal Services' },
      { name: 'Home Packers & Movers', description: 'Household luggage packing, furniture shifting & tempo transport.', icon: 'Car', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800', slug: 'packers-movers', type: 'Professional' },
      { name: 'Event Photography', description: 'Birthday, pre-wedding, maternity, and corporate shoot photographer.', icon: 'Scissors', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', slug: 'event-photography', type: 'Professional' },
      { name: 'Makeup Artist', description: 'Bridal makeup, party makeover, hair styling & saree draping.', icon: 'Scissors', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800', slug: 'makeup-artist', type: 'Personal Services' },
      { name: 'Solar Panel Installation', description: 'Rooftop solar setup, inverter wiring, and net metering assistance.', icon: 'Zap', image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800', slug: 'solar-panel', type: 'Home Services' }
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    const catImageMap = {};
    createdCategories.forEach(c => { 
      catMap[c.slug] = c._id; 
      catImageMap[c.slug] = c.image;
    });

    console.log('Creating 50+ Services catalog...');
    const servicesData = [
      { name: 'Tap & Mixer Repair', description: 'Fix leaking taps or replace bathroom mixer unit.', category: catMap['plumbing'], startingPrice: 199, image: catImageMap['plumbing'] },
      { name: 'Drainage Unclogging', description: 'Clear clogged kitchen sink or bathroom drain pipe.', category: catMap['plumbing'], startingPrice: 299, image: catImageMap['plumbing'] },
      { name: 'Water Tank Cleaning', description: 'Complete hygienic cleaning of overhead water storage tank.', category: catMap['plumbing'], startingPrice: 799, image: catImageMap['plumbing'] },
      { name: 'Bathroom Pipe Leak Fix', description: 'Concealed pipe leakage detection and repair.', category: catMap['plumbing'], startingPrice: 499, image: catImageMap['plumbing'] },

      { name: 'Fan Repair & Fitting', description: 'Ceiling or wall fan installation and motor repair.', category: catMap['electrical-services'], startingPrice: 199, image: catImageMap['electrical-services'] },
      { name: 'Switchboard & Socket Fix', description: 'Fix burnt switches, short circuits, and new socket points.', category: catMap['electrical-services'], startingPrice: 149, image: catImageMap['electrical-services'] },
      { name: 'House Complete Rewiring', description: 'Safety inspection and full house copper wiring replacement.', category: catMap['electrical-services'], startingPrice: 1499, image: catImageMap['electrical-services'] },
      { name: 'MCB & Fuse Box Repair', description: 'Trip resolution and main circuit breaker replacement.', category: catMap['electrical-services'], startingPrice: 299, image: catImageMap['electrical-services'] },

      { name: 'AC Deep Foam Servicing', description: 'High-pressure foam jet wash for Split/Window AC.', category: catMap['ac-repair'], startingPrice: 499, image: catImageMap['ac-repair'] },
      { name: 'AC Gas Refill (R32 / R410)', description: 'Leakage detection, pressure test, and full refrigerant refill.', category: catMap['ac-repair'], startingPrice: 1899, image: catImageMap['ac-repair'] },
      { name: 'AC Installation / Removal', description: 'Safe mounting/unmounting with copper pipe fitting.', category: catMap['ac-repair'], startingPrice: 799, image: catImageMap['ac-repair'] },
      { name: 'AC PCB Board Repair', description: 'Inverter AC circuit board repair & sensor replacement.', category: catMap['ac-repair'], startingPrice: 999, image: catImageMap['ac-repair'] },

      { name: 'Full House Deep Cleaning', description: 'Includes rooms, balcony, windows, floor scrubbing & dusting.', category: catMap['home-cleaning'], startingPrice: 1999, image: catImageMap['home-cleaning'] },
      { name: 'Bathroom Deep Clean', description: 'Hard water stain removal, tile sanitization & mirror polish.', category: catMap['home-cleaning'], startingPrice: 499, image: catImageMap['home-cleaning'] },
      { name: 'Sofa & Mattress Shampoo', description: 'Deep vacuuming, organic shampoo spray & stain extraction.', category: catMap['home-cleaning'], startingPrice: 699, image: catImageMap['home-cleaning'] },
      { name: 'Kitchen Chimney & Degreasing', description: 'Degreasing mesh filter, rotor fan wash & outer polish.', category: catMap['home-cleaning'], startingPrice: 599, image: catImageMap['home-cleaning'] },

      { name: 'Washing Machine Repair', description: 'Fix drum issue, water intake, or PCB board failure.', category: catMap['appliance-repair'], startingPrice: 349, image: catImageMap['appliance-repair'] },
      { name: 'Refrigerator Cooling Repair', description: 'Compressor check, thermostat fix, and defrost timer.', category: catMap['appliance-repair'], startingPrice: 449, image: catImageMap['appliance-repair'] },
      { name: 'Microwave Oven Fix', description: 'Magnetron replacement, heating issue fix & door switch.', category: catMap['appliance-repair'], startingPrice: 399, image: catImageMap['appliance-repair'] },

      { name: 'Men Haircut & Beard Trim', description: 'Styling haircut, beard shape up & head massage.', category: catMap['beauty-salon'], startingPrice: 249, image: catImageMap['beauty-salon'] },
      { name: 'Women Glow Facial & Cleanup', description: 'Herbal facial, fruit facial, and skin radiance treatment.', category: catMap['beauty-salon'], startingPrice: 699, image: catImageMap['beauty-salon'] },
      { name: 'Full Body Waxing & Spa', description: 'Rica wax treatment with relaxing body oil massage.', category: catMap['beauty-salon'], startingPrice: 999, image: catImageMap['beauty-salon'] },

      { name: 'Class 9-12 Math & Physics Tutor', description: 'Personalized 1-on-1 home tuitions by experienced faculty.', category: catMap['tutoring'], startingPrice: 500, image: catImageMap['tutoring'] },
      { name: 'Python & Web Development Tutor', description: 'Learn JavaScript, React, and Python hands-on.', category: catMap['tutoring'], startingPrice: 750, image: catImageMap['tutoring'] },

      { name: 'Full Car Wash & Polish', description: 'Foam wash, interior vacuuming & dashboard polish.', category: catMap['car-bike-repair'], startingPrice: 499, image: catImageMap['car-bike-repair'] },
      { name: 'Bike General Servicing', description: 'Engine oil change, brake adjustment, and chain lube.', category: catMap['car-bike-repair'], startingPrice: 399, image: catImageMap['car-bike-repair'] },

      { name: 'Full Room Painting', description: 'Asian Paints tractor emulsion coating with primer base.', category: catMap['painting'], startingPrice: 2499, image: catImageMap['painting'] },
      { name: 'Door & Lock Installation', description: 'Main door lock replacement, hinge repair & latch fix.', category: catMap['carpentry'], startingPrice: 299, image: catImageMap['carpentry'] },
      { name: 'Laptop Display Screen Replace', description: 'HD IPS display panel replacement with 6 months warranty.', category: catMap['laptop-mobile-repair'], startingPrice: 2499, image: catImageMap['laptop-mobile-repair'] },
      { name: 'iPhone & Android Battery Fix', description: 'Original high capacity battery installation.', category: catMap['laptop-mobile-repair'], startingPrice: 999, image: catImageMap['laptop-mobile-repair'] },
      { name: '4-Camera HD CCTV Kit Setup', description: '4 Night vision IP cameras with 1TB DVR recording.', category: catMap['cctv-installation'], startingPrice: 5999, image: catImageMap['cctv-installation'] },
      { name: 'Full Home Anti-Termite Control', description: 'Drill-fill-seal chemical barrier with 2 years warranty.', category: catMap['pest-control'], startingPrice: 1499, image: catImageMap['pest-control'] },
      { name: 'RO Filter & Membrane Replace', description: 'Sediment, Carbon filter & 75 GPD Membrane change.', category: catMap['ro-water-purifier'], startingPrice: 599, image: catImageMap['ro-water-purifier'] },
      { name: 'Full Body Car Ceramic Coat', description: '9H Hardness hydrophobic ceramic paint protection.', category: catMap['car-wash-detailing'], startingPrice: 3999, image: catImageMap['car-wash-detailing'] },
      { name: 'Personal Home Fitness Coach', description: 'Dedicated personal trainer for strength & weight loss.', category: catMap['fitness-yoga'], startingPrice: 600, image: catImageMap['fitness-yoga'] },
      { name: 'Local City Luggage Shifting', description: 'Tempo transport with loader boys for safe shifting.', category: catMap['packers-movers'], startingPrice: 1800, image: catImageMap['packers-movers'] },
      { name: 'Pre-Wedding Couple Shoot', description: 'Outdoor shoot with drone footage & color graded album.', category: catMap['event-photography'], startingPrice: 9999, image: catImageMap['event-photography'] },
      { name: 'HD Bridal Makeup Package', description: 'Mac/Kryolan HD bridal makeup with hair styling & draping.', category: catMap['makeup-artist'], startingPrice: 4999, image: catImageMap['makeup-artist'] },
      { name: '3KW Rooftop Solar Installation', description: 'Mono PERC solar panels with 3KW On-Grid Inverter.', category: catMap['solar-panel'], startingPrice: 150000, image: catImageMap['solar-panel'] }
    ];

    await Service.insertMany(servicesData);

    console.log('Creating 120+ Realistic Service Providers across Lucknow & NCR...');

    // Dedicated Lucknow localities with realistic lat/lng surrounding user location (~26.899, ~81.050) & Hazratganj (~26.846)
    const lucknowLocalities = [
      { locality: 'Gomti Nagar', lat: 26.8530, lng: 81.0010 },
      { locality: 'Gomti Nagar Extension', lat: 26.8850, lng: 81.0350 },
      { locality: 'Indira Nagar', lat: 26.8870, lng: 80.9950 },
      { locality: 'Hazratganj', lat: 26.8467, lng: 80.9462 },
      { locality: 'Aliganj', lat: 26.8920, lng: 80.9410 },
      { locality: 'Mahanagar', lat: 26.8720, lng: 80.9520 },
      { locality: 'Chinhat', lat: 26.8990, lng: 81.0500 },
      { locality: 'Vikas Nagar', lat: 26.8980, lng: 80.9630 },
      { locality: 'Ashiyana', lat: 26.7900, lng: 80.9120 },
      { locality: 'Alambagh', lat: 26.8150, lng: 80.9000 },
      { locality: 'Jankipuram', lat: 26.9200, lng: 80.9480 },
      { locality: 'Rajajipuram', lat: 26.8350, lng: 80.8850 }
    ];

    const ncrCities = [
      { city: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910 },
      { city: 'Greater Noida', state: 'Uttar Pradesh', lat: 28.4744, lng: 77.5040 },
      { city: 'Delhi', state: 'Delhi NCR', lat: 28.6139, lng: 77.2090 },
      { city: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538 },
      { city: 'Gurgaon', state: 'Haryana', lat: 28.4595, lng: 77.0266 }
    ];

    const categorySlugsList = Object.keys(catMap);

    const providerNames = [
      // 40 Lucknow Specific Providers
      { name: 'Lucknow Cool Tech AC', cat: 'ac-repair', city: 'Lucknow', localityIdx: 0, rating: 4.9, reviews: 184, price: 499, exp: 8 },
      { name: 'Gomti Nagar Plumbing Solutions', cat: 'plumbing', city: 'Lucknow', localityIdx: 1, rating: 4.8, reviews: 142, price: 299, exp: 6 },
      { name: 'Indira Electricians & Wiring', cat: 'electrical-services', city: 'Lucknow', localityIdx: 2, rating: 4.7, reviews: 98, price: 199, exp: 9 },
      { name: 'Awadh Deep Cleaning Squad', cat: 'home-cleaning', city: 'Lucknow', localityIdx: 6, rating: 4.9, reviews: 210, price: 1499, exp: 5 },
      { name: 'Hazratganj Appliance Care', cat: 'appliance-repair', city: 'Lucknow', localityIdx: 3, rating: 4.6, reviews: 88, price: 349, exp: 7 },
      { name: 'Royal Awadh Salon at Home', cat: 'beauty-salon', city: 'Lucknow', localityIdx: 0, rating: 4.9, reviews: 312, price: 599, exp: 10 },
      { name: 'Lucknow Genius Home Tutors', cat: 'tutoring', city: 'Lucknow', localityIdx: 4, rating: 4.8, reviews: 65, price: 600, exp: 12 },
      { name: 'Gomti Auto Repair & Garage', cat: 'car-bike-repair', city: 'Lucknow', localityIdx: 1, rating: 4.7, reviews: 154, price: 399, exp: 9 },
      { name: 'Aliganj Express Painters', cat: 'painting', city: 'Lucknow', localityIdx: 4, rating: 4.8, reviews: 118, price: 2199, exp: 11 },
      { name: 'Chinhat Wooden Crafts & Furniture', cat: 'carpentry', city: 'Lucknow', localityIdx: 6, rating: 4.6, reviews: 76, price: 299, exp: 8 },
      { name: 'Nawab Tech Laptop & Mobile Repair', cat: 'laptop-mobile-repair', city: 'Lucknow', localityIdx: 3, rating: 4.8, reviews: 190, price: 499, exp: 7 },
      { name: 'Lucknow Safe Vision CCTV', cat: 'cctv-installation', city: 'Lucknow', localityIdx: 5, rating: 4.7, reviews: 84, price: 3499, exp: 6 },
      { name: 'Gomti Pest Free Solutions', cat: 'pest-control', city: 'Lucknow', localityIdx: 0, rating: 4.9, reviews: 130, price: 999, exp: 8 },
      { name: 'Pure Jal RO Services Lucknow', cat: 'ro-water-purifier', city: 'Lucknow', localityIdx: 2, rating: 4.8, reviews: 162, price: 399, exp: 5 },
      { name: 'Shine & Drive Doorstep Car Wash', cat: 'car-wash-detailing', city: 'Lucknow', localityIdx: 6, rating: 4.9, reviews: 240, price: 499, exp: 4 },
      { name: 'Awadh Fitness & Yoga Trainer', cat: 'fitness-yoga', city: 'Lucknow', localityIdx: 1, rating: 4.9, reviews: 72, price: 800, exp: 7 },
      { name: 'Lucknow City Packers & Movers', cat: 'packers-movers', city: 'Lucknow', localityIdx: 9, rating: 4.7, reviews: 145, price: 2500, exp: 10 },
      { name: 'Royal Memories Studio Lucknow', cat: 'event-photography', city: 'Lucknow', localityIdx: 3, rating: 4.9, reviews: 94, price: 7999, exp: 9 },
      { name: 'Awadhi Glam Bridal Makeup Studio', cat: 'makeup-artist', city: 'Lucknow', localityIdx: 0, rating: 4.9, reviews: 280, price: 3999, exp: 8 },
      { name: 'Surya Power Solar Lucknow', cat: 'solar-panel', city: 'Lucknow', localityIdx: 7, rating: 4.8, reviews: 45, price: 120000, exp: 6 },
      { name: 'Master Pipe Fixer Lucknow', cat: 'plumbing', city: 'Lucknow', localityIdx: 6, rating: 4.7, reviews: 105, price: 249, exp: 9 },
      { name: 'PowerGrid Electricals Gomti Nagar', cat: 'electrical-services', city: 'Lucknow', localityIdx: 0, rating: 4.8, reviews: 175, price: 199, exp: 12 },
      { name: 'ChillZone AC Technicians', cat: 'ac-repair', city: 'Lucknow', localityIdx: 6, rating: 4.9, reviews: 295, price: 549, exp: 10 },
      { name: 'Sparkle Clean Home Services', cat: 'home-cleaning', city: 'Lucknow', localityIdx: 1, rating: 4.8, reviews: 160, price: 1299, exp: 4 },
      { name: 'QuickFix Refrigerator & Washing Machine', cat: 'appliance-repair', city: 'Lucknow', localityIdx: 5, rating: 4.7, reviews: 112, price: 399, exp: 8 },
      { name: 'Glow & Grace Home Salon', cat: 'beauty-salon', city: 'Lucknow', localityIdx: 2, rating: 4.9, reviews: 215, price: 499, exp: 6 },
      { name: 'Lucknow Scholars Home Tuition', cat: 'tutoring', city: 'Lucknow', localityIdx: 0, rating: 4.8, reviews: 55, price: 700, exp: 14 },
      { name: 'Speedy Mechanic Bike & Car', cat: 'car-bike-repair', city: 'Lucknow', localityIdx: 9, rating: 4.6, reviews: 135, price: 299, exp: 7 },
      { name: 'Colors of Awadh Painting', cat: 'painting', city: 'Lucknow', localityIdx: 7, rating: 4.8, reviews: 92, price: 2499, exp: 13 },
      { name: 'WoodCraft Carpenter Aliganj', cat: 'carpentry', city: 'Lucknow', localityIdx: 4, rating: 4.7, reviews: 81, price: 350, exp: 15 },
      { name: 'Gomti Mobile Screen & Battery', cat: 'laptop-mobile-repair', city: 'Lucknow', localityIdx: 0, rating: 4.8, reviews: 220, price: 699, exp: 8 },
      { name: 'Secure Home CCTV Lucknow', cat: 'cctv-installation', city: 'Lucknow', localityIdx: 6, rating: 4.9, reviews: 68, price: 2999, exp: 5 },
      { name: 'BugShield Pest Control Lucknow', cat: 'pest-control', city: 'Lucknow', localityIdx: 1, rating: 4.8, reviews: 140, price: 899, exp: 7 },
      { name: 'AquaPure Filter Experts', cat: 'ro-water-purifier', city: 'Lucknow', localityIdx: 6, rating: 4.7, reviews: 178, price: 499, exp: 9 },
      { name: 'SuperFoam Car Wash Gomti Nagar', cat: 'car-wash-detailing', city: 'Lucknow', localityIdx: 0, rating: 4.9, reviews: 195, price: 399, exp: 3 },
      { name: 'FitNawab Yoga Instructor', cat: 'fitness-yoga', city: 'Lucknow', localityIdx: 2, rating: 4.9, reviews: 88, price: 900, exp: 6 },
      { name: 'Metro Express Packers Lucknow', cat: 'packers-movers', city: 'Lucknow', localityIdx: 8, rating: 4.6, reviews: 110, price: 2200, exp: 11 },
      { name: 'Candid Awadh Photography', cat: 'event-photography', city: 'Lucknow', localityIdx: 0, rating: 4.9, reviews: 125, price: 8500, exp: 8 },
      { name: 'Chic Touch Hair & Makeup', cat: 'makeup-artist', city: 'Lucknow', localityIdx: 3, rating: 4.8, reviews: 190, price: 3499, exp: 7 },
      { name: 'GreenSun Solar Solutions', cat: 'solar-panel', city: 'Lucknow', localityIdx: 1, rating: 4.7, reviews: 38, price: 135000, exp: 5 }
    ];

    // Add 80 NCR & Other Regional Providers
    const ncrNamesSeed = [
      'Rahul Electricals', 'Amit Plumbing Noida', 'Sanjay AC Care Delhi', 'Priya Salon Gurgaon', 'Deepak Pest Control Ghaziabad',
      'Rohan Carpenter Gr Noida', 'Vikas Auto Noida', 'Manish Painters Delhi', 'Ramesh Water Filter Gurgaon', 'CleanSquad Noida',
      'Gaurav Mechanic Delhi', 'Neha Tutor Gurgaon', 'Satish Fix Ghaziabad', 'Woodland Crafts Noida', 'Perfect Colors Delhi',
      'Anand Tech Gurgaon', 'Sunil Plumbing Noida', 'Pooja Makeup Delhi', 'Vikram Solar Gurgaon', 'Tarun Cameras Ghaziabad',
      'Neeraj Packers Noida', 'Shruti Yoga Delhi', 'Rajiv Repair Gurgaon', 'Nitin Pest Control Noida', 'Arjun Detailing Delhi',
      'Bhavna Salon Gurgaon', 'Chetan Tutors Noida', 'Dinesh Electricals Delhi', 'Ekta Beauty Gurgaon', 'Farhan AC Care Noida',
      'Girish Plumber Delhi', 'Himanshu Auto Gurgaon', 'Isha Studio Noida', 'Jitin Services Delhi', 'Kavita Clean Gurgaon',
      'Lokesh Tech Noida', 'Mayank Solar Delhi', 'Nisha Spa Gurgaon', 'Om Prakash Plumber Noida', 'Pradeep RO Delhi',
      'Qasim Repair Gurgaon', 'Ritu Tutors Noida', 'Sachin Movers Delhi', 'Trupti Beauty Gurgaon', 'Umesh Paint Noida',
      'Varun CCTV Delhi', 'Yash Mobile Gurgaon', 'Zubair Plumbing Noida', 'Abhay Electric Delhi', 'Bala Carpentry Gurgaon',
      'Chandan AC Care Noida', 'Divya Hair Studio Delhi', 'Eshwar Auto Gurgaon', 'Geeta Fitness Noida', 'Hemant Pest Delhi',
      'Inder Water Gurgaon', 'Jaya Photo Noida', 'Kapil Tech Delhi', 'Lata Salon Gurgaon', 'Mohit Solar Noida',
      'Naveen Movers Delhi', 'Ojas Tutors Gurgaon', 'Preeti Makeup Noida', 'Rakesh Plumber Delhi', 'Suraj AC Gurgaon',
      'Tanvi Spa Noida', 'Upendra Electric Delhi', 'Vineet Auto Gurgaon', 'Yogesh Cleaners Noida', 'Aarti Tutor Delhi',
      'Bhavesh Repair Gurgaon', 'Charu Beauty Noida', 'Dhiraj Solar Delhi', 'Gautam Packers Gurgaon', 'Ishita Photo Noida',
      'Jagdish Pest Delhi', 'Kiran RO Gurgaon', 'Lalit Detailing Noida', 'Monika Salon Delhi', 'Nandan Paint Gurgaon'
    ];

    ncrNamesSeed.forEach((name, idx) => {
      const cityObj = ncrCities[idx % ncrCities.length];
      const catSlug = categorySlugsList[idx % categorySlugsList.length];
      providerNames.push({
        name: name,
        cat: catSlug,
        city: cityObj.city,
        state: cityObj.state,
        lat: cityObj.lat + (Math.sin(idx) * 0.04),
        lng: cityObj.lng + (Math.cos(idx) * 0.04),
        rating: Math.round((4.2 + (idx % 8) * 0.1) * 10) / 10,
        reviews: 25 + (idx * 11) % 250,
        price: 199 + (idx % 10) * 100,
        exp: 3 + (idx % 12)
      });
    });

    let createdProviders = [];

    for (let i = 0; i < providerNames.length; i++) {
      const item = providerNames[i];
      let pLat, pLng, pCity, pState, pAddress;

      if (item.city === 'Lucknow') {
        const loc = lucknowLocalities[item.localityIdx !== undefined ? item.localityIdx : (i % lucknowLocalities.length)];
        const offsetLat = (Math.sin(i * 1.7) * 0.012);
        const offsetLng = (Math.cos(i * 1.7) * 0.012);
        pLat = loc.lat + offsetLat;
        pLng = loc.lng + offsetLng;
        pCity = 'Lucknow';
        pState = 'Uttar Pradesh';
        pAddress = `${loc.locality}, Lucknow, Uttar Pradesh`;
      } else {
        pLat = item.lat;
        pLng = item.lng;
        pCity = item.city;
        pState = item.state || 'Uttar Pradesh';
        pAddress = `Sector ${10 + (i % 50)}, ${pCity}, ${pState}`;
      }

      const catObjId = catMap[item.cat] || createdCategories[0]._id;
      const catObj = categoriesData.find(c => c.slug === item.cat) || categoriesData[0];

      const user = await User.create({
        name: item.name.split(' ')[0] + ' ' + (item.name.split(' ')[1] || 'Pro'),
        email: `provider_${i + 1}@localservice.com`,
        password: 'provider123',
        phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: 'provider',
        profileImage: `https://i.pravatar.cc/300?img=${(i % 70) + 1}`
      });

      const provider = await Provider.create({
        user: user._id,
        businessName: item.name,
        description: `Top-rated professional service provider in ${pCity} with over ${item.exp} years of verified experience. Specializing in high-quality doorstep ${catObj.name.toLowerCase()}.`,
        category: catObjId,
        servicesOffered: [
          { name: `Standard ${catObj.name}`, price: item.price, description: 'Diagnostic check and standard service.' },
          { name: `Premium Full Service`, price: item.price + 350, description: 'Comprehensive doorstep service package with extended warranty.' }
        ],
        experienceYears: item.exp,
        startingPrice: item.price,
        coverImage: catObj.image, // Strictly category-matched service cover image
        location: {
          type: 'Point',
          coordinates: [pLng, pLat],
          formattedAddress: pAddress,
          city: pCity,
          state: pState
        },
        serviceAreaRadiusKm: 25,
        workingHours: 'Mon-Sat: 8:00 AM - 9:00 PM',
        isAvailable: true,
        gallery: [
          catObj.image,
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600'
        ],
        verificationStatus: 'approved',
        isFeatured: (i % 4 === 0),
        rating: item.rating > 5 ? 5.0 : item.rating,
        reviewCount: item.reviews,
        totalJobsCompleted: item.reviews + 15
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
      businessName: 'Rahul Electrical & AC Services Lucknow',
      description: 'Master Electrician and AC repair technician serving Gomti Nagar, Hazratganj & all Lucknow areas. 8 years experience in commercial & domestic repairs.',
      category: catMap['electrical-services'],
      servicesOffered: [
        { name: 'Electrical Switchboard Fix', price: 199, description: 'Fix burnt wiring and switch sockets.' },
        { name: 'Ceiling Fan Installation', price: 149, description: 'Mounting and connection of ceiling fan.' },
        { name: 'AC Deep Foam Jet Cleaning', price: 499, description: 'High pressure foam wash for Split AC.' }
      ],
      experienceYears: 8,
      startingPrice: 199,
      coverImage: catImageMap['electrical-services'],
      location: {
        type: 'Point',
        coordinates: [81.0450, 26.8950],
        formattedAddress: 'Gomti Nagar, Lucknow, Uttar Pradesh',
        city: 'Lucknow',
        state: 'Uttar Pradesh'
      },
      serviceAreaRadiusKm: 25,
      workingHours: 'Mon-Sat: 9:00 AM - 8:00 PM',
      isAvailable: true,
      gallery: [
        catImageMap['electrical-services']
      ],
      verificationStatus: 'approved',
      isFeatured: true,
      rating: 4.9,
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
        street: 'Flat 402, Block B, Riverside Apartments, Gomti Nagar',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        pincode: '226010',
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
      comment: 'Rahul arrived right on time, had all professional tools, and installed both fans very neatly within 45 minutes! Highly recommended in Gomti Nagar.',
      images: [catImageMap['electrical-services']]
    });

    console.log('✅ Database Seeding Completed Successfully with Topic-Accurate Image Mapping!');
    console.log(`📊 Total Seeded: ${createdCategories.length} Categories, ${servicesData.length} Services, ${createdProviders.length + 1} Providers (${providerNames.filter(p => p.city === 'Lucknow').length + 1} in Lucknow).`);
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
