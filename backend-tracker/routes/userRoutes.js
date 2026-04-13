const express = require("express");
const {
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/userController");

const { uploadAvatar } = require("../controllers/uploadController");
const { protect } = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/upload");

const router = express.Router();

router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);
router.delete("/account", protect, deleteAccount);

// ✅ IMAGE UPLOAD (WORKING)
router.put(
  "/avatar",
  protect,
  upload.single("avatar"),
  uploadAvatar
);

module.exports = router;
