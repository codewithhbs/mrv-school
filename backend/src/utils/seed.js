// One-time seed script: creates the initial superadmin account and default
// school settings document. Run with: npm run seed
// IMPORTANT: change SEED_SUPERADMIN_PASSWORD in .env before running, and
// remove/rotate those env vars after the first successful run.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const SchoolSettings = require('../models/SchoolSettings');

(async () => {
  await connectDB();

  const email = (process.env.SEED_SUPERADMIN_EMAIL || '').toLowerCase();
  const password = process.env.SEED_SUPERADMIN_PASSWORD;

  if (!email || !password) {
    console.error('[seed] SEED_SUPERADMIN_EMAIL and SEED_SUPERADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }
  if (password.length < 12) {
    console.error('[seed] SEED_SUPERADMIN_PASSWORD must be at least 12 characters');
    process.exit(1);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`[seed] Superadmin already exists: ${email}`);
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({ name: 'Super Admin', email, passwordHash, role: 'superadmin' });
    console.log(`[seed] Superadmin created: ${email}`);
  }

  const settings = await SchoolSettings.findOne({ key: 'singleton' });
  if (!settings) {
    await SchoolSettings.create({
      key: 'singleton',
      schoolName: 'M.R. Vivekananda Public School',
      tagline: 'Where curiosity becomes character.',
      board: 'CBSE',
      address: 'New Mahavir Nagar, Vikaspuri (East), Tilak Nagar, New Delhi',
      phones: ['011-25993692', '+91-9971390224'],
      emails: ['info@mrvps.org'],
      officeHours: '8:00 AM – 3:00 PM, Mon–Sat',
      mapEmbedUrl:
        'https://maps.google.com/maps?q=MRV%20Public%20School%2C%20New%20Mahavir%20Nagar%2C%20Vikaspuri%20%28East%29%2C%20New%20Mahavir%20Nagar%2C%20Tilak%20Nagar%2C%20Delhi&t=m&z=14&output=embed&iwloc=near',
      socialLinks: {
        facebook: 'https://www.facebook.com/mrvpublicschool',
        instagram: 'https://www.instagram.com/mrvpublicschool/',
        youtube: 'https://www.youtube.com/channel/UCy7fs-gH4PR5EUsDxoUJovg',
      },
      seoDefaultTitle: 'M.R. Vivekananda Public School — CBSE, New Delhi',
      seoDefaultDescription:
        'MRVPS is a CBSE-affiliated school in West Delhi focused on child-centric, technology-enabled learning from Pre-Primary to Senior Secondary.',
      footerText: 'A CBSE-affiliated institution dedicated to academic excellence, values, and holistic growth.',
    });
    console.log('[seed] Default school settings created (with real MRVPS contact details — edit in admin panel as needed)');
  }

  console.log('[seed] Done. Remove SEED_SUPERADMIN_PASSWORD from .env now.');

  // Demo data so the parent/student portal can be exercised end-to-end
  // without manually creating records first. Safe to delete once real
  // student data is entered.
  const Student = require('../models/Student');
  const PortalAccount = require('../models/PortalAccount');

  let demoStudent = await Student.findOne({ admissionNo: 'DEMO-0001' });
  if (!demoStudent) {
    demoStudent = await Student.create({
      admissionNo: 'DEMO-0001',
      name: 'Aarav Sharma',
      class: '6',
      section: 'A',
      rollNo: '12',
      gender: 'male',
      isActive: true,
    });
    console.log('[seed] Demo student created: Aarav Sharma (Class 6-A, admission no DEMO-0001)');
  }

  const demoParentEmail = 'demo.parent@mrvps.org';
  let demoParent = await PortalAccount.findOne({ email: demoParentEmail });
  if (!demoParent) {
    const demoPasswordHash = await bcrypt.hash('DemoParent#2026', 12);
    demoParent = await PortalAccount.create({
      role: 'parent',
      name: 'Demo Parent',
      email: demoParentEmail,
      passwordHash: demoPasswordHash,
      students: [demoStudent._id],
      mustChangePassword: false,
    });
    console.log(`[seed] Demo parent portal login created: ${demoParentEmail} / DemoParent#2026 (delete this account before going live)`);
  }

  const demoStudentEmail = 'demo.student@mrvps.org';
  let demoStudentAccount = await PortalAccount.findOne({ email: demoStudentEmail });
  if (!demoStudentAccount) {
    const demoStudentPasswordHash = await bcrypt.hash('DemoStudent#2026', 12);
    demoStudentAccount = await PortalAccount.create({
      role: 'student',
      name: demoStudent.name,
      email: demoStudentEmail,
      passwordHash: demoStudentPasswordHash,
      students: [demoStudent._id], // student accounts link to exactly one Student
      mustChangePassword: false,
    });
    console.log(`[seed] Demo student portal login created: ${demoStudentEmail} / DemoStudent#2026 (delete this account before going live)`);
  }
  process.exit(0);
})().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
