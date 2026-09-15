import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { connectDB } from './config/db.js';
import { validateRuntimeEnv } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

validateRuntimeEnv();

const app = express();
const port = Number(process.env.PORT) || 5000;
const isProduction = process.env.NODE_ENV === 'production';

const configuredOrigins = new Set(
  (process.env.FRONTEND_URL || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

function isLocalDevelopmentOrigin(origin) {
  if (isProduction || !origin) return false;

  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

const corsOptions = {
  origin(origin, callback) {
    const allowed =
      !origin ||
      configuredOrigins.has(origin) ||
      isLocalDevelopmentOrigin(origin);

    if (allowed) return callback(null, true);

    const error = new Error(`Origin not allowed by CORS: ${origin}`);
    error.status = 403;
    return callback(error);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.disable('x-powered-by');
app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

if (!isProduction) {
  app.use((req, res, next) => {
    const started = Date.now();
    res.on('finish', () => {
      console.log(
        `${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - started}ms)`
      );
    });
    next();
  });
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'Lily Cafe API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Lily Cafe API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Startup failed:', error);
    process.exit(1);
  });
