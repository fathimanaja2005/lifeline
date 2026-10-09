const mongoose = require('mongoose');

const bloodStockSchema = new mongoose.Schema(
  {
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      unique: true,
    },
    units: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Units cannot be negative'],
    },
    minThreshold: {
      type: Number,
      default: 10,
    },
    bloodBankName: {
      type: String,
      default: 'Central Life Blood Bank & Research Institute',
    },
    location: {
      type: String,
      default: 'Metro Medical Complex, 4th Avenue',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual property to flag low stock
bloodStockSchema.virtual('isLowStock').get(function () {
  return this.units <= this.minThreshold;
});

bloodStockSchema.set('toJSON', { virtuals: true });
bloodStockSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('BloodStock', bloodStockSchema);
