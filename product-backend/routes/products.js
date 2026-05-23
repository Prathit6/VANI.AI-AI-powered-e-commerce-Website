import express from 'express';
import { Product } from '../models/Product.js';
import { Comment } from '../models/Comment.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import fuzzysort from 'fuzzysort';

const router = express.Router();

// ─── GET ALL PRODUCTS (with optional search) ──────────────────────────────────
router.get('/', async (req, res) => {
  const search = req.query.search;
  let products;

  if (search) {
    products = await Product.findAll();
    const searchProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      keywords: product.keywords.join(', ')
    }));
    const results = fuzzysort.go(search, searchProducts, {
      keys: ['name', 'keywords'],
      threshold: -500,
      all: true
    });
    products = results.map(result =>
      products.find(product => product.id === result.obj.id)
    );
  } else {
    products = await Product.findAll();
  }

  res.json(products);
});

// ─── GET SINGLE PRODUCT ───────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('GET product by id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── CREATE PRODUCT (called by seller dashboard frontend) ─────────────────────
// POST /api/products
// Body: { name, description, price, image, keywords[], stock }
// No auth required here — seller is already authenticated on port 5001.
// If you want to lock this down, add authMiddleware and check req.role === 'seller'.
router.post('/', async (req, res) => {
  try {
    const { name, description, price, image, keywords, stock } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'name and price are required' });
    }

    const product = await Product.create({
      name,
      description: description || '',
      price:       Number(price),
      image:       image || '',
      keywords:    Array.isArray(keywords) ? keywords : [],
      stock:       Number(stock) || 0,
      // rating defaults to whatever your model defines (usually 0 or null)
    });

    console.log(`✅ New product created by seller: "${name}" (id: ${product.id})`);
    res.status(201).json(product);
  } catch (err) {
    console.error('POST product error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── UPDATE PRODUCT ───────────────────────────────────────────────────────────
// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const { name, description, price, image, keywords, stock } = req.body;

    await product.update({
      ...(name        !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price       !== undefined && { price: Number(price) }),
      ...(image       !== undefined && { image }),
      ...(keywords    !== undefined && { keywords: Array.isArray(keywords) ? keywords : [] }),
      ...(stock       !== undefined && { stock: Number(stock) }),
    });

    console.log(`✅ Product updated: "${product.name}" (id: ${product.id})`);
    res.json(product);
  } catch (err) {
    console.error('PUT product error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE PRODUCT ───────────────────────────────────────────────────────────
// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const name = product.name;
    await product.destroy();

    console.log(`✅ Product deleted: "${name}" (id: ${req.params.id})`);
    res.status(204).send();
  } catch (err) {
    console.error('DELETE product error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET COMMENTS ─────────────────────────────────────────────────────────────
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { productId: req.params.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(comments);
  } catch (err) {
    console.error('GET comments error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST COMMENT (protected) ─────────────────────────────────────────────────
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const { rating, title, body, reviewerName } = req.body;
    const comment = await Comment.create({
      productId:    req.params.id,
      userId:       req.userId,
      reviewerName: reviewerName || 'Anonymous',
      rating:       rating || 5,
      title:        title || '',
      body:         body  || ''
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error('POST comment error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;