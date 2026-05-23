import express from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { DeliveryOption } from '../models/DeliveryOption.js';
import { CartItem } from '../models/CartItem.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All order routes require login
router.use(authMiddleware);

// GET /api/orders  — this user's orders only
router.get('/', async (req, res) => {
  const expand = req.query.expand;

  let orders = await Order.findAll({
    where: { userId: req.userId },
    order: [['orderTimeMs', 'DESC']]
  });

  if (expand === 'products') {
    orders = await Promise.all(orders.map(async (order) => {
      const products = await Promise.all(order.products.map(async (p) => {
        const productDetails = await Product.findByPk(p.productId);
        return { ...p, product: productDetails };
      }));
      return { ...order.toJSON(), products };
    }));
  }

  res.json(orders);
});

// POST /api/orders  — place order from this user's cart
router.post('/', async (req, res) => {
  const cartItems = await CartItem.findAll({ where: { userId: req.userId } });

  if (cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  let totalCostCents = 0;

  const products = await Promise.all(cartItems.map(async (item) => {
    const product = await Product.findByPk(item.productId);
    if (!product) throw new Error(`Product not found: ${item.productId}`);

    const deliveryOption = await DeliveryOption.findByPk(item.deliveryOptionId);
    if (!deliveryOption) throw new Error(`Invalid delivery option: ${item.deliveryOptionId}`);

    totalCostCents += product.priceCents * item.quantity + deliveryOption.priceCents;

    const estimatedDeliveryTimeMs =
      Date.now() + deliveryOption.deliveryDays * 24 * 60 * 60 * 1000;

    return {
      productId: item.productId,
      quantity: item.quantity,
      estimatedDeliveryTimeMs
    };
  }));

  // Add 10% tax
  totalCostCents = Math.round(totalCostCents * 1.1);

  const order = await Order.create({
    userId: req.userId,
    orderTimeMs: Date.now(),
    totalCostCents,
    products
  });

  // Clear only this user's cart
  await CartItem.destroy({ where: { userId: req.userId } });

  res.status(201).json(order);
});

// GET /api/orders/:orderId
router.get('/:orderId', async (req, res) => {
  const expand = req.query.expand;

  let order = await Order.findOne({
    where: { id: req.params.orderId, userId: req.userId }
  });

  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (expand === 'products') {
    const products = await Promise.all(order.products.map(async (p) => {
      const productDetails = await Product.findByPk(p.productId);
      return { ...p, product: productDetails };
    }));
    order = { ...order.toJSON(), products };
  }

  res.json(order);
});

export default router;
