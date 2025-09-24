const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Parse the service account JSON from the new environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore(); // Initialize Firestore

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

// API Routes for our data
app.use('/students', require('./routes/students')(db));
app.use('/teachers', require('./routes/teachers')(db));
app.use('/courses', require('./routes/courses')(db));
app.use('/enrollments', require('./routes/enrollments')(db));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});