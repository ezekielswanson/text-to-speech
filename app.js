const express = require("express");
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
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

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

// File upload route
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Check if a file was provided
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create a new file document
    const newFile = new File({
      filename: req.file.filename || req.file.originalname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer // This is the file buffer from multer's memoryStorage
    });

    // Save the file to MongoDB
    await newFile.save();

    // Return success response
    res.status(201).json({
      message: 'File uploaded successfully',
      fileId: newFile._id,
      filename: newFile.originalname
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

// Get file by ID route
app.get('/files/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Set the appropriate content type
    res.set('Content-Type', file.mimetype);
    
    // Send the file data
    res.send(file.data);
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ message: 'Error retrieving file', error: error.message });
  }
});

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

// Optional: Serve static files from public directory
app.use(express.static('public'));

// Define port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});