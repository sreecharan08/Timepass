const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  originalName: { type: String, required: true },
  storageName: { type: String, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true }
}, {
  timestamps: true,
});

const File = mongoose.model('File', fileSchema);

module.exports = File;