// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoute');
const {dbConnect} = require('./utils/db')
require('dotenv').config(); 




const app = express();


// Allow React frontend to access backend
app.use(cors({
  origin: 'http://localhost:5173', // React dev server
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests
app.options('*', cors());

// Parse JSON bodies
app.use(bodyParser.json());

// Routes
app.use('/api', authRoutes);

// Test route
app.get('/', (req, res) => res.send('Backend running'));

// Start server
const port = process.env.PORT || 5001; // use 5001 instead of 5000
dbConnect();
app.listen(port, () => console.log(`Server running on port ${port}`));

