import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://gastos-hormiga-7g5jx835t-jeffs-projects-2e8483b3.vercel.app',
  'https://gastos-hormiga-eta.vercel.app/',
  process.env.BACKEND_URL,
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? allowedOrigins 
    : true,
  credentials: true,
}));

app.use(express.json());

// Health check endpoint (important for Render)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🐜 Gastos Hormiga API running on port ${PORT}`);
  console.log(`📊 Health check: /health`);
});

export default app;
