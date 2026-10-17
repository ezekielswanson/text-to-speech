const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const fileRouter = require('./routes/fileRoutes'); // Import file routes
require('dotenv').config();
const dbURI = process.env.MONGODB_URI;
const File = require('./model/fileModel');

const app = express();
// Allows incoming requests from any IP
app.use(cors());
app.use(express.json());

mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Optional: Serve static files from public directory
app.use(express.static('public'));

// Mount the file routes - All requests starting with /files will go to fileRouter
app.use('/files', fileRouter);

// Get all files route
app.get('/files', async (req, res) => {
  try {
    // Find all files but don't include the binary data
    const files = await File.find({}, { data: 0 });
    res.json(files);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ message: 'Error listing files', error: error.message });
  }
});

// Define port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});