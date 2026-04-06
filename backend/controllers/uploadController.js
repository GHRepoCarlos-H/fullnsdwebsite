const cloudinary = require("../config/cloudinary");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;
    const base64String = fileBuffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64String}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "northstar-products",
    });

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("uploadImage error:", error);
    return res.status(500).json({ message: "Error uploading image" });
  }
};