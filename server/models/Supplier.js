// models/Supplier.js
const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  tradeLicense: {
    type: String,
    required: [true, 'Trade license number is required'],
    trim: true,
    unique: true
  },
  trnNumber: {
    type: String,
    required: [true, 'TRN number is required'],
    trim: true,
    unique: true
  },
  jurisdiction: {
    type: String,
    required: [true, 'Jurisdiction is required'],
    trim: true
  },
  establishmentYear: {
    type: String,
    required: [true, 'Year of establishment is required'],
    trim: true
  },
  bankDetails: {
    type: String,
    required: [true, 'Bank details are required'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Supplier', SupplierSchema);