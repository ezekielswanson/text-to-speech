



const express = require("express");
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const dbURI = process.env.MONGODB_URI;

const app = express();
// Allows incoming requests from any IP
app.use(cors());

mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));