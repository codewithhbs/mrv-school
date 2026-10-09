// Single source of truth for every generic CMS resource screen: which API
// endpoint backs it, which roles may write/delete, which columns show in the
// table, and which fields appear in the create/edit form. Mirrors the shape
// of the backend's crudFactory + buildCrudRouter, so adding a new module here
// is a config addition, not a new page.

import { cmsPagePath } from './site';

export const resourceConfigs = {
  banners: {
    title: 'Banners',
    description: 'Homepage hero — each banner shows as a 3-photo collage on the homepage, so upload all 3 images here.',
    endpoint: '/banners',
    writeRoles: ['admin', 'content_editor'],
    deleteRoles: ['admin'],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'order', label: 'Order' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'imageUrl', label: 'Main Photo (large, left side)', type: 'image', required: true },
      { name: 'imageUrl2', label: 'Secondary Photo (top right)', type: 'image', hint: 'Optional — shows as a placeholder tile until uploaded.', showIf: (v) => v.heroType !== 'banner' },
      { name: 'imageUrl3', label: 'Tertiary Photo (bottom right)', type: 'image', hint: 'Optional — shows as a placeholder tile until uploaded.', showIf: (v) => v.heroType !== 'banner' },
      { name: 'heroType', label: 'Hero Style', type: 'select', options: ['default', 'banner'], default: 'default', hint: '"banner" shows just this photo full-width; "default" shows the 3-photo collage layout.' },
      { name: 'ctaText', label: 'CTA Text', type: 'text', showIf: (v) => v.heroType !== 'banner' },
      { name: 'ctaLink', label: 'CTA Link', type: 'text', showIf: (v) => v.heroType !== 'banner' },
      { name: 'order', label: 'Order', type: 'number', default: 0, hint: 'The lowest-order active banner is the one shown on the homepage.' },
      { name: 'isActive', label: 'Active', type: 'boolean', default: true },
    ],
  },

  pages: {
    title: 'Pages',
    description: 'Block-based content pages (About Us, Academics, Admission subpages, etc.)',
    endpoint: '/pages',
    writeRoles: ['admin', 'content_editor'],
    deleteRoles: ['admin'],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'Slug' },
      { key: 'group', label: 'Group' },
      { key: 'isPublished', label: 'Published', type: 'boolean' },
    ],
    fields: [
      // ---- main column ----
      { name: '_details', type: 'heading', label: 'Page Details' },
      { name: 'title', label: 'Title', type: 'text', required: true, hint: 'Shown as the H1 heading on the page.' },
      {
        name: 'slug',
        label: 'Slug',
        type: 'slug',
        source: 'title',
        prefix: '/',
        required: true,
        hint: 'Website URL: slug "about-my-page" + group "about" → /about/my-page. Any other slug → /<slug> (e.g. "summer-camp" → /summer-camp). Do NOT change it on existing pages.',
      },
      { name: 'group', label: 'Group', type: 'select', required: true, default: 'general', options: ['general', 'about', 'academics', 'admission', 'facilities', 'student-life', 'parents-corner', 'students-corner'] },
      { name: 'subtitle', label: 'Subtitle', type: 'text' },

      { name: '_blocks', type: 'heading', label: 'Content Blocks', hint: 'Headings become H2s on the site — use them for sub-sections and include the focus keyword in one.' },
      { name: 'blocks', label: 'Content Blocks', type: 'blocks' },

      { name: '_seo', type: 'heading', icon: 'seo', label: 'SEO Settings', hint: 'Controls how this page appears on Google and when shared on WhatsApp / Facebook.' },
      { name: 'focusKeyword', label: 'Focus Keyword', type: 'text', placeholder: 'e.g. best cbse school in ghaziabad', hint: 'The main search phrase this page should rank for.' },
      { name: 'seoTitle', label: 'SEO Title (Meta Title)', type: 'text', counter: [30, 60], hint: 'Leave empty to use the page title. Put the focus keyword near the start.' },
      { name: 'seoDescription', label: 'Meta Description', type: 'textarea', counter: [120, 160], hint: 'Include the focus keyword + a reason to click. Leave empty to auto-generate from the content.' },
      { name: 'metaKeywords', label: 'Keywords', type: 'tags', maxTags: 15, placeholder: 'Type a keyword and press Enter', hint: 'Related search phrases / secondary keywords.' },
      {
        name: 'canonicalUrl',
        label: 'Canonical URL',
        type: 'text',
        inputType: 'url',
        placeholder: 'Leave empty to use this page’s own URL',
        hint: 'Only fill this if the same content lives at another URL that should rank instead (full https:// URL).',
      },
      { name: 'ogImage', label: 'Social Share Image (OG Image)', type: 'image', hint: 'Optional — 1200×630 recommended. Falls back to the main image.' },
      { name: 'noIndex', label: 'Hide from search engines (noindex)', type: 'boolean', default: false },

      // ---- right column ----
      { name: '_publish', type: 'heading', label: 'Publish', side: true },
      { name: 'isPublished', label: 'Published', type: 'boolean', default: true, side: true },

      { name: '_hero', type: 'heading', label: 'Media', side: true },
      { name: 'heroImage', label: 'Hero Image', type: 'image', side: true },

      { name: '_seoPreview_h', type: 'heading', icon: 'seo', label: 'SEO Preview & Score', side: true },
      {
        name: '_seoPreview',
        type: 'seoPreview',
        side: true,
        titleField: 'seoTitle',
        descField: 'seoDescription',
        summaryField: 'subtitle',
        contentField: 'blocks',
        contentType: 'blocks',
        imageField: 'heroImage',
        checkSlug: false,
        path: (v) => cmsPagePath(v.slug, v.group),
      },
    ],
  },

  'academic-programs': {
    title: 'Academic Programs',
    description: 'Pre-Primary through Senior Secondary program details.',
    endpoint: '/academic-programs',
    writeRoles: ['admin', 'content_editor'],
    deleteRoles: ['admin'],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'level', label: 'Level' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ],
    fields: [
      { name: 'level', label: 'Level', type: 'select', required: true, options: ['pre-primary', 'primary', 'middle', 'secondary', 'senior-secondary'] },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'ageGroup', label: 'Age Group', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'highlights', label: 'Highlights (one per line)', type: 'list' },
      { name: 'subjects', label: 'Subjects (one per line)', type: 'list' },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'order', label: 'Order', type: 'number', default: 0 },
      { name: 'isActive', label: 'Active', type: 'boolean', default: true },
    ],
  },

  facilities: {
    title: 'Facilities',
    description: 'Campus facilities — labs, library, sports, transport, etc.',
    endpoint: '/facilities',
    writeRoles: ['admin', 'content_editor'],
    deleteRoles: ['admin'],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'category', label: 'Category' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'icon', label: 'Icon (emoji or class)', type: 'text' },
      { name: 'order', label: 'Order', type: 'number', default: 0 },
      { name: 'isActive', label: 'Active', type: 'boolean', default: true },
    ],
  },

  faculty: {
    title: 'Faculty',
    description: 'Leadership, teaching, and administrative staff profiles.',
    endpoint: '/faculty',
    writeRoles: ['admin', 'content_editor'],
    deleteRoles: ['admin'],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'designation', label: 'Designation' },
      { key: 'category', label: 'Category' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'designation', label: 'Designation', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['leadership', 'teaching', 'administrative'] },
      { name: 'department', label: 'Department', type: 'text' },
      { name: 'qualification', label: 'Qualification', type: 'text' },
      { name: 'bio', label: 'Bio', type: 'textarea' },
      { name: 'photo', label: 'Photo', type: 'image' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'order', label: 'Order', type: 'number', default: 0 },
      { name: 'isActive', label: 'Active', type: 'boolean', default: true },
    ],
  },

  'news-events': {
    title: 'News & Events',
    description: 'News, events, circulars, holiday notices, and achievements — one feed, filtered by type.',
    endpoint: '/news-events',
    writeRoles: ['admin', 'content_editor'],
    deleteRoles: ['admin'],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'type', label: 'Type' },
      { key: 'eventDate', label: 'Date', type: 'date' },
      { key: 'isPublished', label: 'Published', type: 'boolean' },
    ],
    fields: [
      // ---- main column ----
      { name: '_content', type: 'heading', label: 'Content' },
      { name: 'type', label: 'Type', type: 'select', required: true, options: ['news', 'event', 'circular', 'holiday', 'achievement'] },
      { name: 'title', label: 'Title', type: 'text', required: true, hint: 'Shown as the H1 heading on the page.' },
      {
        name: 'slug',
        label: 'URL Slug',
        type: 'slug',
        source: 'title',
        prefix: '/news-events/',
        hint: 'Auto-filled from the title. Short, lowercase, hyphen-separated — include the focus keyword. Changing it on a live post breaks old links.',
      },
      { name: 'summary', label: 'Summary / Excerpt', type: 'textarea', counter: [80, 200], hint: 'Shown on the listing cards. Also used as meta description if that is left empty.' },
      { name: 'content', label: 'Full Content', type: 'richtext', placeholder: 'Write the full news / event details here…' },

      { name: '_seo', type: 'heading', icon: 'seo', label: 'SEO Settings', hint: 'Controls how this page appears on Google and when shared on WhatsApp / Facebook.' },
      { name: 'focusKeyword', label: 'Focus Keyword', type: 'text', placeholder: 'e.g. best cbse school in ghaziabad', hint: 'The main search phrase this page should rank for.' },
      { name: 'metaTitle', label: 'SEO Title (Meta Title)', type: 'text', counter: [30, 60], hint: 'Leave empty to use the page title. Put the focus keyword near the start.' },
      { name: 'metaDescription', label: 'Meta Description', type: 'textarea', counter: [120, 160], hint: 'Include the focus keyword + a reason to click. Leave empty to auto-generate from the content.' },
      { name: 'metaKeywords', label: 'Keywords', type: 'tags', maxTags: 15, placeholder: 'Type a keyword and press Enter', hint: 'Related search phrases / secondary keywords.' },
      {
        name: 'canonicalUrl',
        label: 'Canonical URL',
        type: 'text',
        inputType: 'url',
        placeholder: 'Leave empty to use this page’s own URL',
        hint: 'Only fill this if the same content lives at another URL that should rank instead (full https:// URL).',
      },
      { name: 'ogImage', label: 'Social Share Image (OG Image)', type: 'image', hint: 'Optional — 1200×630 recommended. Falls back to the main image.' },
      { name: 'noIndex', label: 'Hide from search engines (noindex)', type: 'boolean', default: false },

      // ---- right column ----
      { name: '_publish', type: 'heading', label: 'Publish', side: true },
      { name: 'isPublished', label: 'Published', type: 'boolean', default: true, side: true },
      { name: 'isFeatured', label: 'Featured', type: 'boolean', default: false, side: true },
      { name: 'eventDate', label: 'Event/Publish Date', type: 'datetime', side: true },
      { name: 'eventEndDate', label: 'Event End Date', type: 'datetime', side: true, showIf: (v) => v.type === 'event' },
      { name: 'location', label: 'Location', type: 'text', side: true, showIf: (v) => v.type === 'event' },

      { name: '_media', type: 'heading', label: 'Featured Image & Attachment', side: true },
      { name: 'image', label: 'Featured Image', type: 'image', side: true },
      { name: 'imageAlt', label: 'Image Alt Text', type: 'text', side: true, hint: 'Describe the image (Google Images & accessibility).' },
      { name: 'attachmentUrl', label: 'Attachment (PDF/notice)', type: 'document', side: true },

      { name: '_seoPreview_h', type: 'heading', icon: 'seo', label: 'SEO Preview & Score', side: true },
      {
        name: '_seoPreview',
        type: 'seoPreview',
        side: true,
        basePath: '/news-events',
        imageAltField: 'imageAlt',
      },
    ],
  },

  gallery: {
    title: 'Gallery Albums',
    description: 'Photo and video albums, including virtual campus tours.',
    endpoint: '/gallery',
    writeRoles: ['admin', 'content_editor'],
    deleteRoles: ['admin'],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'isPublished', label: 'Published', type: 'boolean' },
    ],
    fields: [
      { name: 'title', label: 'Album Title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'coverImage', label: 'Cover Image', type: 'image' },
      { name: 'items', label: 'Media Items', type: 'mediaItems' },
      { name: 'isVirtualTour', label: 'Virtual Tour', type: 'boolean', default: false },
      { name: 'order', label: 'Order', type: 'number', default: 0 },
      { name: 'isPublished', label: 'Published', type: 'boolean', default: true },
    ],
  },

  testimonials: {
    title: 'Testimonials',
    description: 'Quotes from parents, students, and alumni.',
    endpoint: '/testimonials',
    writeRoles: ['admin', 'content_editor'],
    deleteRoles: ['admin'],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'select', required: true, options: ['parent', 'student', 'alumni'] },
      { name: 'content', label: 'Testimonial', type: 'textarea', required: true },
      { name: 'photo', label: 'Photo', type: 'image' },
      { name: 'rating', label: 'Rating (1–5)', type: 'number', default: 5 },
      { name: 'order', label: 'Order', type: 'number', default: 0 },
      { name: 'isActive', label: 'Active', type: 'boolean', default: true },
    ],
  },

  downloads: {
    title: 'Downloads',
    description: 'Admission forms, prospectus, holiday list, TC form, certificates.',
    endpoint: '/downloads',
    writeRoles: ['admin', 'content_editor'],
    deleteRoles: ['admin'],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['admission-form', 'prospectus', 'holiday-list', 'academic-calendar', 'tc-form', 'certificate', 'other'] },
      { name: 'fileUrl', label: 'File', type: 'document', required: true },
      { name: 'order', label: 'Order', type: 'number', default: 0 },
      { name: 'isActive', label: 'Active', type: 'boolean', default: true },
    ],
  },

  faqs: {
    title: 'FAQs',
    description: 'Frequently asked questions, grouped by category.',
    endpoint: '/faqs',
    writeRoles: ['admin', 'content_editor'],
    deleteRoles: ['admin'],
    columns: [
      { key: 'question', label: 'Question' },
      { key: 'category', label: 'Category' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ],
    fields: [
      { name: 'question', label: 'Question', type: 'text', required: true },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['admission', 'academics', 'fees', 'general'] },
      { name: 'order', label: 'Order', type: 'number', default: 0 },
      { name: 'isActive', label: 'Active', type: 'boolean', default: true },
    ],
  },

  'fee-structure': {
    title: 'Fee Structure',
    description: 'Class-wise fee structure per academic year.',
    endpoint: '/fee-structure',
    writeRoles: ['admin'],
    deleteRoles: ['admin'],
    columns: [
      { key: 'classLevel', label: 'Class' },
      { key: 'academicYear', label: 'Year' },
      { key: 'tuitionFeeAnnual', label: 'Annual Tuition' },
    ],
    fields: [
      { name: 'classLevel', label: 'Class', type: 'text', required: true },
      { name: 'academicYear', label: 'Academic Year', type: 'text', required: true, hint: 'e.g. 2026-27' },
      { name: 'admissionFee', label: 'Admission Fee (₹)', type: 'number', default: 0 },
      { name: 'tuitionFeeAnnual', label: 'Annual Tuition Fee (₹)', type: 'number', default: 0 },
      { name: 'notes', label: 'Notes', type: 'textarea' },
      { name: 'isActive', label: 'Active', type: 'boolean', default: true },
    ],
  },

  scholarships: {
    title: 'Scholarships',
    description: 'Scholarship schemes and eligibility.',
    endpoint: '/scholarships',
    writeRoles: ['admin'],
    deleteRoles: ['admin'],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'discountPercent', label: 'Discount %' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'eligibility', label: 'Eligibility', type: 'textarea' },
      { name: 'discountPercent', label: 'Discount %', type: 'number' },
      { name: 'order', label: 'Order', type: 'number', default: 0 },
      { name: 'isActive', label: 'Active', type: 'boolean', default: true },
    ],
  },

  'alumni/stories': {
    title: 'Alumni Stories',
    description: 'Featured alumni success stories.',
    endpoint: '/alumni/stories',
    writeRoles: ['admin', 'content_editor'],
    deleteRoles: ['admin'],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'batchYear', label: 'Batch' },
      { key: 'isPublished', label: 'Published', type: 'boolean' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'batchYear', label: 'Batch Year', type: 'text', required: true },
      { name: 'currentRole', label: 'Current Role', type: 'text' },
      { name: 'story', label: 'Story', type: 'textarea', required: true },
      { name: 'photo', label: 'Photo', type: 'image' },
      { name: 'isPublished', label: 'Published', type: 'boolean', default: true },
    ],
  },

  'careers/openings': {
    title: 'Career Openings',
    description: 'Open teaching and administrative positions.',
    endpoint: '/careers/openings',
    writeRoles: ['admin', 'content_editor'],
    deleteRoles: ['admin'],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'department', label: 'Department' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'department', label: 'Department', type: 'text' },
      { name: 'employmentType', label: 'Employment Type', type: 'select', options: ['full-time', 'part-time', 'contract'], default: 'full-time' },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'requirements', label: 'Requirements (one per line)', type: 'list' },
      { name: 'applyDeadline', label: 'Apply Deadline', type: 'datetime' },
      { name: 'isActive', label: 'Active', type: 'boolean', default: true },
    ],
  },
};

// Review-queue resources: staff can view + update status, but records are
// created by public visitors (via the public site), so no create/delete UI.
export const reviewQueueConfigs = {
  'admission-enquiries': {
    title: 'Admission Enquiries',
    description: 'Enquiries submitted from the Admission page.',
    endpoint: '/admission/enquiries',
    viewRoles: ['admin', 'admissions_officer'],
    statusField: 'status',
    statusOptions: ['new', 'contacted', 'in-review', 'admitted', 'rejected', 'closed'],
    columns: [
      { key: 'studentName', label: 'Student' },
      { key: 'classAppliedFor', label: 'Class' },
      { key: 'parentName', label: 'Parent' },
      { key: 'phone', label: 'Phone' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'createdAt', label: 'Received', type: 'date' },
    ],
    detailFields: ['studentName', 'dateOfBirth', 'classAppliedFor', 'parentName', 'email', 'phone', 'address', 'message', 'internalNotes'],
  },

  'contact-messages': {
    title: 'Contact Messages',
    description: 'Messages submitted from the Contact Us page.',
    endpoint: '/contact',
    viewRoles: ['admin'],
    statusField: 'status',
    statusOptions: ['new', 'read', 'responded', 'closed'],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'subject', label: 'Subject' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'createdAt', label: 'Received', type: 'date' },
    ],
    detailFields: ['name', 'email', 'phone', 'subject', 'message'],
  },

  'career-applications': {
    title: 'Career Applications',
    description: 'Applications submitted against open positions.',
    endpoint: '/careers/applications',
    viewRoles: ['admin'],
    statusField: 'status',
    statusOptions: ['new', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    columns: [
      { key: 'name', label: 'Applicant' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'createdAt', label: 'Applied', type: 'date' },
    ],
    detailFields: ['name', 'email', 'phone', 'coverNote', 'resumeUrl'],
  },

  'alumni-registrations': {
    title: 'Alumni Registrations',
    description: 'Self-registrations submitted from the Alumni page.',
    endpoint: '/alumni/registrations',
    viewRoles: ['admin'],
    statusField: 'status',
    statusOptions: ['pending', 'approved', 'rejected'],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'batchYear', label: 'Batch' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'createdAt', label: 'Submitted', type: 'date' },
    ],
    detailFields: ['name', 'batchYear', 'email', 'phone', 'currentOccupation', 'city', 'message'],
  },
};

// Academic / student-data resources. These hit the backend's STAFF-ONLY
// routes (see mrvps-backend/src/routes/academic.routes.js) — unlike
// resourceConfigs above, GET here also requires staff auth, because this is
// student PII, not public marketing content.
export const academicResourceConfigs = {
  students: {
    title: 'Students',
    description: 'Student academic records — the roster everything else (attendance, results, portal accounts) links to.',
    endpoint: '/students',
    writeRoles: ['admin', 'teacher'],
    deleteRoles: ['admin'],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'admissionNo', label: 'Admission No.' },
      { key: 'class', label: 'Class' },
      { key: 'section', label: 'Section' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ],
    fields: [
      { name: 'admissionNo', label: 'Admission Number', type: 'text', required: true },
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'class', label: 'Class', type: 'text', required: true },
      { name: 'section', label: 'Section', type: 'text', required: true },
      { name: 'rollNo', label: 'Roll No.', type: 'text' },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'datetime' },
      { name: 'gender', label: 'Gender', type: 'select', options: ['male', 'female', 'other'] },
      { name: 'bloodGroup', label: 'Blood Group', type: 'text' },
      { name: 'photo', label: 'Photo', type: 'image' },
      { name: 'address', label: 'Address', type: 'textarea' },
      { name: 'parentName', label: "Parent's Name", type: 'text' },
      { name: 'parentPhone', label: "Parent's Phone", type: 'text' },
      { name: 'parentEmail', label: "Parent's Email", type: 'text' },
      { name: 'isActive', label: 'Active', type: 'boolean', default: true },
    ],
  },

  homework: {
    title: 'Homework',
    description: 'Class-wide homework and assignments, visible to matching students in the portal.',
    endpoint: '/homework',
    writeRoles: ['admin', 'teacher'],
    deleteRoles: ['admin', 'teacher'],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'class', label: 'Class' },
      { key: 'section', label: 'Section' },
      { key: 'subject', label: 'Subject' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ],
    fields: [
      { name: 'class', label: 'Class', type: 'text', required: true },
      { name: 'section', label: 'Section', type: 'text', required: true },
      { name: 'subject', label: 'Subject', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'attachmentUrl', label: 'Attachment', type: 'document' },
      { name: 'dueDate', label: 'Due Date', type: 'datetime', required: true },
      { name: 'isActive', label: 'Active', type: 'boolean', default: true },
    ],
  },

  'study-materials': {
    title: 'Study Materials',
    description: 'Notes, worksheets, and reference material, visible to matching students in the portal.',
    endpoint: '/study-materials',
    writeRoles: ['admin', 'teacher'],
    deleteRoles: ['admin', 'teacher'],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'class', label: 'Class' },
      { key: 'subject', label: 'Subject' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ],
    fields: [
      { name: 'class', label: 'Class', type: 'text', required: true },
      { name: 'section', label: 'Section (leave blank = whole class)', type: 'text' },
      { name: 'subject', label: 'Subject', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'fileUrl', label: 'File', type: 'document', required: true },
      { name: 'isActive', label: 'Active', type: 'boolean', default: true },
    ],
  },

  'exam-schedule': {
    title: 'Exam Schedule',
    description: 'Exam dates, times, and rooms, visible to matching students in the portal.',
    endpoint: '/exam-schedule',
    writeRoles: ['admin', 'teacher'],
    deleteRoles: ['admin', 'teacher'],
    columns: [
      { key: 'examName', label: 'Exam' },
      { key: 'class', label: 'Class' },
      { key: 'subject', label: 'Subject' },
      { key: 'examDate', label: 'Date', type: 'date' },
    ],
    fields: [
      { name: 'examName', label: 'Exam Name', type: 'text', required: true, hint: 'e.g. Term 1 Examination 2026' },
      { name: 'class', label: 'Class', type: 'text', required: true },
      { name: 'section', label: 'Section (leave blank = whole class)', type: 'text' },
      { name: 'subject', label: 'Subject', type: 'text', required: true },
      { name: 'examDate', label: 'Exam Date', type: 'datetime', required: true },
      { name: 'startTime', label: 'Start Time', type: 'text', hint: 'e.g. 09:00' },
      { name: 'endTime', label: 'End Time', type: 'text', hint: 'e.g. 11:00' },
      { name: 'room', label: 'Room', type: 'text' },
      { name: 'maxMarks', label: 'Max Marks', type: 'number', default: 100 },
      { name: 'isActive', label: 'Active', type: 'boolean', default: true },
    ],
  },

  'ptm-schedule': {
    title: 'PTM Schedule',
    description: 'Parent-Teacher Meeting dates, visible to matching students/parents in the portal.',
    endpoint: '/ptm-schedule',
    writeRoles: ['admin', 'teacher'],
    deleteRoles: ['admin', 'teacher'],
    columns: [
      { key: 'class', label: 'Class' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ],
    fields: [
      { name: 'class', label: 'Class', type: 'text', required: true },
      { name: 'section', label: 'Section (leave blank = whole class)', type: 'text' },
      { name: 'date', label: 'Date', type: 'datetime', required: true },
      { name: 'time', label: 'Time', type: 'text', hint: 'e.g. 10:00 AM – 1:00 PM' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'isActive', label: 'Active', type: 'boolean', default: true },
    ],
  },

  'fee-records': {
    title: 'Fee Records',
    description: 'Per-student fee ledger. Admin-recorded — not a live online payment gateway (see backend README).',
    endpoint: '/fee-records',
    writeRoles: ['admin'],
    deleteRoles: ['admin'],
    columns: [
      { key: 'term', label: 'Term' },
      { key: 'academicYear', label: 'Year' },
      { key: 'amount', label: 'Amount' },
      { key: 'status', label: 'Status' },
    ],
    fields: [
      { name: 'student', label: 'Student', type: 'studentSelect', required: true },
      { name: 'academicYear', label: 'Academic Year', type: 'text', required: true, hint: 'e.g. 2026-27' },
      { name: 'term', label: 'Term', type: 'text', required: true, hint: 'e.g. Term 1, Annual' },
      { name: 'amount', label: 'Amount (₹)', type: 'number', required: true },
      { name: 'dueDate', label: 'Due Date', type: 'datetime', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['pending', 'paid', 'overdue'], default: 'pending' },
      { name: 'paidAmount', label: 'Paid Amount (₹)', type: 'number' },
      { name: 'paidDate', label: 'Paid Date', type: 'datetime' },
      { name: 'paymentMode', label: 'Payment Mode', type: 'text', hint: 'cash, cheque, bank transfer, etc.' },
      { name: 'receiptUrl', label: 'Receipt', type: 'document' },
      { name: 'remarks', label: 'Remarks', type: 'textarea' },
    ],
  },
};

// Results are structurally different (nested subject-marks array), so they
// get their own small dedicated screen (components/ResultsAdmin.js) instead
// of the generic ResourceAdmin table+form.
export const resultsConfig = {
  title: 'Results',
  description: 'Term/exam results per student. Stays hidden from the portal until published.',
  endpoint: '/results',
};
