import express from 'express';
import { CartItem } from '../models/CartItem.js';
import { Product } from '../models/Product.js';
import { DeliveryOption } from '../models/DeliveryOption.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// GET /api/cart-items
router.get('/', async (req, res) => {
  try {
    const expand = req.query.expand;
    const cartItems = await CartItem.findAll({
      where: { userId: req.userId }
    });

    if (expand === 'product') {
      const itemsWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await Product.findByPk(item.productId);
          return {
            ...item.toJSON(),
            product: product ? product.toJSON() : null,
          };
        })
      );
      return res.json(itemsWithProducts);
    }

    res.json(cartItems);
  } catch (err) {
    console.error('GET cart-items error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cart-items
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, deliveryOptionId } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const deliveryOption = await DeliveryOption.findByPk(deliveryOptionId);
    if (!deliveryOption) return res.status(404).json({ error: 'Invalid delivery option' });

    const existing = await CartItem.findOne({
      where: { userId: req.userId, productId }
    });

    if (existing) {
      existing.quantity += quantity;
      existing.deliveryOptionId = deliveryOptionId;
      await existing.save();
      return res.json(existing);
    }

    const item = await CartItem.create({
      userId: req.userId,
      productId,
      quantity,
      deliveryOptionId
    });

    res.status(201).json(item);
  } catch (err) {
    console.error('POST cart-items error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/cart-items/:id
router.patch('/:id', async (req, res) => {
  try {
    const item = await CartItem.findOne({
      where: { id: req.params.id, userId: req.userId }
    });
    if (!item) return res.status(404).json({ error: 'Cart item not found' });

    const { quantity, deliveryOptionId } = req.body;
    if (quantity !== undefined) item.quantity = quantity;
    if (deliveryOptionId !== undefined) item.deliveryOptionId = deliveryOptionId;
    await item.save();

    res.json(item);
  } catch (err) {
    console.error('PATCH cart-items error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cart-items/:id
router.delete('/:id', async (req, res) => {
  try {
    const item = await CartItem.findOne({
      where: { id: req.params.id, userId: req.userId }
    });
    if (!item) return res.status(404).json({ error: 'Cart item not found' });

    await item.destroy();
    res.status(204).send();
  } catch (err) {
    console.error('DELETE cart-items error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cart-items — clear entire cart
router.delete('/', async (req, res) => {
  try {
    await CartItem.destroy({ where: { userId: req.userId } });
    res.status(204).send();
  } catch (err) {
    console.error('DELETE all cart-items error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
