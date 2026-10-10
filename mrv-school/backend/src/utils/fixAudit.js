// One-off fixes from the SEO audit. Run on the server: `npm run fix:audit`
//  - School address + map → current address
//  - Favicon → uploaded logo icon (if empty)
//  - Download items pointing to missing files → hidden (isActive=false) so the
//    site shows no broken links. Re-upload the PDF in Admin → Downloads and
//    tick Active again (or drop the file into src/downloads/ with the same name).
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const SchoolSettings = require('../models/SchoolSettings');
const DownloadItem = require('../models/DownloadItem');

const ADDRESS = '36B, Krishna Park Extn, New Mahavir Nagar, New Delhi, Delhi 110018';
const MAP =
  'https://maps.google.com/maps?q=36B%2C%20Krishna%20Park%20Extn%2C%20New%20Mahavir%20Nagar%2C%20New%20Delhi%2C%20Delhi%20110018&t=m&z=15&output=embed&iwloc=near';
const FAVICON = '/uploads/1786537169042-f9dad1a72b9f289e.png';

function localFileExists(url) {
  if (!url) return false;
  if (/^https?:\/\//i.test(url)) return true; // external — assume OK
  const clean = url.split('?')[0].replace(/^\/+/, '');
  if (!/^(uploads|downloads)\//.test(clean)) return false;
  return fs.existsSync(path.join(__dirname, '..', clean));
}

(async () => {
  await connectDB();

  const s = await SchoolSettings.findOne({ key: 'singleton' });
  if (s) {
    s.address = ADDRESS;
    s.mapEmbedUrl = MAP;
    if (!s.faviconUrl) s.faviconUrl = FAVICON;
    await s.save();
    console.log('[fix] Settings: address/map updated', s.faviconUrl === FAVICON ? '+ favicon set' : '');
  }

  const items = await DownloadItem.find({ isActive: true });
  let hidden = 0;
  for (const d of items) {
    if (!localFileExists(d.fileUrl)) {
      d.isActive = false;
      await d.save();
      hidden += 1;
      console.log(`[fix] Hidden broken download: ${d.title} (${d.fileUrl})`);
    }
  }
  console.log(`[fix] Downloads checked: ${items.length}, hidden: ${hidden}`);

  await mongoose.disconnect();
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
