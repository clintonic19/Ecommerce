const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

// Configure Multer for file uploads

const storage = multer.memoryStorage();
//
const upload = multer({ storage });

const handleImageUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(buffer);
  });
};

// const storage = new multer.memoryStorage(); // Store files in memory for processing

// async function handleImageUpload(file){
//     try{
//         const result = await cloudinary.uploader.upload(req.file.path, {
//             resource_type: 'auto', // Automatically detect the file type
//         })
//         return result;
//     }catch(error){
//         console.log("Unable to Upload Image", error)
//         throw error;
//     }
// };

// const upload = multer({ storage });

module.exports = { upload, handleImageUpload };
