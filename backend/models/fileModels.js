const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  uploadDate: { type: Date, required: true, default: Date.now },
  url: { type: String, required: true },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
