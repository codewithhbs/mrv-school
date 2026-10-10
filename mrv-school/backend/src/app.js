const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const path = require('path');

const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiters');
const { captureRichText, restoreRichText, normalizeSeoFields, normalizeNewsEventBody } = require('./middleware/richText');

const app = express();

// Behind a reverse proxy (nginx) in production - needed for correct req.ip / rate limiting
app.set('trust proxy', 1);

// --- Security headers ---
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images to be loaded by frontend on different origin
  })
);

// --- CORS ---
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// --- Body parsing ---
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// --- Sanitization against NoSQL injection & XSS ---
app.use(mongoSanitize());
// Rich-text HTML fields are captured before xss-clean and restored afterwards
// through an allow-list HTML sanitizer (see middleware/richText.js).
app.use('/api/news-events', captureRichText(['content']));
app.use(xssClean());
app.use('/api/news-events', restoreRichText, normalizeNewsEventBody, normalizeSeoFields);
app.use('/api/pages', normalizeSeoFields);
app.use(hpp());

app.use(compression());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// --- Rate limiting (general) ---
app.use('/api', apiLimiter);

// --- Static file serving for uploads ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Legacy download links (/downloads/<file>.pdf) — drop PDFs into src/downloads/
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// --- API routes ---
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'MRVPS School API', version: '1.0.0' });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
