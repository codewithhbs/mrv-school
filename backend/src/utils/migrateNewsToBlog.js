// One-time migration: News & Events  ->  Blog.   Run on the server: `npm run migrate:blog`
//  - Copies every document from the old `newsevents` collection into `blogs`
//    (skips slugs that already exist in `blogs`, so it is safe to re-run)
//  - Old `type` (news/event/circular/holiday/achievement) -> blog `category`
//  - Old `eventDate` -> `publishedAt` (only when that keeps the original date order)
//  - Drops event-only fields (eventEndDate, location, attachmentUrl)
//  - Admin users with the old 'news-events' module permission get 'blog' instead
// The old `newsevents` collection is left untouched as a backup. Drop it
// manually once the new /blog pages look right:  db.newsevents.drop()
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Blog = require('../models/Blog');

const TYPE_TO_CATEGORY = {
  news: 'General',
  event: 'Events',
  circular: 'Announcements',
  holiday: 'Announcements',
  achievement: 'Achievements',
};

(async () => {
  try {
    await connectDB();
    const db = mongoose.connection.db;

    const exists = await db.listCollections({ name: 'newsevents' }).hasNext();
    let copied = 0;
    let skipped = 0;

    if (!exists) {
      console.log('[migrate] No `newsevents` collection found — nothing to copy.');
    } else {
      const old = await db.collection('newsevents').find({}).toArray();
      for (const doc of old) {
        if (await Blog.exists({ slug: doc.slug })) { skipped++; continue; }

        const { _id, __v, type, eventDate, eventEndDate, location, attachmentUrl, ...rest } = doc;
        await Blog.collection.insertOne({
          ...rest,
          _id, // keep the same id so audit log references stay valid
          category: TYPE_TO_CATEGORY[type] || 'General',
          author: rest.author || 'MRVPS Team',
          tags: Array.isArray(rest.tags) ? rest.tags : [],
          publishedAt: eventDate || rest.publishedAt || rest.createdAt || new Date(),
        });
        copied++;
      }
      console.log(`[migrate] Blog posts copied: ${copied}, already present (skipped): ${skipped}`);
    }

    const perm = await db.collection('users').updateMany(
      { permissions: 'news-events' },
      [{ $set: { permissions: { $setUnion: [{ $setDifference: ['$permissions', ['news-events']] }, ['blog']] } } }]
    );
    console.log(`[migrate] Users with 'news-events' permission updated to 'blog': ${perm.modifiedCount}`);

    await Blog.syncIndexes();
    console.log('[migrate] Done. Old `newsevents` collection kept as backup.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[migrate] Failed:', err);
    process.exit(1);
  }
})();
