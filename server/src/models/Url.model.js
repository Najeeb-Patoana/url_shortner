import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true, // Critical for fast redirect lookups
    },
    customAlias: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-_]+$/i, 'Alias can only contain letters, numbers, hyphens, and underscores'],
    },
    clicks: {
      type: Number,
      default: 0,
    },
    uniqueClicks: {
      type: Number,
      default: 0,
    },
    lastClickedAt: {
      type: Date,
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional — supports anonymous/public usage
      default: null,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    qrCode: {
      type: String, // Base64 data URL
      default: null,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual: full short URL
urlSchema.virtual('shortUrl').get(function () {
  const base = process.env.BASE_URL || 'http://localhost:5000';
  return `${base}/${this.customAlias || this.shortCode}`;
});

// Virtual: is expired
urlSchema.virtual('isExpired').get(function () {
  if (!this.expiresAt) return false;
  return new Date() > new Date(this.expiresAt);
});

// Index for owner + creation time queries (user dashboard)
urlSchema.index({ owner: 1, createdAt: -1 });
// Index for expiry cleanup job
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Text index for search
urlSchema.index({ originalUrl: 'text', shortCode: 'text', customAlias: 'text', title: 'text' });

const Url = mongoose.model('Url', urlSchema);

export default Url;
