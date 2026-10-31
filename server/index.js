require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const mediaRoutes = require('./routes/media');
const resultsRoutes = require('./routes/results');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PPIS Backend API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/results', resultsRoutes);

// Error Handling Middleware
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

const { ensureStorageBucket } = require('./config/supabase');

// Start Server when run directly
if (require.main === module) {
  const server = app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    await ensureStorageBucket();
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`⚠️ Port ${PORT} is already in use by another process. Please close it or set another PORT in .env.`);
    } else {
      console.error('Server error:', err);
    }
  });
}

module.exports = app;
