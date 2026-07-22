const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (filepath) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            filepath,
            {
                folder: 'products'
            },
            (error, result) => {
                if (error) return reject(error)
                resolve(result.secure_url)
            }
        )
    })
}

module.exports = uploadToCloudinary;