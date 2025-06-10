const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentMethodSchema = new Schema({
  type: {
    type: String,
    enum: ['Cash', 'Card', 'Bank Transfer', 'Digital Wallet'],
    required: true
  },
  details: String
});

const customerSchema = new Schema({
  customerType: {
    type: String,
    enum: ['Individual', 'Corporate'],
    required: true
  },
  // Individual Customer Fields
  fullName: {
    type: String,
    required: function() { return this.customerType === 'Individual'; }
  },
  emiratesId: {
    type: String,
    required: function() { return this.customerType === 'Individual'; },
    validate: {
      validator: function(v) {
        // Only validate if customerType is Individual and value is provided
        if (this.customerType === 'Individual' && v) {
          return /^784-[0-9]{4}-[0-9]{7}-[0-9]{1}$/.test(v);
        }
        // For corporate customers or empty values, skip validation
        return true;
      },
      message: props => `${props.value} is not a valid Emirates ID format (784-XXXX-XXXXXXX-X)`
    }
  },
  passportNumber: String,
  nationality: {
    type: String,
    required: function() { return this.customerType === 'Individual'; }
  },
  dob: {
    type: Date,
    required: function() { return this.customerType === 'Individual'; }
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: function() { return this.customerType === 'Individual'; }
  },
  // Corporate Customer Fields
  companyName: {
    type: String,
    required: function() { return this.customerType === 'Corporate'; }
  },
  tradeLicense: {
    type: String,
    required: function() { return this.customerType === 'Corporate'; }
  },
  trnNumber: {
    type: String,
    required: function() { return this.customerType === 'Corporate'; },
    validate: {
      validator: function(v) {
        return /^[0-9]{15}$/.test(v);
      },
      message: props => `${props.value} is not a valid TRN (must be 15 digits)`
    }
  },
  // Common Fields
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email']
  },
  mobile: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\+971[0-9]{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid UAE mobile number (+971XXXXXXXXX)`
    }
  },
  alternateMobile: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^\+971[0-9]{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid UAE mobile number (+971XXXXXXXXX)`
    }
  },
  address: {
    type: String,
    required: true
  },
  emirate: {
    type: String,
    enum: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'],
    required: true
  },
  poBox: String,
  preferredLanguage: {
    type: String,
    enum: ['English', 'Arabic'],
    default: 'English'
  },
  paymentMethods: [paymentMethodSchema],
  kycVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Update lastUpdated timestamp before saving
customerSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Text index for search
customerSchema.index({
  fullName: 'text',
  companyName: 'text',
  emiratesId: 'text',
  tradeLicense: 'text',
  trnNumber: 'text',
  email: 'text',
  mobile: 'text'
});

module.exports = mongoose.model('Customer', customerSchema);
