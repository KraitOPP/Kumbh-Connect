const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
  },
  guardian: {
    name:{
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber:{
        type:String,
        required:true,
        trim:true,
    },
    relation:{
        type:String,
        required:true,
        trim:true,
    },
    address: {
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
  foundBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      trim: true,
    },
  },
  dateReported: {
    type: Date,
    default: Date.now,
  },
  dateFound: {
    type: Date,
  },
  returnedToOwner: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Person', personSchema);
