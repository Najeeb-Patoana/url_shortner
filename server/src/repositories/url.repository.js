import Url from '../models/Url.model.js';

/**
 * Repository layer for Url — all raw database operations live here.
 */
const urlRepository = {
  /** Find URL by its short code or custom alias */
  findByCode: (code) =>
    Url.findOne({ $or: [{ shortCode: code }, { customAlias: code }] }),

  /** Find URL by ID */
  findById: (id) => Url.findById(id).populate('owner', 'name email'),

  /** Find URL by ID scoped to a specific owner */
  findByIdAndOwner: (id, ownerId) =>
    Url.findOne({ _id: id, owner: ownerId }),

  /** Create a new shortened URL */
  create: (data) => Url.create(data),

  /** Update URL by ID */
  updateById: (id, updates) =>
    Url.findByIdAndUpdate(id, updates, { new: true, runValidators: true }),

  /** Update URL by ID scoped to owner */
  updateByIdAndOwner: (id, ownerId, updates) =>
    Url.findOneAndUpdate({ _id: id, owner: ownerId }, updates, { new: true, runValidators: true }),

  /** Delete URL by ID */
  deleteById: (id) => Url.findByIdAndDelete(id),

  /** Delete URL by ID scoped to owner */
  deleteByIdAndOwner: (id, ownerId) =>
    Url.findOneAndDelete({ _id: id, owner: ownerId }),

  /** Increment click count and update lastClickedAt atomically */
  incrementClicks: (id) =>
    Url.findByIdAndUpdate(
      id,
      { $inc: { clicks: 1 }, lastClickedAt: new Date() },
      { new: true }
    ),

  /** Increment unique click count */
  incrementUniqueClicks: (id) =>
    Url.findByIdAndUpdate(id, { $inc: { uniqueClicks: 1 } }, { new: true }),

  /** Get paginated URLs for a user with optional search/filter */
  findByOwner: ({ ownerId, page = 1, limit = 10, search = '', sort = '-createdAt', filter = {} } = {}) => {
    const query = { owner: ownerId, ...filter };
    if (search) {
      query.$text = { $search: search };
    }
    return Url.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('owner', 'name email');
  },

  /** Count URLs owned by a user */
  countByOwner: (ownerId, filter = {}) =>
    Url.countDocuments({ owner: ownerId, ...filter }),

  /** Get all URLs (admin) with pagination */
  findAll: ({ page = 1, limit = 10, search = '', sort = '-createdAt', filter = {} } = {}) => {
    const query = { ...filter };
    if (search) {
      query.$text = { $search: search };
    }
    return Url.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('owner', 'name email');
  },

  /** Count all URLs with optional filter */
  count: (filter = {}) => Url.countDocuments(filter),

  /** Bulk delete by array of IDs */
  bulkDelete: (ids) => Url.deleteMany({ _id: { $in: ids } }),

  /** Bulk update status */
  bulkUpdateStatus: (ids, isActive) =>
    Url.updateMany({ _id: { $in: ids } }, { isActive }),

  /** Find most clicked URLs */
  findTopUrls: (limit = 10) =>
    Url.find({ isActive: true })
      .sort({ clicks: -1 })
      .limit(limit)
      .populate('owner', 'name email'),

  /** Check if short code or alias already exists */
  existsByCode: (code) =>
    Url.exists({ $or: [{ shortCode: code }, { customAlias: code }] }),
};

export default urlRepository;
