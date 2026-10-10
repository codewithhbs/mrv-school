// Full realistic demo-data seed. Run AFTER `npm run seed` (which creates the
// superadmin + settings). This script populates every collection with
// plausible content so the site, admin panel, and portal all look complete
// out of the box — good for demos, client walkthroughs, and local dev.
// It is idempotent: safe to run more than once, existing records are left
// alone (matched by a natural unique key per model) rather than duplicated.
//
// Run with: npm run seed:demo
//
// IMPORTANT: this is DEMO data — delete it before going live. Everything
// created here is clearly labelled (e.g. admission numbers starting
// "MRV26-", portal emails ending "@demo.mrvps.org") so it's easy to find
// and remove later.

require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const Banner = require('../models/Banner');
const Page = require('../models/Page');
const AcademicProgram = require('../models/AcademicProgram');
const Facility = require('../models/Facility');
const FacultyMember = require('../models/FacultyMember');
const NewsEvent = require('../models/NewsEvent');
const GalleryAlbum = require('../models/GalleryAlbum');
const Testimonial = require('../models/Testimonial');
const DownloadItem = require('../models/DownloadItem');
const CareerOpening = require('../models/CareerOpening');
const FAQ = require('../models/FAQ');
const FeeStructure = require('../models/FeeStructure');
const ScholarshipInfo = require('../models/ScholarshipInfo');
const AlumniStory = require('../models/AlumniStory');
const AdmissionEnquiry = require('../models/AdmissionEnquiry');
const ContactMessage = require('../models/ContactMessage');

const Student = require('../models/Student');
const PortalAccount = require('../models/PortalAccount');
const Attendance = require('../models/Attendance');
const Homework = require('../models/Homework');
const StudyMaterial = require('../models/StudyMaterial');
const ExamSchedule = require('../models/ExamSchedule');
const Result = require('../models/Result');
const PTMSchedule = require('../models/PTMSchedule');
const FeeRecord = require('../models/FeeRecord');

const log = (msg) => console.log(`[seed:demo] ${msg}`);

// upsertMany(Model, matchKeyFn, docs) — creates each doc only if a record
// matching its natural key doesn't already exist. Keeps the script safe to
// re-run without piling up duplicates.
async function upsertMany(Model, matchKeyFn, docs) {
  let created = 0;
  for (const doc of docs) {
    const key = matchKeyFn(doc);
    const exists = await Model.findOne(key);
    if (!exists) {
      await Model.create(doc);
      created++;
    }
  }
  log(`${Model.modelName}: ${created} created, ${docs.length - created} already existed`);
}

(async () => {
  await connectDB();
  log('Connected. Seeding realistic demo data...');

  // ---------------------------------------------------------------------
  // Website content
  // ---------------------------------------------------------------------

  await upsertMany(Banner, (d) => ({ title: d.title }), [
    {
      title: 'Admissions Open 2026–27',
      subtitle: 'Pre-Primary to Senior Secondary · CBSE Affiliated',
      imageUrl: '/images/banners/admission-open.jpg',
      imageUrl2: '/images/banners/campus-activity.jpg',
      imageUrl3: '/images/banners/classroom.jpg',
      ctaText: 'Apply Now',
      ctaLink: '/admission',
      order: 1,
      isActive: true,
    },
    {
      title: 'Where Curiosity Becomes Character',
      subtitle: 'Child-centric learning, modern technology, and strong values',
      imageUrl: '/images/banners/campus-life.jpg',
      imageUrl2: '/images/banners/smart-classroom.jpg',
      imageUrl3: '/images/banners/students-lab.jpg',
      ctaText: 'Explore Campus',
      ctaLink: '/facilities',
      order: 2,
      isActive: true,
    },
    {
      title: 'Annual Day 2026 Highlights',
      subtitle: 'A celebration of talent, teamwork, and tradition',
      imageUrl: '/images/banners/annual-day.jpg',
      imageUrl2: '/images/banners/annual-day-2.jpg',
      imageUrl3: '/images/banners/annual-day-3.jpg',
      ctaText: 'View Gallery',
      ctaLink: '/gallery',
      order: 3,
      isActive: true,
    },
  ]);

  // NOTE ON SLUGS: these must exactly match what each frontend page requests
  // via getPageBySlug() (see mrvps-frontend/app/about/*/page.js and
  // app/academics/*/page.js) — the frontend prefixes each slug with its
  // section, e.g. app/about/history/page.js calls getPageBySlug('about-history'),
  // not getPageBySlug('history'). Getting this wrong means the page silently
  // falls back to its placeholder text instead of showing seeded content.
  await upsertMany(Page, (d) => ({ slug: d.slug }), [
    {
      slug: 'about-vision-mission',
      group: 'about',
      title: 'Our Vision & Mission',
      subtitle: 'What drives everything we do',
      blocks: [
        { type: 'heading', data: { text: 'Our Vision' }, order: 0 },
        { type: 'paragraph', data: { text: 'To nurture confident, compassionate learners who think independently and contribute meaningfully to society.' }, order: 1 },
        { type: 'heading', data: { text: 'Our Mission' }, order: 2 },
        { type: 'list', data: { items: [
          'Deliver a child-centric curriculum that balances academics with life skills',
          'Integrate technology thoughtfully into everyday learning',
          'Build a safe, inclusive campus where every student is known and supported',
          'Partner closely with parents as co-educators',
        ] }, order: 3 },
      ],
      isPublished: true,
    },
    {
      slug: 'about-history',
      group: 'about',
      title: 'Our History',
      blocks: [
        { type: 'paragraph', data: { text: 'M.R. Vivekananda Public School was founded with a simple belief: that every child learns best in an environment built on curiosity, discipline, and care. Since then, the school has grown into a full CBSE institution serving West Delhi, guided by the same founding values.' }, order: 0 },
        { type: 'paragraph', data: { text: 'What began as a small neighbourhood school has expanded its infrastructure, faculty, and academic programs over the years, while staying true to its child-centric philosophy.' }, order: 1 },
      ],
      isPublished: true,
    },
    {
      slug: 'about-chairmans-message',
      group: 'about',
      title: "Chairman's Message",
      blocks: [
        { type: 'quote', data: { text: 'A school is only as strong as the community that builds it. Every decision we make is guided by what is genuinely best for our students.', attribution: 'Chairman, MRVPS' }, order: 0 },
        { type: 'paragraph', data: { text: 'It has been a privilege to watch this institution grow year after year. Our commitment remains the same: to provide an education that prepares children not just for exams, but for life.' }, order: 1 },
      ],
      isPublished: true,
    },
    {
      slug: 'about-principals-message',
      group: 'about',
      title: "Principal's Message",
      blocks: [
        { type: 'quote', data: { text: 'Education is not the filling of a pail, but the lighting of a fire. At MRVPS, our goal every single day is to light that fire in every child who walks through our gates.', attribution: 'Principal, MRVPS' }, order: 0 },
        { type: 'paragraph', data: { text: 'We are committed to a learning environment where academic rigor and personal growth go hand in hand, preparing students not just for examinations but for life.' }, order: 1 },
      ],
      isPublished: true,
    },
    {
      slug: 'about-leadership',
      group: 'about',
      title: 'School Leadership',
      subtitle: 'The team guiding MRVPS',
      blocks: [
        { type: 'paragraph', data: { text: 'Our leadership team brings decades of combined experience in CBSE education, curriculum design, and school administration.' }, order: 0 },
        { type: 'list', data: { items: [
          'Anjali Mehra — Principal',
          'Ravi Kapoor — Vice Principal',
          'Dr. Pranvi Luthra — Head, Research, Training & Innovation',
        ] }, order: 1 },
      ],
      isPublished: true,
    },
    {
      slug: 'about-infrastructure',
      group: 'about',
      title: 'Infrastructure',
      blocks: [
        { type: 'paragraph', data: { text: 'Our campus is built to support active, hands-on learning — from smart classrooms and science labs to dedicated spaces for sport, art, and music. See the Facilities page for a full breakdown of every space on campus.' }, order: 0 },
      ],
      isPublished: true,
    },
    {
      slug: 'about-rules-policies',
      group: 'about',
      title: 'School Rules & Policies',
      blocks: [
        { type: 'heading', data: { text: 'Attendance' }, order: 0 },
        { type: 'paragraph', data: { text: 'Students are expected to maintain at least 75% attendance each term. Leave of absence must be applied for in advance through the Parents Corner or by written note.' }, order: 1 },
        { type: 'heading', data: { text: 'Uniform' }, order: 2 },
        { type: 'paragraph', data: { text: 'The prescribed school uniform must be worn on all working days. PE uniform is required on days with scheduled physical education classes.' }, order: 3 },
        { type: 'heading', data: { text: 'Conduct' }, order: 4 },
        { type: 'paragraph', data: { text: 'Students are expected to treat staff and peers with respect at all times. Bullying, dishonesty, and damage to school property are taken seriously and handled per the school\'s disciplinary policy.' }, order: 5 },
      ],
      isPublished: true,
    },
    {
      slug: 'academics-methodology',
      group: 'academics',
      title: 'Teaching Methodology',
      blocks: [
        { type: 'paragraph', data: { text: 'MRVPS follows a child-centric teaching approach that emphasizes hands-on experience, language development, and analytical thinking over rote memorization.' }, order: 0 },
        { type: 'list', data: { items: [
          'Activity-based and experiential learning across all grades',
          'Smart classrooms integrating technology into daily lessons',
          'Regular teacher training and curriculum workshops',
          'Continuous, low-pressure assessment alongside formal exams',
        ] }, order: 1 },
      ],
      isPublished: true,
    },
    {
      slug: 'academics-examinations',
      group: 'academics',
      title: 'Examination System',
      blocks: [
        { type: 'paragraph', data: { text: 'Students are assessed through a combination of periodic tests, term examinations, and continuous internal assessment, in line with CBSE guidelines.' }, order: 0 },
        { type: 'list', data: { items: [
          'Term 1 Examination — September',
          'Term 2 / Annual Examination — February–March',
          'Periodic tests and class assessments throughout the year',
          'Results published to parents via the Parent Portal',
        ] }, order: 1 },
      ],
      isPublished: true,
    },
    {
      slug: 'academics-calendar',
      group: 'academics',
      title: 'Academic Calendar',
      blocks: [
        { type: 'paragraph', data: { text: 'Key dates for the 2026–27 academic year:' }, order: 0 },
        { type: 'list', data: { items: [
          'Session begins — 1 April 2026',
          'Summer Break — 15 May to 30 June 2026',
          'Term 1 Examination — 15–19 September 2026',
          'Winter Break — 25 December 2026 to 2 January 2027',
          'Annual Examination — February–March 2027',
        ] }, order: 1 },
      ],
      isPublished: true,
    },
  ]);

  await upsertMany(AcademicProgram, (d) => ({ level: d.level }), [
    { level: 'pre-primary', title: 'Pre-Primary', ageGroup: '3–5 years', description: 'Play-based learning that builds curiosity, language, and motor skills through structured activity.', highlights: ['Activity-based classrooms', 'Story-telling and phonics', 'Motor skills development'], subjects: ['Language Readiness', 'Numeracy Basics', 'Art & Craft', 'Physical Play'], order: 1, isActive: true },
    { level: 'primary', title: 'Primary School', ageGroup: '6–10 years (Classes 1–5)', description: 'A strong foundation in language, mathematics, and science, with growing independence and analytical thinking.', highlights: ['Small class sizes', 'Hands-on science', 'Reading programs'], subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer Basics'], order: 2, isActive: true },
    { level: 'middle', title: 'Middle School', ageGroup: '11–13 years (Classes 6–8)', description: 'Broader subject exposure and the start of structured examinations, alongside clubs and activities.', highlights: ['Subject specialists per teacher', 'Introduction to Sanskrit/2nd language', 'Club participation'], subjects: ['English', 'Hindi', 'Sanskrit', 'Mathematics', 'Science', 'Social Science', 'Computer Science'], order: 3, isActive: true },
    { level: 'secondary', title: 'Secondary School', ageGroup: '14–15 years (Classes 9–10)', description: 'CBSE board-aligned curriculum with focused exam preparation and career-orientation sessions.', highlights: ['Board exam preparation', 'Career guidance', 'Elective subjects'], subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Information Technology'], order: 4, isActive: true },
    // { level: 'senior-secondary', title: 'Senior Secondary', ageGroup: '16–17 years (Classes 11–12)', description: 'Stream-based specialization (Science, Commerce, Humanities) with a focus on board results and college readiness.', highlights: ['Stream electives', 'College counselling', 'Competitive exam support'], subjects: ['English', 'Physics', 'Chemistry', 'Mathematics/Biology', 'Accountancy/Economics', 'Business Studies'], order: 5, isActive: true },
  ]);

  await upsertMany(Facility, (d) => ({ name: d.name }), [
    { name: 'Smart Classrooms', category: 'Academics', description: 'Every classroom is equipped with interactive digital boards for multimedia-driven lessons.', icon: '🖥️', order: 1, isActive: true },
    { name: 'Science Laboratories', category: 'Academics', description: 'Dedicated Physics, Chemistry, and Biology labs with hands-on experiment stations.', icon: '🔬', order: 2, isActive: true },
    { name: 'Computer Lab', category: 'Academics', description: 'A fully networked computer lab supporting coding, IT, and digital literacy classes.', icon: '💻', order: 3, isActive: true },
    { name: 'Library', category: 'Academics', description: 'A well-stocked library with fiction, reference material, and a quiet reading zone.', icon: '📚', order: 4, isActive: true },
    { name: 'Sports Facilities', category: 'Sports', description: 'Outdoor grounds for athletics, football, and cricket, plus an indoor games room.', icon: '⚽', order: 5, isActive: true },
    { name: 'Music & Dance Room', category: 'Arts', description: 'A dedicated studio space for vocal, instrumental, and dance training.', icon: '🎵', order: 6, isActive: true },
    { name: 'Art & Craft Studio', category: 'Arts', description: 'A bright, well-supplied studio for painting, sculpture, and craft projects.', icon: '🎨', order: 7, isActive: true },
    { name: 'Transportation', category: 'Support Services', description: 'GPS-tracked school buses covering Bali Nagar, Kirti Nagar, Moti Nagar, and nearby areas.', icon: '🚌', order: 8, isActive: true },
    { name: 'Medical Room', category: 'Support Services', description: 'An on-campus medical room staffed during school hours for first aid and routine checks.', icon: '🏥', order: 9, isActive: true },
    { name: 'Cafeteria', category: 'Support Services', description: 'A hygienic in-house cafeteria serving nutritious meals and snacks.', icon: '🍽️', order: 10, isActive: true },
    { name: 'CCTV Security', category: 'Support Services', description: 'Campus-wide CCTV coverage monitored throughout the school day.', icon: '📹', order: 11, isActive: true },
    { name: 'Auditorium', category: 'Support Services', description: 'A multi-purpose auditorium for assemblies, performances, and events.', icon: '🎭', order: 12, isActive: true },
  ]);

  await upsertMany(FacultyMember, (d) => ({ name: d.name, designation: d.designation }), [
    { name: 'Dr. Pranvi Luthra', designation: 'Head, Research, Training & Innovation', category: 'leadership', department: 'Academics', qualification: 'Ph.D. Education', bio: 'Leads curriculum design and teacher training across the school.', order: 1, isActive: true },
    { name: 'Anjali Mehra', designation: 'Principal', category: 'leadership', department: 'Administration', qualification: 'M.Ed., B.Ed.', bio: 'Over 18 years of experience in CBSE school leadership.', order: 2, isActive: true },
    { name: 'Ravi Kapoor', designation: 'Vice Principal', category: 'leadership', department: 'Administration', qualification: 'M.A., B.Ed.', order: 3, isActive: true },
    { name: 'Sunita Rawat', designation: 'PGT Mathematics', category: 'teaching', department: 'Mathematics', qualification: 'M.Sc. Mathematics, B.Ed.', order: 4, isActive: true },
    { name: 'Amit Sharma', designation: 'PGT Physics', category: 'teaching', department: 'Science', qualification: 'M.Sc. Physics, B.Ed.', order: 5, isActive: true },
    { name: 'Neha Gupta', designation: 'TGT English', category: 'teaching', department: 'Languages', qualification: 'M.A. English, B.Ed.', order: 6, isActive: true },
    { name: 'Vikram Singh', designation: 'TGT Social Science', category: 'teaching', department: 'Social Science', qualification: 'M.A. History, B.Ed.', order: 7, isActive: true },
    { name: 'Pooja Verma', designation: 'PRT Class 3', category: 'teaching', department: 'Primary', qualification: 'B.El.Ed.', order: 8, isActive: true },
    { name: 'Sanjay Malhotra', designation: 'Accounts Officer', category: 'administrative', department: 'Administration', order: 9, isActive: true },
    { name: 'Kavita Joshi', designation: 'Front Office Manager', category: 'administrative', department: 'Administration', order: 10, isActive: true },
  ]);

  await upsertMany(NewsEvent, (d) => ({ slug: d.slug }), [
    { type: 'news', slug: 'admission-2026-27-open', title: 'Admissions Open for 2026–27', summary: 'Applications now open for Pre-Primary through Senior Secondary.', content: 'MRVPS invites applications for the 2026–27 academic year across all classes. Interested parents can visit the Admission page for eligibility, documents required, and the enquiry form.', eventDate: new Date('2026-06-01'), isPublished: true, isFeatured: true },
    { type: 'event', slug: 'annual-sports-day-2026', title: 'Annual Sports Day 2026', summary: 'A full day of athletics, team games, and house competitions.', content: 'Join us for the Annual Sports Day featuring track events, relay races, and inter-house competitions across all age groups.', eventDate: new Date('2026-11-14'), location: 'School Grounds', isPublished: true },
    { type: 'event', slug: 'annual-day-function-2026', title: 'Annual Day Function', summary: 'Cultural performances celebrating the year\'s achievements.', content: 'The school\'s Annual Day will showcase dance, drama, and music performances by students across all classes.', eventDate: new Date('2026-12-20'), location: 'School Auditorium', isPublished: true, isFeatured: true },
    { type: 'circular', slug: 'winter-break-circular-2026', title: 'Winter Break Circular', summary: 'School will remain closed for winter break from 25 Dec to 2 Jan.', content: 'This is to inform all parents that the school will observe winter break from December 25, 2026 to January 2, 2027. Classes resume January 3, 2027.', eventDate: new Date('2026-12-15'), isPublished: true },
    { type: 'holiday', slug: 'republic-day-holiday-2027', title: 'Republic Day Holiday', summary: 'School closed on account of Republic Day.', content: 'The school will remain closed on January 26, 2027, on account of Republic Day.', eventDate: new Date('2027-01-26'), isPublished: true },
    { type: 'achievement', slug: 'inter-school-science-quiz-winners', title: 'Inter-School Science Quiz — First Place', summary: 'Our Class 9–10 team won first place at the Delhi Inter-School Science Quiz.', content: 'Congratulations to our Class 9 and 10 students for winning first place at the Delhi Inter-School Science Quiz, competing against 24 schools.', eventDate: new Date('2026-09-10'), isPublished: true, isFeatured: true },
  ]);

  await upsertMany(GalleryAlbum, (d) => ({ title: d.title }), [
    { title: 'Annual Day 2026', category: 'Events', coverImage: '/images/gallery/annual-day-cover.jpg', items: [
      { type: 'photo', url: '/images/gallery/annual-day-1.jpg', caption: 'Opening dance performance', order: 0 },
      { type: 'photo', url: '/images/gallery/annual-day-2.jpg', caption: 'Prize distribution', order: 1 },
    ], isPublished: true, order: 1 },
    { title: 'Sports Day 2026', category: 'Sports', coverImage: '/images/gallery/sports-day-cover.jpg', items: [
      { type: 'photo', url: '/images/gallery/sports-day-1.jpg', caption: '100m sprint finals', order: 0 },
    ], isPublished: true, order: 2 },
    { title: 'Campus Tour', category: 'Campus', coverImage: '/images/gallery/campus-cover.jpg', items: [
      { type: 'photo', url: '/images/gallery/campus-1.jpg', caption: 'Main building', order: 0 },
      { type: 'photo', url: '/images/gallery/campus-2.jpg', caption: 'Science lab', order: 1 },
    ], isVirtualTour: true, isPublished: true, order: 3 },
  ]);

  await upsertMany(Testimonial, (d) => ({ name: d.name, role: d.role }), [
    { name: 'Gurpreet Singh', role: 'parent', content: 'MRVPS did an excellent job keeping learning engaging even through challenging times, with teachers who stayed closely involved with every student.', rating: 5, order: 1, isActive: true },
    { name: 'Manisha Shandilya', role: 'parent', content: 'Proud to be an MRVian parent — experienced teachers, a strong culture of learning, and real focus on values alongside academics.', rating: 5, order: 2, isActive: true },
    { name: 'Pooja Sharma', role: 'parent', content: 'The care, environment, and value for money at MRVPS made this an easy school to recommend to other parents.', rating: 5, order: 3, isActive: true },
  ]);

  await upsertMany(DownloadItem, (d) => ({ title: d.title }), [
    { title: 'Admission Form 2026–27', category: 'admission-form', fileUrl: '/downloads/admission-form-2026-27.pdf', fileType: 'pdf', order: 1, isActive: true },
    { title: 'School Prospectus', category: 'prospectus', fileUrl: '/downloads/prospectus.pdf', fileType: 'pdf', order: 2, isActive: true },
    { title: 'Holiday List 2026–27', category: 'holiday-list', fileUrl: '/downloads/holiday-list-2026-27.pdf', fileType: 'pdf', order: 3, isActive: true },
    { title: 'Academic Calendar 2026–27', category: 'academic-calendar', fileUrl: '/downloads/academic-calendar-2026-27.pdf', fileType: 'pdf', order: 4, isActive: true },
    { title: 'Transfer Certificate Request Form', category: 'tc-form', fileUrl: '/downloads/tc-request-form.pdf', fileType: 'pdf', order: 5, isActive: true },
  ]);

  await upsertMany(FAQ, (d) => ({ question: d.question }), [
    { question: 'What is the age criteria for Nursery admission?', answer: 'A child must be 3 years old as of March 31 of the academic year for Nursery admission.', category: 'admission', order: 1, isActive: true },
    { question: 'What documents are required for admission?', answer: 'Birth certificate, address proof, previous school transfer certificate (if applicable), and passport-size photographs.', category: 'admission', order: 2, isActive: true },
    { question: 'Does the school provide transportation?', answer: 'Yes, GPS-tracked buses cover Bali Nagar, Kirti Nagar, Moti Nagar, Rajouri Garden, Punjabi Bagh, and Naraina.', category: 'general', order: 3, isActive: true },
    { question: 'What is the medium of instruction?', answer: 'English is the primary medium of instruction, with Hindi and Sanskrit taught as languages.', category: 'academics', order: 4, isActive: true },
    { question: 'Are scholarships available?', answer: 'Yes, merit and need-based scholarships are available — see the Scholarships page for details.', category: 'fees', order: 5, isActive: true },
  ]);

  await upsertMany(FeeStructure, (d) => ({ classLevel: d.classLevel, academicYear: d.academicYear }), [
    { classLevel: 'Nursery', academicYear: '2026-27', admissionFee: 15000, tuitionFeeAnnual: 48000, isActive: true },
    { classLevel: 'Class 1', academicYear: '2026-27', admissionFee: 15000, tuitionFeeAnnual: 52000, isActive: true },
    { classLevel: 'Class 6', academicYear: '2026-27', admissionFee: 18000, tuitionFeeAnnual: 60000, isActive: true },
    { classLevel: 'Class 10', academicYear: '2026-27', admissionFee: 20000, tuitionFeeAnnual: 68000, isActive: true },
    { classLevel: 'Class 12', academicYear: '2026-27', admissionFee: 22000, tuitionFeeAnnual: 75000, isActive: true },
  ]);

  await upsertMany(ScholarshipInfo, (d) => ({ title: d.title }), [
    { title: 'Merit Scholarship', description: 'Awarded to students scoring above 90% in the previous academic year.', eligibility: 'Classes 6–12, minimum 90% aggregate', discountPercent: 25, order: 1, isActive: true },
    { title: 'Sibling Discount', description: 'A discount on tuition fees for families enrolling more than one child.', eligibility: 'Second child onward', discountPercent: 10, order: 2, isActive: true },
  ]);

  await upsertMany(AlumniStory, (d) => ({ name: d.name, batchYear: d.batchYear }), [
    { name: 'Rohan Verma', batchYear: '2018', currentRole: 'Software Engineer at a leading tech company', story: 'My years at MRVPS built the discipline and curiosity that shaped my career in engineering. The teachers pushed us to think, not just memorize.', isPublished: true },
    { name: 'Ishita Kapoor', batchYear: '2020', currentRole: 'Medical Student', story: 'The strong science foundation from MRVPS gave me a real head start in my medical entrance preparation.', isPublished: true },
  ]);

  await upsertMany(CareerOpening, (d) => ({ title: d.title }), [
    { title: 'PGT Mathematics', department: 'Mathematics', employmentType: 'full-time', description: 'We are looking for an experienced PGT Mathematics teacher for Senior Secondary classes.', requirements: ['M.Sc. Mathematics', 'B.Ed.', 'Minimum 3 years CBSE teaching experience'], isActive: true },
    { title: 'Front Office Executive', department: 'Administration', employmentType: 'full-time', description: 'Manage front-desk operations, parent queries, and daily administrative coordination.', requirements: ['Graduate', 'Strong communication skills', 'Prior school administration experience preferred'], isActive: true },
  ]);

  await upsertMany(AdmissionEnquiry, (d) => ({ email: d.email, studentName: d.studentName }), [
    { studentName: 'Kabir Malhotra', classAppliedFor: 'Nursery', parentName: 'Rajesh Malhotra', email: 'rajesh.malhotra@example.com', phone: '9876500001', message: 'Interested in Nursery admission for 2026–27, please share fee details.', status: 'new' },
    { studentName: 'Ananya Rao', classAppliedFor: 'Class 3', parentName: 'Suresh Rao', email: 'suresh.rao@example.com', phone: '9876500002', message: 'Relocating to Delhi, looking for Class 3 admission.', status: 'contacted' },
  ]);

  await upsertMany(ContactMessage, (d) => ({ email: d.email, subject: d.subject }), [
    { name: 'Meena Iyer', email: 'meena.iyer@example.com', phone: '9876500003', subject: 'Transport route query', message: 'Does the school bus cover the Punjabi Bagh area?', status: 'new' },
    { name: 'Arjun Nair', email: 'arjun.nair@example.com', subject: 'Fee structure request', message: 'Could you share the fee structure for Class 8?', status: 'read' },
  ]);

  // ---------------------------------------------------------------------
  // Students, portal accounts, and academic records
  // ---------------------------------------------------------------------

  const studentDefs = [
    { admissionNo: 'MRV26-1001', name: 'Aarav Sharma', class: '6', section: 'A', rollNo: '12', gender: 'male', parentName: 'Deepak Sharma', parentPhone: '9876500010', parentEmail: 'demo.parent@demo.mrvps.org' },
    { admissionNo: 'MRV26-1002', name: 'Ishaan Verma', class: '6', section: 'A', rollNo: '5', gender: 'male', parentName: 'Manoj Verma', parentPhone: '9876500011', parentEmail: 'manoj.verma@demo.mrvps.org' },
    { admissionNo: 'MRV26-1003', name: 'Diya Kapoor', class: '6', section: 'A', rollNo: '18', gender: 'female', parentName: 'Ritu Kapoor', parentPhone: '9876500012', parentEmail: 'ritu.kapoor@demo.mrvps.org' },
    { admissionNo: 'MRV26-1004', name: 'Myra Gupta', class: '8', section: 'B', rollNo: '7', gender: 'female', parentName: 'Sanjay Gupta', parentPhone: '9876500013', parentEmail: 'sanjay.gupta@demo.mrvps.org' },
    { admissionNo: 'MRV26-1005', name: 'Vivaan Singh', class: '10', section: 'A', rollNo: '21', gender: 'male', parentName: 'Harpreet Singh', parentPhone: '9876500014', parentEmail: 'harpreet.singh@demo.mrvps.org' },
  ];

  const students = {};
  for (const def of studentDefs) {
    let s = await Student.findOne({ admissionNo: def.admissionNo });
    if (!s) {
      s = await Student.create({ ...def, isActive: true });
      log(`Student created: ${def.name} (${def.admissionNo})`);
    }
    students[def.admissionNo] = s;
  }

  const mainStudent = students['MRV26-1001']; // Aarav Sharma — the one with full demo history below

  // Portal logins (separate from seed.js's demo.parent/demo.student — these
  // use a distinct email domain so both seed scripts can coexist cleanly)
  const portalDefs = [
    { role: 'parent', name: 'Deepak Sharma', email: 'deepak.sharma@demo.mrvps.org', password: 'ParentDemo#26', students: [mainStudent._id] },
    { role: 'student', name: 'Aarav Sharma', email: 'aarav.sharma@demo.mrvps.org', password: 'StudentDemo#26', students: [mainStudent._id] },
  ];
  for (const def of portalDefs) {
    let acc = await PortalAccount.findOne({ email: def.email });
    if (!acc) {
      const passwordHash = await bcrypt.hash(def.password, 12);
      acc = await PortalAccount.create({ role: def.role, name: def.name, email: def.email, passwordHash, students: def.students, mustChangePassword: false });
      log(`Portal login created: ${def.email} / ${def.password} (${def.role})`);
    }
  }

  // Attendance: last 15 weekdays for the main student, mostly present with a
  // couple of absences/leave so the portal's percentage calculation has
  // something realistic to show.
  const attendancePattern = ['present', 'present', 'present', 'absent', 'present', 'present', 'leave', 'present', 'present', 'present', 'present', 'half-day', 'present', 'present', 'present'];
  let dayCursor = new Date();
  let attendanceCreated = 0;
  for (let i = 0; attendanceCreated < attendancePattern.length; i++) {
    const d = new Date(dayCursor);
    d.setDate(d.getDate() - i);
    if (d.getDay() === 0 || d.getDay() === 6) continue; // skip weekends
    d.setHours(0, 0, 0, 0);
    const exists = await Attendance.findOne({ student: mainStudent._id, date: d });
    if (!exists) {
      await Attendance.create({
        student: mainStudent._id, class: mainStudent.class, section: mainStudent.section,
        date: d, status: attendancePattern[attendanceCreated],
      });
    }
    attendanceCreated++;
  }
  log(`Attendance: ${attendancePattern.length} days seeded for ${mainStudent.name}`);

  await upsertMany(Homework, (d) => ({ title: d.title, class: d.class, section: d.section }), [
    { class: '6', section: 'A', subject: 'Mathematics', title: 'Chapter 4 — Fractions Worksheet', description: 'Complete exercises 4.1 to 4.3 in the notebook.', dueDate: new Date(Date.now() + 3 * 86400000), isActive: true },
    { class: '6', section: 'A', subject: 'English', title: 'Essay — My Favourite Festival', description: 'Write a 200-word essay, due next class.', dueDate: new Date(Date.now() + 5 * 86400000), isActive: true },
    { class: '6', section: 'A', subject: 'Science', title: 'Diagram — Parts of a Plant Cell', description: 'Label and colour the diagram from Chapter 3.', dueDate: new Date(Date.now() + 2 * 86400000), isActive: true },
  ]);

  await upsertMany(StudyMaterial, (d) => ({ title: d.title, class: d.class }), [
    { class: '6', section: 'A', subject: 'Mathematics', title: 'Fractions — Revision Notes', description: 'Summary notes covering the full chapter.', fileUrl: '/study-materials/class6-maths-fractions.pdf', isActive: true },
    { class: '6', subject: 'Science', title: 'Plant Cell Structure — Reference Sheet', description: 'Labelled diagram and key terms.', fileUrl: '/study-materials/class6-science-plant-cell.pdf', isActive: true },
  ]);

  await upsertMany(ExamSchedule, (d) => ({ examName: d.examName, class: d.class, subject: d.subject }), [
    { examName: 'Term 1 Examination 2026', class: '6', section: 'A', subject: 'Mathematics', examDate: new Date('2026-09-15'), startTime: '09:00', endTime: '11:00', room: 'Room 12', maxMarks: 100, isActive: true },
    { examName: 'Term 1 Examination 2026', class: '6', section: 'A', subject: 'English', examDate: new Date('2026-09-17'), startTime: '09:00', endTime: '11:00', room: 'Room 12', maxMarks: 100, isActive: true },
    { examName: 'Term 1 Examination 2026', class: '6', section: 'A', subject: 'Science', examDate: new Date('2026-09-19'), startTime: '09:00', endTime: '11:00', room: 'Room 12', maxMarks: 100, isActive: true },
  ]);

  const existingResult = await Result.findOne({ student: mainStudent._id, examName: 'Term 1 Examination 2026' });
  if (!existingResult) {
    await Result.create({
      student: mainStudent._id,
      examName: 'Term 1 Examination 2026',
      academicYear: '2026-27',
      subjects: [
        { subject: 'Mathematics', marksObtained: 88, maxMarks: 100, grade: 'A1' },
        { subject: 'English', marksObtained: 79, maxMarks: 100, grade: 'A2' },
        { subject: 'Science', marksObtained: 91, maxMarks: 100, grade: 'A1' },
        { subject: 'Social Science', marksObtained: 84, maxMarks: 100, grade: 'A1' },
        { subject: 'Hindi', marksObtained: 76, maxMarks: 100, grade: 'B1' },
      ],
      remarks: 'A strong all-round performance this term. Keep up the consistent effort.',
      isPublished: true,
      publishedAt: new Date(),
    });
    log(`Result created for ${mainStudent.name}: Term 1 Examination 2026`);
  }

  await upsertMany(PTMSchedule, (d) => ({ class: d.class, date: d.date }), [
    { class: '6', section: 'A', date: new Date('2026-09-28'), time: '10:00 AM – 1:00 PM', description: 'Term 1 result discussion and progress review.', isActive: true },
  ]);

  await upsertMany(FeeRecord, (d) => ({ student: d.student, academicYear: d.academicYear, term: d.term }), [
    { student: mainStudent._id, academicYear: '2026-27', term: 'Term 1', amount: 30000, dueDate: new Date('2026-04-15'), status: 'paid', paidAmount: 30000, paidDate: new Date('2026-04-10'), paymentMode: 'bank-transfer' },
    { student: mainStudent._id, academicYear: '2026-27', term: 'Term 2', amount: 30000, dueDate: new Date('2026-10-15'), status: 'pending' },
  ]);

  log('Done. This is demo data — delete students/portal accounts/records above before going live.');
  process.exit(0);
})().catch((err) => {
  console.error('[seed:demo] Failed:', err);
  process.exit(1);
});
