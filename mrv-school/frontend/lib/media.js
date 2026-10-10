// Backend returns relative paths like "/uploads/xyz.png". API_BASE_URL has
// "/api" suffix, so strip it to get the origin those paths are served from.
import { API_BASE_URL } from './api';

const ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export function mediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}
