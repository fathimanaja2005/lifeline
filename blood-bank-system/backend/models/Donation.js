const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Please provide an appointment date'],
    },
    timeSlot: {
      type: String,
      default: '10:00 AM - 11:00 AM',
    },
    donationCenter: {
      type: String,
      default: 'Central Life Blood Bank & Research Institute',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'Deferred'],
      default: 'Scheduled',
    },
    units: {
      type: Number,
      default: 1,
      min: 1,
    },
    healthVitals: {
      hemoglobin: { type: Number, default: 13.5 }, // g/dL (min 12.5 required)
      bloodPressure: { type: String, default: '120/80' },
      pulse: { type: Number, default: 72 },
    },
    camp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Camp',
      default: null,
    },
    certificateId: {
      type: String,
      default: null,
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Donation', donationSchema);
