const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image:{
    type: String,
    trim: true,
  },
},{timestamps:true});

module.exports = mongoose.model('Category', categorySchema);