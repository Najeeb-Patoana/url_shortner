import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Url',
      required: true,
      index: true,
    },
    browser: {
      type: String,
      default: 'Unknown',
    },
    os: {
      type: String,
      default: 'Unknown',
    },
    device: {
      type: String,
      enum: ['Desktop', 'Mobile', 'Tablet', 'Wearable', 'Unknown'],
      default: 'Unknown',
    },
    platform: {
      type: String,
      default: 'Unknown',
    },
    country: {
      type: String,
      default: 'Unknown',
    },
    city: {
      type: String,
      default: 'Unknown',
    },
    referrer: {
      type: String,
      default: 'Direct',
      trim: true,
    },
    ipHash: {
      type: String, // SHA-256 anonymized IP
      default: 'unknown',
    },
    language: {
      type: String,
      default: 'Unknown',
    },
    timezone: {
      type: String,
      default: 'Unknown',
    },
    userAgent: {
      type: String,
      default: '',
    },
    clickedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false, // clickedAt serves as the timestamp
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for time-series analytics queries
analyticsSchema.index({ urlId: 1, clickedAt: -1 });
// For aggregation by country, browser, device
analyticsSchema.index({ urlId: 1, country: 1 });
analyticsSchema.index({ urlId: 1, browser: 1 });
analyticsSchema.index({ urlId: 1, device: 1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
