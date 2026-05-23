// routes/authRoute.js
const authControllers    = require('../controllers/authController');
const { uploadProfileImage } = require('../controllers/authController');
const router             = require('express').Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const productController  = require('../controllers/productController');

// ─── Admin Auth ───────────────────────────────────────────────────────────────
router.post('/admin-login', authControllers.admin_login);

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/products', productController.get_all_products);

// ─── User Auth ────────────────────────────────────────────────────────────────
router.post('/user-register', authControllers.user_register);
router.post('/user-login',    authControllers.user_login);
router.get('/user-logout',    authControllers.user_logout);

// ─── Seller Auth ──────────────────────────────────────────────────────────────
router.post('/seller-register', authControllers.seller_register);
router.post('/seller-login',    authControllers.seller_login);

// ─── Protected: get current logged-in user ────────────────────────────────────
router.get('/get-user', authMiddleware, authControllers.getUser);

// ─── Profile update (all roles: user, seller, admin) ─────────────────────────
// PUT /api/user/profile — multipart/form-data: name, email, location, phone, image
router.put(
  '/user/profile',
  authMiddleware,
  uploadProfileImage,          // multer middleware — parses multipart, saves file
  authControllers.updateUserProfile
);

// ─── Change password (all roles) ─────────────────────────────────────────────
// PUT /api/user/password — JSON: { oldPassword, newPassword }
router.put('/user/password', authMiddleware, authControllers.changePassword);

// ─── Seller: product management ───────────────────────────────────────────────
router.post('/seller/product',          authMiddleware, productController.add_product);
router.get('/seller/products',          authMiddleware, productController.get_my_products);
router.put('/seller/product/:productId', authMiddleware, productController.update_product);
router.delete('/seller/product/:productId', authMiddleware, productController.delete_product);

// ─── Admin: product management ────────────────────────────────────────────────
router.post('/admin/product-status',     authMiddleware, productController.update_product_status);
router.get('/admin/products',            authMiddleware, productController.get_all_products_admin);
router.put('/admin/product/:id/status',  authMiddleware, productController.updateProductStatusById);

// ─── Admin: seller & user management ─────────────────────────────────────────
router.get('/admin/sellers',              authMiddleware, authControllers.getSellers);
router.post('/admin/seller-status',       authMiddleware, authControllers.updateSellerStatus);
router.put('/admin/seller/:id/status',    authMiddleware, authControllers.updateSellerStatusById);
router.get('/admin/users',               authMiddleware, authControllers.get_users);

// ─── Admin info (used by seller chat to get adminId) ─────────────────────────
router.get('/admin/info', authMiddleware, authControllers.get_admin_info);

module.exports = router;