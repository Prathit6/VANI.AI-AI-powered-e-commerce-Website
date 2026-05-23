const productModel = require('../models/product.model');
const { responseReturn } = require('../utils/response');

class ProductController {

  // Seller: apne products add karo
  add_product = async (req, res) => {
    const sellerId = req.id;  // JWT se aata hai
    const { name, description, price, image, category, keywords, stock } = req.body;
    try {
      const product = await productModel.create({
        name, description, price, image, category,
        keywords: keywords || [],
        stock: stock || 0,
        sellerId,
        status: 'pending'
      });
      return responseReturn(res, 201, { product, message: 'Product added — pending admin approval' });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // ─── UPDATE PRODUCT STATUS BY PARAM ID ───────────────────────────────────────
updateProductStatusById = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const product = await productModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!product) return responseReturn(res, 404, { error: 'Product not found' });
    return responseReturn(res, 200, {
      product,
      message: `Product ${status} successfully`,
    });
  } catch (error) {
    return responseReturn(res, 500, { error: error.message });
  }
};

  // Seller: apne saare products dekho
  get_my_products = async (req, res) => {
    const sellerId = req.id;
    try {
      const products = await productModel.find({ sellerId }).sort({ createdAt: -1 });
      return responseReturn(res, 200, { products });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // Seller: product update karo
  update_product = async (req, res) => {
    const sellerId = req.id;
    const { productId } = req.params;
    try {
      const product = await productModel.findOne({ _id: productId, sellerId });
      if (!product) return responseReturn(res, 404, { error: 'Product not found' });
      const updated = await productModel.findByIdAndUpdate(productId, req.body, { new: true });
      return responseReturn(res, 200, { product: updated, message: 'Product updated' });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // Seller: product delete karo
  delete_product = async (req, res) => {
    const sellerId = req.id;
    const { productId } = req.params;
    try {
      const product = await productModel.findOne({ _id: productId, sellerId });
      if (!product) return responseReturn(res, 404, { error: 'Product not found' });
      await productModel.findByIdAndDelete(productId);
      return responseReturn(res, 200, { message: 'Product deleted' });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // Public: saare active products
  get_all_products = async (req, res) => {
    try {
      const products = await productModel
        .find({ status: 'active' })
        .populate('sellerId', 'name shopInfo')
        .sort({ createdAt: -1 });
      return responseReturn(res, 200, { products });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // Admin: kisi bhi product ka status change karo
  update_product_status = async (req, res) => {
    const { productId, status } = req.body;
    try {
      const product = await productModel.findByIdAndUpdate(productId, { status }, { new: true });
      return responseReturn(res, 200, { product, message: `Product ${status}` });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // Admin: saare products dekho (including pending)
  get_all_products_admin = async (req, res) => {
    try {
      const products = await productModel.find({}).populate('sellerId', 'name shopInfo').sort({ createdAt: -1 });
      return responseReturn(res, 200, { products });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new ProductController();
