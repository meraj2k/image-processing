const sharp = require('sharp');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImageToCloudinary(imageBuffer, productId, imgNumber) {
    return new Promise((resolve, reject) => {
        try {
            cloudinary.uploader.upload_stream({
                folder: `uploads/images/${productId}/p-img-${imgNumber}.jpg`
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }).end(imageBuffer);;
        } catch (error) {
            console.log("Error while uploading to Cloudinary", error);
            reject(error);
        }
    });
}

const processImage = async (imageUrl, productId, imgNumber) => {
    try {
        const response = await axios({
            url: imageUrl,
            responseType: 'arraybuffer',
        });

        const compressedImage = await sharp(response.data)
            .jpeg({ quality: 50 })
            .toBuffer();

        const outputUrl = await uploadImageToCloudinary(compressedImage, productId, imgNumber);
        return outputUrl.secure_url;
    } catch (error) {
        console.log("error occured while uploading image", error)
        throw new Error(error);
    }

};

module.exports = {
    processImage
};
