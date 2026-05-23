const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },        // in cents (priceCents)
  image: { type: String, default: '' },
  images: [{ type: String }],
  category: { type: String, default: '' },
  keywords: [{ type: String }],
  rating: {
    stars: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  stock: { type: Number, default: 0 },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sellers',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'    // Admin approve karega
  }
}, { timestamps: true });

module.exports = mongoose.model('products', productSchema);
