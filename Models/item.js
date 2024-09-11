const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
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
  category: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category",
    required:true,
  },
  images: [{
    url:{
        type: String,
        trim: true,
    }
  }],
  status: {
    type: String,
    enum: ['lost', 'found', 'returned'],
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  returnedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  location: {
    street: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
  },
  dateReported: {
    type: Date,
    default: Date.now,
  },
  returnedOn: {
    type: Date,
  },
  returnedToOwner: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Item', itemSchema);
