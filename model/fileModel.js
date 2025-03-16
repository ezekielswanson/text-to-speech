//Creating database schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new mongoose.Schema({
    filename: String,
    originalname: String,
    mimetype: String,
    size: Number,
    data: Buffer,
    textContent: String,           // Store extracted text content
    translatedContent: Map,        // Map to store translations in different languages
    uploadDate: { type: Date, default: Date.now }
});

const File = mongoose.model("File", fileSchema);

module.exports = File;