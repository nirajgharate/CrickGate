import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/user.js';
import Owner from './models/owner.js';
import Turf from './models/turf.js';
import Booking from './models/booking.js';
import Review from './models/review.js';

dotenv.config();

const dbUrl = process.env.TURFGATE_DB_URL || process.env.CRICKSLOT_DB_URL;

async function seedBookings() {
  console.log('⚡ Connecting to database at ' + dbUrl.split('@')[1] + '...');
  await mongoose.connect(dbUrl);
  console.log('✅ Connected to MongoDB!\n');

  // 1. Create or Find Player Users
  console.log('👥 Seeding Player Users...');
  const playerPassword = await bcrypt.hash('Player@1234', 12);
  
  const playersData = [
    { name: 'Amit Sharma', email: 'amit.sharma@gmail.com', password: playerPassword, phone: 9823456781 },
    { name: 'Vicky Patil', email: 'vicky.patil@gmail.com', password: playerPassword, phone: 9934567822 },
    { name: 'Shreya Joshi', email: 'shreya.joshi@gmail.com', password: playerPassword, phone: 9745678933 },
    { name: 'Rohan Deshpande', email: 'rohan.d@gmail.com', password: playerPassword, phone: 9812345678 }
  ];

  const playerDocs = [];
  for (const p of playersData) {
    let doc = await User.findOne({ email: p.email });
    if (!doc) {
      doc = await User.create(p);
      console.log(`   ➕ Player created: ${doc.name} (${doc.email})`);
    } else {
      console.log(`   ℹ️ Player already exists: ${doc.name}`);
    }
    playerDocs.push(doc);
  }
  console.log('');

  // 2. Fetch Listed Turfs
  console.log('🏟️  Retrieving listed turfs...');
  const turfs = await Turf.find({});
  if (turfs.length === 0) {
    console.log('❌ No turfs found in database! Please run seed_owners.js first.');
    await mongoose.disconnect();
    return;
  }
  console.log(`   Found ${turfs.length} turf(s).\n`);

  // Clear existing bookings & reviews to prevent duplicates
  console.log('🗑️  Clearing existing bookings and reviews...');
  await Booking.deleteMany({});
  await Review.deleteMany({});
  console.log('   Cleared successfully.\n');

  // 3. Generate bookings
  console.log('📅 Seeding bookings across June 2026...');
  
  // We want to create bookings for today (22 Jun), past (19-21 Jun) and future (23-26 Jun)
  const timeSlots = ['6:00 AM', '8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];
  const paymentMethods = ['card', 'gpay', 'bank'];

  // Helper to get Date object for dynamic createdAt matching
  const getJune2026Date = (dayNum, hour = 12) => {
    // Current year is 2026
    return new Date(2026, 5, dayNum, hour, 0, 0); // Month is 0-indexed (5 = June)
  };

  const bookingSeeds = [];

  // Helper function to parsed turf price (e.g. "₹900 per hr" -> 900)
  const parsePrice = (priceStr) => {
    const num = priceStr.replace(/[^0-9]/g, '');
    return num ? Number(num) : 900;
  };

  // Loop through turfs and distribute bookings
  let bookingCount = 0;
  for (let i = 0; i < turfs.length; i++) {
    const turf = turfs[i];
    const priceVal = parsePrice(turf.price);
    
    // Assign 3-4 bookings to each turf on different days
    const days = [19, 20, 21, 22, 23, 24, 25]; // June dates
    
    days.forEach((day, dIdx) => {
      // Create bookings with some random chance
      if ((i + dIdx) % 2 === 0) {
        const player = playerDocs[(i + dIdx) % playerDocs.length];
        const slot = timeSlots[(dIdx * 2) % timeSlots.length];
        const payMethod = paymentMethods[dIdx % paymentMethods.length];
        const createdDate = getJune2026Date(day, 10 + (dIdx % 6));

        bookingSeeds.push({
          turfId: turf._id,
          userId: player._id,
          date: `${day} Jun`, // matches formatting "DD MMM"
          timeSlot: slot,
          price: priceVal,
          status: 'completed', // we set Completed for all for calculation simplicity
          paymentMethod: payMethod,
          createdAt: createdDate,
          updatedAt: createdDate
        });
        bookingCount++;
      }
    });
  }

  // Insert bookings
  const insertedBookings = await Booking.insertMany(bookingSeeds);
  console.log(`   ✅ Seeded ${insertedBookings.length} booking records.`);

  // 4. Seed Reviews
  console.log('\n📝 Seeding verified reviews...');
  const reviewComments = [
    'Excellent quality turf grass. Floodlights were super bright and the cafeteria has great options!',
    'Perfect venue for cricket cage netting. Staff is friendly and washrooms were very clean.',
    'Amazing pitch bounce. Parking is extremely spacious and we had a great match here.',
    ' FIFA certified turf grass is really soft and safe for knees. Proper sports vibe.',
    'Best football arena in the city! Value for money is great. Safe boundary nets.'
  ];

  const reviewSeeds = [];
  // Add a few reviews for each turf
  for (let i = 0; i < turfs.length; i++) {
    const turf = turfs[i];
    
    // Let's add 2 reviews per turf
    for (let rIdx = 0; rIdx < 2; rIdx++) {
      const player = playerDocs[(i + rIdx) % playerDocs.length];
      const comment = reviewComments[(i + rIdx) % reviewComments.length];
      const rating = (i + rIdx) % 2 === 0 ? 5 : 4;
      const createdDate = getJune2026Date(20 + rIdx, 14);

      reviewSeeds.push({
        turfId: turf._id,
        userId: player._id,
        rating,
        comment,
        createdAt: createdDate,
        updatedAt: createdDate
      });
    }
  }

  const insertedReviews = await Review.insertMany(reviewSeeds);
  console.log(`   ✅ Seeded ${insertedReviews.length} review records.\n`);

  console.log('========================================================================');
  console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
  console.log('   All seeded owners now have real dynamic bookings and reviews');
  console.log('   distributed across June 2026!');
  console.log('========================================================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

seedBookings().catch(err => {
  console.error('❌ Seeding failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
