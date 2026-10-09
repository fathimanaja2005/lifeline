const mongoose = require('mongoose');

const campSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Camp name is required'],
      trim: true,
    },
    organization: {
      type: String,
      required: true,
      default: 'Red Cross Society & Lifeline Foundation',
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      default: '09:00 AM',
    },
    endTime: {
      type: String,
      default: '05:00 PM',
    },
    venue: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    targetUnits: {
      type: Number,
      default: 100,
    },
    registeredDonors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed'],
      default: 'Upcoming',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Camp', campSchema);
