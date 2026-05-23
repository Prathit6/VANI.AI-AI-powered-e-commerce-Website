// controllers/authController.js
const adminModel  = require("../models/admin.model");
const userModel   = require("../models/user.model");
const sellerModel = require("../models/seller.model");
const { responseReturn } = require("../utils/response");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/tokenCreate");
const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

// ─── Multer: profile image uploads ───────────────────────────────────────────
const uploadDir = path.join(__dirname, "../uploads/profiles");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = `profile-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  },
});

const uploadProfileImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
}).single("image");

// ─── Helper: serialize Mongoose doc ──────────────────────────────────────────
function serializeUser(doc, role) {
  const obj   = doc.toObject ? doc.toObject() : { ...doc };
  const idStr = String(obj._id);
  delete obj.password;
  return {
    ...obj,
    _id:  idStr,
    id:   idStr,
    role: obj.role || role,
  };
}

// ─── Helper: get model by role ────────────────────────────────────────────────
function modelForRole(role) {
  if (role === "admin")  return adminModel;
  if (role === "seller") return sellerModel;
  return userModel;
}

class AuthController {

  // ─── ADMIN LOGIN ──────────────────────────────────────────────────────────
  admin_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await adminModel.findOne({ email }).select("+password");
      if (!admin) return responseReturn(res, 400, { error: "Email not found" });
      const match = await bcrypt.compare(password, admin.password);
      if (!match) return responseReturn(res, 400, { error: "Incorrect password" });
      const token = await createToken({ id: admin._id, role: "admin" });
      res.cookie("accessToken", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true, secure: false,
      });
      return responseReturn(res, 200, { token, message: "Login Success", userInfo: serializeUser(admin, "admin") });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // ─── USER REGISTER ────────────────────────────────────────────────────────
  user_register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const existing = await userModel.findOne({ email });
      if (existing) return responseReturn(res, 409, { error: "Email already registered" });
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userModel.create({ name: name.trim(), email: email.trim(), password: hashedPassword });
      const token = await createToken({ id: user._id, role: "user" });
      res.cookie("accessToken", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true, secure: false,
      });
      return responseReturn(res, 201, { token, message: "Registration successful", userInfo: serializeUser(user, "user") });
    } catch (error) {
      if (error.code === 11000) return responseReturn(res, 409, { error: "Email already registered" });
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // ─── USER LOGIN ───────────────────────────────────────────────────────────
  user_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await userModel.findOne({ email }).select("+password");
      if (!user) return responseReturn(res, 400, { error: "Email not found" });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return responseReturn(res, 400, { error: "Incorrect password" });
      const token = await createToken({ id: user._id, role: "user" });
      res.cookie("accessToken", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true, secure: false,
      });
      return responseReturn(res, 200, { token, message: "Login successful", userInfo: serializeUser(user, "user") });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // ─── SELLER REGISTER ──────────────────────────────────────────────────────
  seller_register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const existing = await sellerModel.findOne({ email });
      if (existing) return responseReturn(res, 409, { error: "Email already registered" });
      const hashedPassword = await bcrypt.hash(password, 10);
      const seller = await sellerModel.create({ name: name.trim(), email: email.trim(), password: hashedPassword });
      const token = await createToken({ id: seller._id, role: "seller" });
      res.cookie("accessToken", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true, secure: false,
      });
      return responseReturn(res, 201, {
        token,
        message: "Registration successful! Awaiting admin approval.",
        userInfo: serializeUser(seller, "seller"),
      });
    } catch (error) {
      if (error.code === 11000) return responseReturn(res, 409, { error: "Email already registered" });
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // ─── SELLER LOGIN ─────────────────────────────────────────────────────────
  seller_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const seller = await sellerModel.findOne({ email }).select("+password");
      if (!seller) return responseReturn(res, 400, { error: "Email not found" });
      const match = await bcrypt.compare(password, seller.password);
      if (!match) return responseReturn(res, 400, { error: "Incorrect password" });
      const token = await createToken({ id: seller._id, role: "seller" });
      res.cookie("accessToken", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true, secure: false,
      });
      return responseReturn(res, 200, { token, message: "Login successful", userInfo: serializeUser(seller, "seller") });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // ─── GET USER INFO ────────────────────────────────────────────────────────
  getUser = async (req, res) => {
    const { id, role } = req;
    try {
      const doc = await modelForRole(role).findById(id);
      if (!doc) return responseReturn(res, 404, { error: "User not found" });
      return responseReturn(res, 200, { userInfo: serializeUser(doc, role) });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // ─── USER LOGOUT ──────────────────────────────────────────────────────────
  user_logout = async (req, res) => {
    try {
      res.cookie("accessToken", "", { expires: new Date(Date.now()), httpOnly: true });
      return responseReturn(res, 200, { message: "Logout successful" });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // ─── UPDATE USER PROFILE ──────────────────────────────────────────────────
  // PUT /api/user/profile
  // Accepts multipart/form-data: name, email, location, phone, image (file)
  // Works for all roles: user / seller / admin
  updateUserProfile = async (req, res) => {
    const { id, role } = req;
    try {
      const { name, email, location, phone } = req.body;
      const Model = modelForRole(role);

      // Build update object — only set fields that were actually sent
      const updates = {};
      if (name  && name.trim())  updates.name     = name.trim();
      if (email && email.trim()) updates.email    = email.trim();
      if (typeof location !== "undefined") updates.location = location.trim();
      if (typeof phone    !== "undefined") updates.phone    = phone.trim();

      // If a new image was uploaded, save relative path
      if (req.file) {
        updates.image = `uploads/profiles/${req.file.filename}`;

        // Delete old profile image file if it's not the default
        const current = await Model.findById(id);
        if (
          current?.image &&
          current.image !== "user.png" &&
          current.image.startsWith("uploads/") &&
          current.image !== updates.image
        ) {
          const oldPath = path.join(__dirname, "..", current.image);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      const updated = await Model.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) return responseReturn(res, 404, { error: "User not found" });

      return responseReturn(res, 200, {
        userInfo: serializeUser(updated, role),
        message: "Profile updated successfully",
      });
    } catch (error) {
      if (error.code === 11000) return responseReturn(res, 409, { error: "Email already in use" });
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // ─── CHANGE PASSWORD ──────────────────────────────────────────────────────
  // PUT /api/user/password
  // Body: { oldPassword, newPassword }
  changePassword = async (req, res) => {
    const { id, role } = req;
    const { oldPassword, newPassword } = req.body;
    try {
      if (!oldPassword || !newPassword)
        return responseReturn(res, 400, { error: "Both oldPassword and newPassword are required" });
      if (newPassword.length < 6)
        return responseReturn(res, 400, { error: "New password must be at least 6 characters" });

      const Model = modelForRole(role);
      const doc   = await Model.findById(id).select("+password");
      if (!doc) return responseReturn(res, 404, { error: "User not found" });

      const match = await bcrypt.compare(oldPassword, doc.password);
      if (!match) return responseReturn(res, 400, { error: "Current password is incorrect" });

      doc.password = await bcrypt.hash(newPassword, 10);
      await doc.save();

      return responseReturn(res, 200, { message: "Password changed successfully" });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // ─── GET ALL SELLERS (Admin) ──────────────────────────────────────────────
  getSellers = async (req, res) => {
    try {
      const sellers    = await sellerModel.find({}).select("-password").sort({ createdAt: -1 });
      const serialized = sellers.map(s => serializeUser(s, "seller"));
      return responseReturn(res, 200, { sellers: serialized });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // ─── GET ALL USERS (Admin) ────────────────────────────────────────────────
  get_users = async (req, res) => {
    try {
      const users      = await userModel.find({}).select("-password").sort({ createdAt: -1 });
      const serialized = users.map(u => serializeUser(u, "user"));
      return responseReturn(res, 200, { users: serialized });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // ─── UPDATE SELLER STATUS ─────────────────────────────────────────────────
  updateSellerStatus = async (req, res) => {
    const { sellerId, status } = req.body;
    try {
      await sellerModel.findByIdAndUpdate(sellerId, { status });
      const seller = await sellerModel.findById(sellerId).select("-password");
      return responseReturn(res, 200, {
        seller: serializeUser(seller, "seller"),
        message: `Seller ${status} successfully`,
      });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // ─── UPDATE SELLER STATUS BY PARAM ID ────────────────────────────────────
  updateSellerStatusById = async (req, res) => {
    const { id }     = req.params;
    const { status } = req.body;
    try {
      await sellerModel.findByIdAndUpdate(id, { status });
      const seller = await sellerModel.findById(id).select("-password");
      return responseReturn(res, 200, {
        seller: serializeUser(seller, "seller"),
        message: `Seller ${status} successfully`,
      });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // ─── GET ADMIN INFO ───────────────────────────────────────────────────────
  get_admin_info = async (req, res) => {
    try {
      const admin = await adminModel.findOne({ role: "admin" });
      if (!admin) return responseReturn(res, 404, { error: "Admin not found" });
      return responseReturn(res, 200, { adminId: String(admin._id) });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };
}

const authControllerInstance = new AuthController();

module.exports = authControllerInstance;
module.exports.uploadProfileImage = uploadProfileImage;