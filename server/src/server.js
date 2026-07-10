import 'dotenv/config';
import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './config/logger.js';
import { startExpiredUrlsJob } from './jobs/expiredUrls.job.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      logger.info(`✓ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      logger.info(`✓ API docs: http://localhost:${PORT}/api/docs`);
      logger.info(`✓ Health check: http://localhost:${PORT}/health`);
    });

    // Start background jobs
    startExpiredUrlsJob();

    // ─── Graceful Shutdown ────────────────────────────────────────
    const shutdown = (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force exit after 10 seconds if graceful shutdown fails
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason, promise) => {
      logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    });

    process.on('uncaughtException', (error) => {
      logger.error(`Uncaught Exception: ${error.message}`);
      process.exit(1);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
