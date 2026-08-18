const express = require('express');
const buildCrudRouter = require('../utils/routeFactory');

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

const router = express.Router();

router.use('/banners', buildCrudRouter(Banner, 'Banner', { permissionKey: 'banners' }));
router.use('/pages', buildCrudRouter(Page, 'Page', { searchFields: ['title', 'slug'], permissionKey: 'pages' }));
router.use('/academic-programs', buildCrudRouter(AcademicProgram, 'AcademicProgram', { permissionKey: 'academic-programs' }));
router.use('/facilities', buildCrudRouter(Facility, 'Facility', { searchFields: ['name', 'category'], permissionKey: 'facilities' }));
router.use('/faculty', buildCrudRouter(FacultyMember, 'FacultyMember', { searchFields: ['name', 'department'], permissionKey: 'faculty' }));
router.use('/news-events', buildCrudRouter(NewsEvent, 'NewsEvent', { searchFields: ['title', 'summary'], permissionKey: 'news-events' }));
router.use('/gallery', buildCrudRouter(GalleryAlbum, 'GalleryAlbum', { searchFields: ['title', 'category'], permissionKey: 'gallery' }));
router.use('/testimonials', buildCrudRouter(Testimonial, 'Testimonial', { permissionKey: 'testimonials' }));
router.use('/downloads', buildCrudRouter(DownloadItem, 'DownloadItem', { searchFields: ['title'], permissionKey: 'downloads' }));
router.use('/careers/openings', buildCrudRouter(CareerOpening, 'CareerOpening', { searchFields: ['title', 'department'], permissionKey: 'career-openings' }));
router.use('/faqs', buildCrudRouter(FAQ, 'FAQ', { permissionKey: 'faqs' }));
router.use('/fee-structure', buildCrudRouter(FeeStructure, 'FeeStructure', { permissionKey: 'fee-structure' }));
router.use('/scholarships', buildCrudRouter(ScholarshipInfo, 'ScholarshipInfo', { permissionKey: 'scholarships' }));
router.use('/alumni/stories', buildCrudRouter(AlumniStory, 'AlumniStory', { permissionKey: 'alumni-stories' }));

module.exports = router;
