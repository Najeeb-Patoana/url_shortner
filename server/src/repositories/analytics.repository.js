import Analytics from '../models/Analytics.model.js';

/**
 * Repository layer for Analytics — all raw database operations live here.
 */
const analyticsRepository = {
  /** Record a new click event */
  create: (data) => Analytics.create(data),

  /** Get all analytics for a URL with pagination */
  findByUrl: (urlId, { page = 1, limit = 50 } = {}) =>
    Analytics.find({ urlId })
      .sort({ clickedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),

  /** Count total analytics records for a URL */
  countByUrl: (urlId) => Analytics.countDocuments({ urlId }),

  /**
   * Aggregate daily click counts for a URL over a given number of days.
   * Returns array of { date, clicks }.
   */
  getDailyClicks: (urlId, days = 30) => {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return Analytics.aggregate([
      { $match: { urlId, clickedAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$clickedAt' } },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', clicks: 1, _id: 0 } },
    ]);
  },

  /** Top browsers for a URL */
  getTopBrowsers: (urlId, limit = 10) =>
    Analytics.aggregate([
      { $match: { urlId } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]),

  /** Top countries for a URL */
  getTopCountries: (urlId, limit = 10) =>
    Analytics.aggregate([
      { $match: { urlId } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]),

  /** Top devices for a URL */
  getTopDevices: (urlId, limit = 10) =>
    Analytics.aggregate([
      { $match: { urlId } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]),

  /** Top referrers for a URL */
  getTopReferrers: (urlId, limit = 10) =>
    Analytics.aggregate([
      { $match: { urlId } },
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]),

  /** Global daily clicks (admin dashboard) */
  getGlobalDailyClicks: (days = 30) => {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return Analytics.aggregate([
      { $match: { clickedAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$clickedAt' } },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', clicks: 1, _id: 0 } },
    ]);
  },

  /** Total click count across all URLs */
  getTotalClicks: () => Analytics.countDocuments(),

  /** Export analytics records for a URL as raw data (for CSV) */
  exportByUrl: (urlId) =>
    Analytics.find({ urlId })
      .sort({ clickedAt: -1 })
      .select('-__v -_id')
      .lean(),
};

export default analyticsRepository;
