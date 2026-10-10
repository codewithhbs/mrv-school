require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`[server] MRVPS API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    const shutdown = (signal) => {
      console.log(`[server] Received ${signal}, shutting down gracefully...`);
      server.close(() => {
        console.log('[server] Closed remaining connections.');
        process.exit(0);
      });
      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (err) => {
      console.error('[server] Unhandled Rejection:', err);
    });
  } catch (err) {
    console.error('[server] Failed to start:', err);
    process.exit(1);
  }
})();
