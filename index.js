import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connection } from './db/postgres.js';  
import categoriesRoute from './routes/categoriesRoute.js';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import helmet from 'helmet';
import pino from 'pino';
import productsRoute from './routes/productsRoute copy.js';

// Initialize dotenv and load environment variables
dotenv.config();

// Create an Express application instance
const app = express();

// Initialize Pino logger for better performance in production
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
app.use((req, res, next) => {
  req.log = logger;
  next();
});

// Middleware setup
app.use(express.json());      // For parsing JSON bodies
app.use(cors());              // Enable CORS
app.use(morgan('dev'));       // HTTP request logging (use pino in production for better performance)
app.use(helmet({ 
  contentSecurityPolicy: false // Disable Content-Security-Policy for development (enable for production)
}));  // Secure HTTP headers
app.use(compression({ level: 6 }));      // Enable response compression with level optimization

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // Max 100 requests per IP
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Set up route handlers
const baseRoute = "/api/v1"
app.use(`${baseRoute}/categories`, categoriesRoute); // Category routes
app.use(`${baseRoute}/products`, productsRoute);     // Product routes

// Set the port and start the server
const PORT = process.env.PORT || 3000;
const LOCALHOST = process.env.HOST || "http://localhost"

// Start the server and ensure the database connection is successful
const startServer = async () => {
  try {
    await connection();  // Ensure successful database connection
    app.listen(PORT, () => {
      logger.info(`Server is running on ${LOCALHOST}:${PORT}`);
    });
  } catch (e) {
    logger.error("Error Running Server:", e);
    process.exit(1); // Exit on error
  }
};

// Start the server
startServer();
