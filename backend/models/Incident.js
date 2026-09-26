const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String },
    },
    locationHistory: [
      {
        lat: Number,
        lng: Number,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'resolved', 'false-alarm'],
      default: 'active',
    },
    aiSeverity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: null,
    },
    aiSummary: {
      type: String,
      default: null,
    },
    mediaUrls: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Incident', incidentSchema);