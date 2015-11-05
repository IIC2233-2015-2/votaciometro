const mongoose = require('mongoose');

// Define model
module.exports = mongoose.model('Table', new mongoose.Schema({
  name  :  { type: String },
  votes  :  { type: {} },
}));
