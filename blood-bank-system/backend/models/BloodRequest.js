const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientName: {
      type: String,
      required: [true, 'Please provide the patient name'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: [true, 'Please provide the blood group required'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    units: {
      type: Number,
      required: [true, 'Please specify the number of blood units requested'],
      min: [1, 'Must request at least 1 unit'],
    },
    hospitalName: {
      type: String,
      required: [true, 'Please specify hospital or clinic name'],
    },
    hospitalAddress: {
      type: String,
      default: '',
    },
    doctorName: {
      type: String,
      default: '',
    },
    reason: {
      type: String,
      required: [true, 'Please specify reason / medical diagnosis'],
    },
    urgency: {
      type: String,
      enum: ['Normal', 'Urgent', 'Critical'],
      default: 'Normal',
    },
    requiredDate: {
      type: Date,
      default: Date.now,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Dispatched', 'Completed', 'Rejected'],
      default: 'Pending',
    },
    adminRemarks: {
      type: String,
      default: '',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    fulfilledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
