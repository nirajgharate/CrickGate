/**
 * TurfGate Database Seeder
 * Creates 10 owner accounts + their turfs + business profiles in MongoDB
 *
 * Run:  node seed.js
 * Requires: mongoose, bcryptjs (already installed in the project)
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// ─── INLINE MODELS (so we don't need to import from ESM files) ───────────────

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true },
  password:    { type: String, required: true },
  fullName:    { type: String },
  address:     { type: String },
  favoriteSport: { type: String },
  phone:       { type: Number },
  dob:         { type: Date },
  totalBookings: { type: Number, default: 15 },
  loyaltyPoints: { type: Number, default: 1200 },
  role:        { type: String, enum: ['player', 'admin'], default: 'player' }
});

const turfSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  location:   { type: String, required: true },
  price:      { type: String, required: true },
  rating:     { type: Number, default: 4.5 },
  image:      { type: String, required: true },
  Area:       { type: String, trim: true },
  facilities: { type: [String], default: [] },
  ownerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  latitude:   { type: Number, default: 20.00 },
  longitude:  { type: Number, default: 73.78 }
}, { timestamps: true });

const businessProfileSchema = new mongoose.Schema({
  ownerId:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName:       { type: String, required: true, trim: true },
  gstNumber:         { type: String, trim: true, default: '' },
  contactEmail:      { type: String, required: true, trim: true },
  contactPhone:      { type: String, required: true, trim: true },
  address:           { type: String, trim: true, default: '' },
  bankName:          { type: String, trim: true, default: '' },
  accountHolderName: { type: String, trim: true, default: '' },
  accountNumber:     { type: String, trim: true, default: '' },
  ifscCode:          { type: String, trim: true, default: '' },
  upiId:             { type: String, trim: true, default: '' },
  latitude:          { type: Number, default: 20.00 },
  longitude:         { type: Number, default: 73.78 }
}, { timestamps: true });

const User            = mongoose.model('User',            userSchema);
const Turf            = mongoose.model('Turf',            turfSchema);
const BusinessProfile = mongoose.model('BusinessProfile', businessProfileSchema);

// ─── SEED DATA ────────────────────────────────────────────────────────────────

const PLAIN_PASSWORD = 'Owner@1234'; // Same password for all owners — easy to remember

const ownersData = [
  {
    owner: {
      name:     'Arjun Mehta',
      email:    'arjun.mehta@turfgate.com',
      phone:    9876540001,
      fullName: 'Arjun Mehta',
      address:  'Gangapur Road, Nashik',
      role:     'admin',
    },
    business: {
      companyName:       'Mehta Sports Arena Pvt. Ltd.',
      gstNumber:         '27AABCM1234A1Z5',
      contactEmail:      'arjun.mehta@turfgate.com',
      contactPhone:      '9876540001',
      address:           'Plot No. 14, Gangapur Road, Nashik – 422013',
      bankName:          'HDFC Bank',
      accountHolderName: 'Arjun Mehta',
      accountNumber:     '50100123456701',
      ifscCode:          'HDFC0001234',
      upiId:             'arjun.mehta@ybl',
      latitude:          20.0063,
      longitude:         73.7895
    },
    turfs: [
      {
        name:       'Battle Ground Arena',
        location:   'Gangapur Road, Nashik',
        price:      '₹1,200 per hr',
        rating:     4.9,
        image:      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&q=80&fit=crop',
        Area:       '8000 sq ft',
        facilities: ['Floodlights', 'Parking', 'Changing Rooms', 'Cafeteria', 'First Aid'],
        latitude:   20.0063,
        longitude:  73.7895
      },
      {
        name:       'Mehta Cricket Cage',
        location:   'Gangapur Road, Nashik',
        price:      '₹900 per hr',
        rating:     4.7,
        image:      'https://images.unsplash.com/photo-1607734834519-d8576ae60ea6?w=1000&q=80&fit=crop',
        Area:       '5000 sq ft',
        facilities: ['Floodlights', 'Bowling Machine', 'Scoreboard', 'Seating Area'],
        latitude:   20.0070,
        longitude:  73.7900
      }
    ]
  },
  {
    owner: {
      name:     'Priya Shinde',
      email:    'priya.shinde@turfgate.com',
      phone:    9876540002,
      fullName: 'Priya Shinde',
      address:  'College Road, Nashik',
      role:     'admin',
    },
    business: {
      companyName:       'Shinde Sports Complex',
      gstNumber:         '27AABCS5678B2Z1',
      contactEmail:      'priya.shinde@turfgate.com',
      contactPhone:      '9876540002',
      address:           'Survey No. 42, College Road, Nashik – 422005',
      bankName:          'SBI Bank',
      accountHolderName: 'Priya Shinde',
      accountNumber:     '35782901234567',
      ifscCode:          'SBIN0001234',
      upiId:             'priya.shinde@sbi',
      latitude:          19.9975,
      longitude:         73.7898
    },
    turfs: [
      {
        name:       'Victory Football Ground',
        location:   'College Road, Nashik',
        price:      '₹1,000 per hr',
        rating:     4.8,
        image:      'https://images.unsplash.com/photo-1556056504-517cf0154fb4?w=1000&q=80&fit=crop',
        Area:       '7200 sq ft',
        facilities: ['Floodlights', 'Parking', 'Locker Room', 'Water Dispenser'],
        latitude:   19.9975,
        longitude:  73.7898
      },
      {
        name:       'Shinde Basketball Court',
        location:   'College Road, Nashik',
        price:      '₹700 per hr',
        rating:     4.6,
        image:      'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=1000&q=80&fit=crop',
        Area:       '4200 sq ft',
        facilities: ['Floodlights', 'Scoreboards', 'Benches', 'Washrooms'],
        latitude:   19.9980,
        longitude:  73.7905
      }
    ]
  },
  {
    owner: {
      name:     'Rahul Deshmukh',
      email:    'rahul.deshmukh@turfgate.com',
      phone:    9876540003,
      fullName: 'Rahul Deshmukh',
      address:  'Dwarka Circle, Nashik',
      role:     'admin',
    },
    business: {
      companyName:       'Deshmukh Arena Group',
      gstNumber:         '27AABCD2345C3Z9',
      contactEmail:      'rahul.deshmukh@turfgate.com',
      contactPhone:      '9876540003',
      address:           'Building 7, Dwarka Circle, Nashik – 422011',
      bankName:          'ICICI Bank',
      accountHolderName: 'Rahul Deshmukh',
      accountNumber:     '062305001234567',
      ifscCode:          'ICIC0000623',
      upiId:             'rahul.deshmukh@icici',
      latitude:          20.0130,
      longitude:         73.7830
    },
    turfs: [
      {
        name:       'Cover Drive Pitch',
        location:   'Dwarka Circle, Nashik',
        price:      '₹950 per hr',
        rating:     4.9,
        image:      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1000&q=80&fit=crop',
        Area:       '6000 sq ft',
        facilities: ['Floodlights', 'Bowling Machines', 'Covered Gallery', 'Cafeteria'],
        latitude:   20.0130,
        longitude:  73.7830
      }
    ]
  },
  {
    owner: {
      name:     'Sanjay Kulkarni',
      email:    'sanjay.kulkarni@turfgate.com',
      phone:    9876540004,
      fullName: 'Sanjay Kulkarni',
      address:  'Panchavati, Nashik',
      role:     'admin',
    },
    business: {
      companyName:       'Kulkarni Sports Zone',
      gstNumber:         '27AABCK7890D4Z3',
      contactEmail:      'sanjay.kulkarni@turfgate.com',
      contactPhone:      '9876540004',
      address:           '12/B Panchavati, Nashik – 422003',
      bankName:          'Kotak Bank',
      accountHolderName: 'Sanjay Kulkarni',
      accountNumber:     '0012345678901',
      ifscCode:          'KKBK0001234',
      upiId:             'sanjay@kotak',
      latitude:          20.0025,
      longitude:         73.7821
    },
    turfs: [
      {
        name:       'Panchavati Premier Turf',
        location:   'Panchavati, Nashik',
        price:      '₹1,100 per hr',
        rating:     4.8,
        image:      'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=1000&q=80&fit=crop',
        Area:       '7000 sq ft',
        facilities: ['Floodlights', 'CCTV', 'Parking', 'Restrooms', 'Snack Bar'],
        latitude:   20.0025,
        longitude:  73.7821
      },
      {
        name:       'Kulkarni Tennis Arena',
        location:   'Panchavati, Nashik',
        price:      '₹600 per hr',
        rating:     4.5,
        image:      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=1000&q=80&fit=crop',
        Area:       '3500 sq ft',
        facilities: ['Floodlights', 'Court Surface Maintenance', 'Seating Area'],
        latitude:   20.0030,
        longitude:  73.7828
      }
    ]
  },
  {
    owner: {
      name:     'Anita Patil',
      email:    'anita.patil@turfgate.com',
      phone:    9876540005,
      fullName: 'Anita Patil',
      address:  'Nashik Road, Nashik',
      role:     'admin',
    },
    business: {
      companyName:       'Patil Sports Hub',
      gstNumber:         '27AABCP3456E5Z7',
      contactEmail:      'anita.patil@turfgate.com',
      contactPhone:      '9876540005',
      address:           'Plot 23, Nashik Road, Nashik – 422101',
      bankName:          'Axis Bank',
      accountHolderName: 'Anita Patil',
      accountNumber:     '9140123456789',
      ifscCode:          'UTIB0001234',
      upiId:             'anita.patil@axl',
      latitude:          19.9836,
      longitude:         73.8143
    },
    turfs: [
      {
        name:       'Victory Court',
        location:   'Nashik Road, Nashik',
        price:      '₹800 per hr',
        rating:     4.7,
        image:      'https://images.unsplash.com/photo-1505666287802-931dc83948e9?w=1000&q=80&fit=crop',
        Area:       '5500 sq ft',
        facilities: ['Floodlights', 'Locker Room', 'Refreshments', 'Parking'],
        latitude:   19.9836,
        longitude:  73.8143
      }
    ]
  },
  {
    owner: {
      name:     'Vikram Jagtap',
      email:    'vikram.jagtap@turfgate.com',
      phone:    9876540006,
      fullName: 'Vikram Jagtap',
      address:  'Satpur, Nashik',
      role:     'admin',
    },
    business: {
      companyName:       'Jagtap Sporting Solutions',
      gstNumber:         '27AABCJ4567F6Z2',
      contactEmail:      'vikram.jagtap@turfgate.com',
      contactPhone:      '9876540006',
      address:           'MIDC Road, Satpur, Nashik – 422007',
      bankName:          'Bank of Maharashtra',
      accountHolderName: 'Vikram Jagtap',
      accountNumber:     '60012345678901',
      ifscCode:          'MAHB0001234',
      upiId:             'vikram.jagtap@bom',
      latitude:          19.9987,
      longitude:         73.7560
    },
    turfs: [
      {
        name:       'Satpur Sports Complex',
        location:   'Satpur, Nashik',
        price:      '₹900 per hr',
        rating:     4.6,
        image:      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1000&q=80&fit=crop',
        Area:       '9000 sq ft',
        facilities: ['Floodlights', 'Multiple Sports Grounds', 'Cafeteria', 'Parking', 'Medical Room'],
        latitude:   19.9987,
        longitude:  73.7560
      },
      {
        name:       'Jagtap Cricket Hub',
        location:   'Satpur, Nashik',
        price:      '₹850 per hr',
        rating:     4.5,
        image:      'https://images.unsplash.com/photo-1540747737956-37872f84a62f?w=1000&q=80&fit=crop',
        Area:       '6500 sq ft',
        facilities: ['Floodlights', 'Bowling Machine', 'Pitch Covers', 'Seating'],
        latitude:   19.9995,
        longitude:  73.7568
      }
    ]
  },
  {
    owner: {
      name:     'Deepak Bhosale',
      email:    'deepak.bhosale@turfgate.com',
      phone:    9876540007,
      fullName: 'Deepak Bhosale',
      address:  'Cidco, Nashik',
      role:     'admin',
    },
    business: {
      companyName:       'Bhosale Arena & Events',
      gstNumber:         '27AABCB5678G7Z8',
      contactEmail:      'deepak.bhosale@turfgate.com',
      contactPhone:      '9876540007',
      address:           'Sector 24, Cidco, Nashik – 422009',
      bankName:          'Punjab National Bank',
      accountHolderName: 'Deepak Bhosale',
      accountNumber:     '1234500000012345',
      ifscCode:          'PUNB0123450',
      upiId:             'deepak.bhosale@pnb',
      latitude:          20.0220,
      longitude:         73.7649
    },
    turfs: [
      {
        name:       'Cidco Football Arena',
        location:   'Cidco, Nashik',
        price:      '₹1,050 per hr',
        rating:     4.8,
        image:      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1000&q=80&fit=crop',
        Area:       '8500 sq ft',
        facilities: ['Floodlights', 'VIP Gallery', 'Parking', 'Canteen', 'Changing Rooms'],
        latitude:   20.0220,
        longitude:  73.7649
      }
    ]
  },
  {
    owner: {
      name:     'Kavita More',
      email:    'kavita.more@turfgate.com',
      phone:    9876540008,
      fullName: 'Kavita More',
      address:  'Mahatma Nagar, Nashik',
      role:     'admin',
    },
    business: {
      companyName:       'More Sports Academy',
      gstNumber:         '27AABCM6789H8Z4',
      contactEmail:      'kavita.more@turfgate.com',
      contactPhone:      '9876540008',
      address:           '56, Mahatma Nagar, Nashik – 422006',
      bankName:          'Union Bank',
      accountHolderName: 'Kavita More',
      accountNumber:     '071001234567890',
      ifscCode:          'UBIN0567101',
      upiId:             'kavita.more@upi',
      latitude:          20.0058,
      longitude:         73.7912
    },
    turfs: [
      {
        name:       'More Badminton & Sports Center',
        location:   'Mahatma Nagar, Nashik',
        price:      '₹500 per hr',
        rating:     4.7,
        image:      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1000&q=80&fit=crop',
        Area:       '4000 sq ft',
        facilities: ['Floodlights', 'Shuttle Service', 'Pro Shop', 'Changing Rooms'],
        latitude:   20.0058,
        longitude:  73.7912
      },
      {
        name:       'Academy Football Turf',
        location:   'Mahatma Nagar, Nashik',
        price:      '₹950 per hr',
        rating:     4.6,
        image:      'https://images.unsplash.com/photo-1489945052260-4f21c52268b9?w=1000&q=80&fit=crop',
        Area:       '6800 sq ft',
        facilities: ['Floodlights', 'Coaching Available', 'Parking', 'Water Station'],
        latitude:   20.0065,
        longitude:  73.7918
      }
    ]
  },
  {
    owner: {
      name:     'Suresh Kale',
      email:    'suresh.kale@turfgate.com',
      phone:    9876540009,
      fullName: 'Suresh Kale',
      address:  'Ambad, Nashik',
      role:     'admin',
    },
    business: {
      companyName:       'Kale Sports Infrastructure',
      gstNumber:         '27AABCK7890I9Z6',
      contactEmail:      'suresh.kale@turfgate.com',
      contactPhone:      '9876540009',
      address:           'K-12, Industrial Estate, Ambad, Nashik – 422010',
      bankName:          'Canara Bank',
      accountHolderName: 'Suresh Kale',
      accountNumber:     '0268101234567',
      ifscCode:          'CNRB0000268',
      upiId:             'suresh.kale@cnrb',
      latitude:          19.9862,
      longitude:         73.7423
    },
    turfs: [
      {
        name:       'Ambad Multi-Sport Arena',
        location:   'Ambad, Nashik',
        price:      '₹1,150 per hr',
        rating:     4.9,
        image:      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1000&q=80&fit=crop',
        Area:       '10000 sq ft',
        facilities: ['Floodlights', 'Electronic Scoreboard', 'VIP Lounge', 'Parking', 'Cafeteria', 'Indoor Hall'],
        latitude:   19.9862,
        longitude:  73.7423
      }
    ]
  },
  {
    owner: {
      name:     'Neha Wagh',
      email:    'neha.wagh@turfgate.com',
      phone:    9876540010,
      fullName: 'Neha Wagh',
      address:  'Trimbak Road, Nashik',
      role:     'admin',
    },
    business: {
      companyName:       'Wagh Premier Grounds',
      gstNumber:         '27AABCW8901J0Z0',
      contactEmail:      'neha.wagh@turfgate.com',
      contactPhone:      '9876540010',
      address:           'Survey 8, Trimbak Road, Nashik – 422002',
      bankName:          'HDFC Bank',
      accountHolderName: 'Neha Wagh',
      accountNumber:     '50100987654321',
      ifscCode:          'HDFC0005678',
      upiId:             'neha.wagh@ybl',
      latitude:          20.0198,
      longitude:         73.7680
    },
    turfs: [
      {
        name:       'Trimbak Road Cricket Academy',
        location:   'Trimbak Road, Nashik',
        price:      '₹1,000 per hr',
        rating:     4.8,
        image:      'https://images.unsplash.com/photo-1607734834519-d8576ae60ea6?w=1000&q=80&fit=crop',
        Area:       '7500 sq ft',
        facilities: ['Floodlights', 'Bowling Machines', 'Practice Nets', 'Coaching Sessions', 'Cafeteria'],
        latitude:   20.0198,
        longitude:  73.7680
      },
      {
        name:       'Wagh Football Pitch',
        location:   'Trimbak Road, Nashik',
        price:      '₹900 per hr',
        rating:     4.7,
        image:      'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=1000&q=80&fit=crop',
        Area:       '6200 sq ft',
        facilities: ['Floodlights', 'Goal Posts', 'Parking', 'First Aid', 'Water Cooler'],
        latitude:   20.0205,
        longitude:  73.7688
      }
    ]
  }
];

// ─── MAIN SEED FUNCTION ───────────────────────────────────────────────────────

async function seed() {
  const dbUrl = process.env.TURFGATE_DB_URL || process.env.CRICKSLOT_DB_URL;

  console.log('\n🌱 TurfGate Database Seeder starting...');
  console.log('📡 Connecting to MongoDB Atlas...\n');

  await mongoose.connect(dbUrl);
  console.log('✅ Connected to MongoDB Atlas!\n');

  const hashedPassword = await bcrypt.hash(PLAIN_PASSWORD, 12);

  const results = [];

  for (const entry of ownersData) {
    const { owner, business, turfs } = entry;

    // ── 1. Create User (owner) ──
    let userDoc = await User.findOne({ email: owner.email });

    if (userDoc) {
      console.log(`⚠️  Owner already exists: ${owner.email} — skipping user creation`);
    } else {
      userDoc = await User.create({
        ...owner,
        password: hashedPassword,
        totalBookings: Math.floor(Math.random() * 80) + 50,
        loyaltyPoints: Math.floor(Math.random() * 5000) + 2000
      });
      console.log(`👤 Created owner: ${owner.name} (${owner.email})`);
    }

    // ── 2. Create Business Profile ──
    const existingBiz = await BusinessProfile.findOne({ ownerId: userDoc._id });
    if (!existingBiz) {
      await BusinessProfile.create({
        ...business,
        ownerId: userDoc._id
      });
      console.log(`🏢 Business profile created: ${business.companyName}`);
    } else {
      console.log(`⚠️  Business profile already exists for ${owner.name}`);
    }

    // ── 3. Create Turfs ──
    const turfResults = [];
    for (const turf of turfs) {
      const existingTurf = await Turf.findOne({ name: turf.name, ownerId: userDoc._id });
      if (!existingTurf) {
        const turfDoc = await Turf.create({ ...turf, ownerId: userDoc._id });
        console.log(`🏟️  Turf created: ${turf.name}`);
        turfResults.push({ name: turfDoc.name, id: turfDoc._id.toString(), price: turfDoc.price, location: turfDoc.location });
      } else {
        console.log(`⚠️  Turf already exists: ${turf.name}`);
        turfResults.push({ name: existingTurf.name, id: existingTurf._id.toString(), price: existingTurf.price, location: existingTurf.location });
      }
    }

    results.push({
      ownerName:    owner.name,
      email:        owner.email,
      password:     PLAIN_PASSWORD,
      phone:        owner.phone,
      userId:       userDoc._id.toString(),
      companyName:  business.companyName,
      location:     business.address,
      turfs:        turfResults
    });

    console.log('');
  }

  // ─── PRINT SUMMARY TABLE ────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(80));
  console.log('                      ✅  SEED COMPLETE — CREDENTIALS SUMMARY');
  console.log('═'.repeat(80));
  console.log(`\n  📧 All owners share the same password: "${PLAIN_PASSWORD}"\n`);
  console.log('─'.repeat(80));

  results.forEach((r, i) => {
    console.log(`\n  ${i + 1}. ${r.ownerName}  |  ${r.companyName}`);
    console.log(`     📧 Email:    ${r.email}`);
    console.log(`     🔑 Password: ${r.password}`);
    console.log(`     📞 Phone:    ${r.phone}`);
    console.log(`     🆔 User ID:  ${r.userId}`);
    console.log(`     📍 Location: ${r.location}`);
    console.log(`     🏟️  Turfs:`);
    r.turfs.forEach(t => {
      console.log(`          • ${t.name}  |  ${t.price}  |  ID: ${t.id}`);
    });
  });

  console.log('\n' + '═'.repeat(80));
  console.log('  ✨ All data successfully inserted into MongoDB Atlas!');
  console.log('═'.repeat(80) + '\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
