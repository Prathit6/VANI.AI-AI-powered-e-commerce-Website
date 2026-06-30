// routes/reviewRoute.js
const router   = require("express").Router();
const multer   = require("multer");
const path     = require("path");
const fs       = require("fs");
const { authMiddleware } = require("../middlewares/authMiddleware");
const Review   = require("../models/review.model");
const { responseReturn } = require("../utils/response");

// ── Multer: save review images to /uploads/reviews/ ──────────────────────────
const uploadDir = path.join(__dirname, "../uploads/reviews");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = `review-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// ── GET all reviews (public) ──────────────────────────────────────────────────
router.get("/reviews", async (_req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    return responseReturn(res, 200, { reviews });
  } catch (error) {
    return responseReturn(res, 500, { error: error.message });
  }
});

// ── POST a new review (protected) ────────────────────────────────────────────
router.post("/reviews", authMiddleware, upload.single("image"), async (req, res) => {
  const { title, comment, rating } = req.body;
  const { id, role } = req;

  if (!comment || !rating)
    return responseReturn(res, 400, { error: "comment and rating are required" });

  try {
    // Resolve user name from the right model
    let userDoc;
    if (role === "admin") {
      userDoc = await require("../models/admin.model").findById(id);
    } else if (role === "seller") {
      userDoc = await require("../models/seller.model").findById(id);
    } else {
      userDoc = await require("../models/user.model").findById(id);
    }
    if (!userDoc) return responseReturn(res, 404, { error: "User not found" });

    // Build image path (relative URL served statically)
    const userImage = req.file
      ? `uploads/reviews/${req.file.filename}`
      : userDoc.image || "";

    const review = await Review.create({
      userId:    String(id),
      userName:  userDoc.name,
      userRole:  role,
      userImage,
      title:   (title   || "").trim(),
      comment: comment.trim(),
      rating:  Number(rating),
    });

    return responseReturn(res, 201, { review, message: "Review posted!" });
  } catch (error) {
    return responseReturn(res, 500, { error: error.message });
  }
});

// ── DELETE a review (admin or own review) ────────────────────────────────────
router.delete("/reviews/:reviewId", authMiddleware, async (req, res) => {
  const { reviewId } = req.params;
  const { id, role } = req;
  try {
    const review = await Review.findById(reviewId);
    if (!review) return responseReturn(res, 404, { error: "Review not found" });
    if (role !== "admin" && String(review.userId) !== String(id))
      return responseReturn(res, 403, { error: "Not authorized" });

    // Delete the uploaded image file too
    if (review.userImage && review.userImage.startsWith("uploads/reviews/")) {
      const filePath = path.join(__dirname, "..", review.userImage);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await review.deleteOne();
    return responseReturn(res, 200, { message: "Review deleted" });
  } catch (error) {
    return responseReturn(res, 500, { error: error.message });
  }
});

module.exports = router;