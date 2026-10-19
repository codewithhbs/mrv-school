// Server-side fetch wrapper for the MRVPS backend API.
// Every call fails soft: if the API is unreachable or returns an error,
// callers get `null`/`[]` back instead of a thrown error, so pages keep
// rendering (with sensible empty states) even if the backend is briefly down.

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.mrvpublicschool.com/api';

async function apiGet(path, { revalidate = 60 } = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      next: { revalidate },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch (err) {
    console.error(`[api] GET ${path} failed:`, err.message);
    return null;
  }
}

async function apiPost(path, body) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: json?.message || 'Something went wrong. Please try again.' };
    }
    return { success: true, data: json?.data, message: json?.message };
  } catch (err) {
    console.error(`[api] POST ${path} failed:`, err.message);
    return { success: false, message: 'Could not reach the server. Please check your connection and try again.' };
  }
}

// --- Typed helpers used across pages ---
export const getSettings = () => apiGet('/settings');
export const getBanners = () => apiGet('/banners');
export const getPageBySlug = async (slug, opts) => {
  const list = await apiGet(`/pages?filter[slug]=${encodeURIComponent(slug)}&limit=1`, opts);
  return Array.isArray(list) && list[0] ? list[0] : null;
};
// CMS pages for the sitemap (to drop noindex / externally-canonical pages).
export const getAllPagesForSitemap = () => apiGet('/pages?limit=100', { revalidate: 3600 });
export const getAcademicPrograms = () => apiGet('/academic-programs?limit=20');
export const getFacilities = () => apiGet('/facilities?limit=50');
export const getFaculty = (category) => apiGet(`/faculty?limit=50${category ? `&filter[category]=${category}` : ''}`);
export const getNewsEvents = (type, limit = 6) =>
  apiGet(`/news-events?limit=${limit}&filter[isPublished]=true${type ? `&filter[type]=${type}` : ''}`);
// All published news/events for the sitemap (API caps limit at 100 per page).
export const getAllNewsEventsForSitemap = async () => {
  const all = [];
  for (let page = 1; page <= 20; page += 1) {
    const batch = await apiGet(`/news-events?limit=100&page=${page}&filter[isPublished]=true`, { revalidate: 3600 });
    if (!Array.isArray(batch) || !batch.length) break;
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
};
export const getNewsEventBySlug = async (slug) => {
  const list = await apiGet(`/news-events?filter[slug]=${encodeURIComponent(slug)}&limit=1`);
  return Array.isArray(list) && list[0] ? list[0] : null;
};
export const getGalleryAlbums = () => apiGet('/gallery?limit=30');
export const getTestimonials = () => apiGet('/testimonials?limit=20');
export const getDownloads = () => apiGet('/downloads?limit=50&filter[isActive]=true');
export const getCareerOpenings = () => apiGet('/careers/openings?limit=20');
export const getFAQs = (category) => apiGet(`/faqs?limit=50${category ? `&filter[category]=${category}` : ''}`);
export const getFeeStructure = () => apiGet('/fee-structure?limit=20');
export const getScholarships = () => apiGet('/scholarships?limit=20');
export const getAlumniStories = () => apiGet('/alumni/stories?limit=20');

export const submitAdmissionEnquiry = (payload) => apiPost('/admission/enquiries', payload);
export const submitContactMessage = (payload) => apiPost('/contact', payload);
export const submitAlumniRegistration = (payload) => apiPost('/alumni/register', payload);

export { BASE_URL as API_BASE_URL };
