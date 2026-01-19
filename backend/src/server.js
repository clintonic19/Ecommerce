 // Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const connectDB = require('./database/db')

//LOCAL IMPORTs
const mainRoutes = require('./routes/main.route');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

//DB connection
connectDB();

// MIDDLEWARES
app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        // origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
        // allowedHeaders : [
        //     'Content-Type',
        //     'Authorization',
        //     'Cache-Control',
        //     'Expires',
        //     'Pragma'
        // ],
    }
));

app.use(multer().any());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//ROUTES
// Importing all Local route modules
app.use('/api', mainRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend server is running fine 🚀',
    time: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});