const fs = require('fs');
const path = require('path');

let cloudinary = null;
try {
  cloudinary = require('cloudinary').v2;
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }
} catch (e) {
  // Cloudinary module not loaded, fallback to local disk storage
  cloudinary = null;
}

// @desc Upload file (Category, Profile, Gallery, Service Image)
// @route POST /api/upload
exports.uploadFile = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      if (req.body && req.body.url) {
        return res.json({ url: req.body.url });
      }
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.files.image || req.files.file || Object.values(req.files)[0];

    // Check if Cloudinary is configured and loaded
    if (cloudinary && process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        const tempPath = file.tempFilePath || file.path;
        if (tempPath) {
          const result = await cloudinary.uploader.upload(tempPath, { folder: 'local_service_finder' });
          return res.json({ url: result.secure_url, public_id: result.public_id });
        } else if (file.data) {
          const uploadFromBuffer = (buffer) => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: 'local_service_finder' },
                (error, result) => {
                  if (result) resolve(result);
                  else reject(error);
                }
              );
              stream.end(buffer);
            });
          };
          const result = await uploadFromBuffer(file.data);
          return res.json({ url: result.secure_url, public_id: result.public_id });
        }
      } catch (cloudErr) {
        console.warn('Cloudinary upload fallback to local storage:', cloudErr.message);
      }
    }

    // Fallback: Local Disk Storage
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.name) || '.jpg';
    const fileName = `img_${Date.now()}_${Math.floor(Math.random() * 1000)}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await file.mv(filePath);
    const fileUrl = `/uploads/${fileName}`;

    res.json({ url: fileUrl, fileName });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
