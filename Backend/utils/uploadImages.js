// const { v2: cloudinary } = require('cloudinary');

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET_KEY
// });

// const uploadToCloudinary = async (file, folder) => {
//     try {
//         const result = await cloudinary.uploader.upload(file.path, {
//             folder,
//             resource_type: "auto" // auto handles images, pdfs, docs etc.
//         });
//         return result.secure_url; // ✅ Cloudinary URL
//     } catch (err) {
//         console.error("Cloudinary Upload Error:", err);
//         throw err;
//     }
// };

// module.exports = { uploadToCloudinary };

const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY
});

// Single image upload
const uploadImage = async (file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: "image"
    });
    return result.secure_url; // ✅ proper image URL
  } catch (err) {
    console.error("Cloudinary Image Upload Error:", err);
    throw err;
  }
};

// Multiple image upload
const uploadMultipleImages = async (files, folder) => {
  try {
    const results = await Promise.all(
      files.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder,
          resource_type: "image"
        })
      )
    );
    return results.map(r => r.secure_url);
  } catch (err) {
    console.error("Cloudinary Multiple Image Upload Error:", err);
    throw err;
  }
};
const uploadPDF = async (file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: "raw",
      type: "upload",
      access_mode: "public",  // ✅ force public accessibility
      use_filename: true,
      unique_filename: false,
    });

    console.log("PDF uploaded:", result);
    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary PDF Upload Error:", err);
    throw err;
  }
};


module.exports = { uploadImage, uploadMultipleImages, uploadPDF };

