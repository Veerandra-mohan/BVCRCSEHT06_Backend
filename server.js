const express = require('express');
const cors = require('cors');
const { poolPromise } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Configure CORS to allow requests from all origins during development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// A simple route to check if the server is running
app.get('/', (req, res) => {
  res.send('API is running...');
});

// A special route to check the database connection status
app.get('/db-status', async (req, res) => {
    try {
        const pool = await poolPromise;
        if (pool && pool.connected) {
            res.json({ status: 'success', message: 'Successfully connected to the database.' });
        } else {
             res.status(500).json({ status: 'error', message: 'Database is not connected.' });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed to connect to the database.', error: err.message });
    }
});

// API Routes for our data
app.use('/students', require('./routes/students'));
app.use('/teachers', require('./routes/teachers'));
app.use('/courses', require('./routes/courses'));
app.use('/enrollments', require('./routes/enrollments'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});