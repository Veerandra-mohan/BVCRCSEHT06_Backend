const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK using environment variables
// This is crucial for security and deployment on Render
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newline characters
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  })
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