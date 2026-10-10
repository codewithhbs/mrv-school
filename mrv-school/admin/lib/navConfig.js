// Sidebar navigation, grouped and role-gated. `roles: null` means visible to
// everyone who's logged in (superadmin always sees everything regardless).
import {
  LayoutDashboard, Image as ImageIcon, FileText, GraduationCap, Building2, Users,
  Newspaper, Images, Quote, Download, HelpCircle, Wallet, Award, UserCheck,
  Briefcase, Inbox, Mail, FileCheck2, UsersRound, Settings, ShieldCheck,
  Contact, BookOpen, ClipboardList, CalendarClock, ClipboardCheck, CalendarDays,
  ReceiptText, KeyRound,
} from 'lucide-react';

export const navGroups = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: null }],
  },
  {
    label: 'Website Content',
    items: [
      { label: 'Banners', href: '/dashboard/banners', icon: ImageIcon, roles: ['admin', 'content_editor'] },
      { label: 'Pages', href: '/dashboard/pages', icon: FileText, roles: ['admin', 'content_editor'] },
      { label: 'Academic Programs', href: '/dashboard/academic-programs', icon: GraduationCap, roles: ['admin', 'content_editor'] },
      { label: 'Facilities', href: '/dashboard/facilities', icon: Building2, roles: ['admin', 'content_editor'] },
      { label: 'Faculty', href: '/dashboard/faculty', icon: Users, roles: ['admin', 'content_editor'] },
      { label: 'News & Events', href: '/dashboard/news-events', icon: Newspaper, roles: ['admin', 'content_editor'] },
      { label: 'Gallery', href: '/dashboard/gallery', icon: Images, roles: ['admin', 'content_editor'] },
      { label: 'Testimonials', href: '/dashboard/testimonials', icon: Quote, roles: ['admin', 'content_editor'] },
      { label: 'Downloads', href: '/dashboard/downloads', icon: Download, roles: ['admin', 'content_editor'] },
      { label: 'FAQs', href: '/dashboard/faqs', icon: HelpCircle, roles: ['admin', 'content_editor'] },
      { label: 'Fee Structure', href: '/dashboard/fee-structure', icon: Wallet, roles: ['admin'] },
      { label: 'Scholarships', href: '/dashboard/scholarships', icon: Award, roles: ['admin'] },
      { label: 'Alumni Stories', href: '/dashboard/alumni-stories', icon: UserCheck, roles: ['admin', 'content_editor'] },
      { label: 'Career Openings', href: '/dashboard/career-openings', icon: Briefcase, roles: ['admin', 'content_editor'] },
    ],
  },
  {
    label: 'Academics & Portal',
    items: [
      { label: 'Students', href: '/dashboard/students', icon: Contact, roles: ['admin', 'teacher', 'admissions_officer'] },
      { label: 'Portal Accounts', href: '/dashboard/portal-accounts', icon: KeyRound, roles: ['admin'] },
      { label: 'Mark Attendance', href: '/dashboard/attendance', icon: ClipboardCheck, roles: ['admin', 'teacher'] },
      { label: 'Homework', href: '/dashboard/homework', icon: ClipboardList, roles: ['admin', 'teacher'] },
      { label: 'Study Materials', href: '/dashboard/study-materials', icon: BookOpen, roles: ['admin', 'teacher'] },
      { label: 'Exam Schedule', href: '/dashboard/exam-schedule', icon: CalendarClock, roles: ['admin', 'teacher'] },
      { label: 'Results', href: '/dashboard/results', icon: Award, roles: ['admin', 'teacher'] },
      { label: 'PTM Schedule', href: '/dashboard/ptm-schedule', icon: CalendarDays, roles: ['admin', 'teacher'] },
      { label: 'Fee Records', href: '/dashboard/fee-records', icon: ReceiptText, roles: ['admin'] },
    ],
  },
  {
    label: 'Inbox',
    items: [
      { label: 'Admission Enquiries', href: '/dashboard/admission-enquiries', icon: Inbox, roles: ['admin', 'admissions_officer'] },
      { label: 'Contact Messages', href: '/dashboard/contact-messages', icon: Mail, roles: ['admin'] },
      { label: 'Career Applications', href: '/dashboard/career-applications', icon: FileCheck2, roles: ['admin'] },
      { label: 'Alumni Registrations', href: '/dashboard/alumni-registrations', icon: UsersRound, roles: ['admin'] },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Site Settings', href: '/dashboard/settings', icon: Settings, roles: ['admin'] },
      { label: 'Admin Users', href: '/dashboard/users', icon: ShieldCheck, roles: ['admin'] },
    ],
  },
];
