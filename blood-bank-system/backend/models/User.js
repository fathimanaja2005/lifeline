const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['donor', 'patient', 'admin'],
      default: 'donor',
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: function () {
        return this.role === 'donor' || this.role === 'patient';
      },
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    age: {
      type: Number,
      min: 18,
      max: 65,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    address: {
      type: String,
    },
    city: {
      type: String,
      default: 'Central City',
    },
    // Donor specific attributes
    lastDonationDate: {
      type: Date,
      default: null,
    },
    weight: {
      type: Number, // in kg, minimum 50kg recommended for donation
      default: 60,
    },
    hasChronicIllness: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Password hashing pre-save hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if donor is eligible (at least 56 days / 8 weeks since last donation, weight >= 50kg)
userSchema.methods.checkEligibility = function () {
  if (this.role !== 'donor') return { eligible: false, reason: 'User is not a donor' };
  if (this.weight && this.weight < 50) {
    return { eligible: false, reason: 'Weight must be at least 50 kg to donate blood' };
  }
  if (this.hasChronicIllness) {
    return { eligible: false, reason: 'Ineligible due to declared medical condition' };
  }
  if (!this.lastDonationDate) {
    return { eligible: true, daysRemaining: 0, reason: 'Eligible for first donation' };
  }
  
  const daysSince = Math.floor((new Date() - new Date(this.lastDonationDate)) / (1000 * 60 * 60 * 24));
  const minIntervalDays = 56; // 8 weeks standard
  
  if (daysSince >= minIntervalDays) {
    return { eligible: true, daysRemaining: 0, reason: `Eligible (${daysSince} days since last donation)` };
  } else {
    return {
      eligible: false,
      daysRemaining: minIntervalDays - daysSince,
      reason: `Wait ${minIntervalDays - daysSince} more days for safe interval`,
    };
  }
};

module.exports = mongoose.model('User', userSchema);
