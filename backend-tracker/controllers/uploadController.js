const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "expense_tracker/users" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    // delete old avatar if exists
    if (req.user.avatar?.public_id) {
      await cloudinary.uploader.destroy(req.user.avatar.public_id);
    }

    req.user.avatar = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    await req.user.save();

    res.json({
      success: true,
      avatar: req.user.avatar,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Image upload failed" });
  }
};

module.exports = { uploadAvatar };
