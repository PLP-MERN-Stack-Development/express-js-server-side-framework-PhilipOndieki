const express = require('express');
const Product = require('../models/products');
const auth = require('../middleware/auth');
const { validateCreate, validateUpdate } = require('../middleware/validator');
const { NotFoundError, BadRequestError } = require('../utils/customErrors');

const router = express.Router();

// All routes require API key
router.use(auth);

// GET /api/products - list with filters and pagination
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, inStock, minPrice, maxPrice } = req.query;
    const query = {};
    if (category) query.category = String(category).toLowerCase();
    if (inStock !== undefined) query.inStock = String(inStock) === 'true';
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const numericLimit = Math.min(Number(limit) || 10, 100);
    const numericPage = Math.max(Number(page) || 1, 1);

    const [items, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip((numericPage - 1) * numericLimit)
        .limit(numericLimit),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      page: numericPage,
      limit: numericLimit,
      total,
      items,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/search?q=term
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || String(q).trim().length < 2) {
      throw new BadRequestError('Query parameter "q" must be at least 2 characters');
    }
    const items = await Product.find({ $text: { $search: q } }).limit(50);
    res.json({ success: true, count: items.length, items });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/stats/category
router.get('/stats/category', async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, stats });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

// POST /api/products
router.post('/', validateCreate, async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id
router.put('/:id', validateUpdate, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) throw new NotFoundError('Product not found');
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


