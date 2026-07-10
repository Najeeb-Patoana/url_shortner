import User from '../models/User.model.js';

/**
 * Repository layer for User — all raw database operations live here.
 */
const userRepository = {
  /** Find user by ID (excludes password by default) */
  findById: (id) => User.findById(id),

  /** Find user by ID and include password field */
  findByIdWithPassword: (id) => User.findById(id).select('+password'),

  /** Find user by email (excludes password by default) */
  findByEmail: (email) => User.findOne({ email: email.toLowerCase() }),

  /** Find user by email including password field (for login) */
  findByEmailWithPassword: (email) =>
    User.findOne({ email: email.toLowerCase() }).select('+password +refreshToken'),

  /** Create a new user */
  create: (data) => User.create(data),

  /** Update user by ID */
  updateById: (id, updates) =>
    User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }),

  /** Store refresh token on user document */
  setRefreshToken: (id, token) =>
    User.findByIdAndUpdate(id, { refreshToken: token }, { new: true }),

  /** Clear refresh token on logout */
  clearRefreshToken: (id) =>
    User.findByIdAndUpdate(id, { refreshToken: null }, { new: true }),

  /** Find user by stored refresh token */
  findByRefreshToken: (token) =>
    User.findOne({ refreshToken: token }).select('+refreshToken'),

  /** Get paginated list of all users (admin) */
  findAll: ({ page = 1, limit = 10, search = '' } = {}) => {
    const query = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {};
    return User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
  },

  /** Count total users matching optional search */
  count: (search = '') => {
    const query = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {};
    return User.countDocuments(query);
  },

  /** Delete user by ID */
  deleteById: (id) => User.findByIdAndDelete(id),
};

export default userRepository;
