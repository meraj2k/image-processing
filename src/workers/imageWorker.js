const Product = require('../models/product');
const Request = require('../models/request');
const { processImage } = require('../services/imageProcessingService');
const { Op } = require('sequelize');
const sequelize = require('../utils/db');

const processImages = async () => {
    const transaction = await sequelize.transaction();

    try {
        const requests = await Request.findAll({
            where: { id: { [Op.in]: sequelize.literal(`(SELECT DISTINCT(request_id) FROM Products WHERE status = 'Pending')`) } },
            order: [['createdAt', 'ASC']],
            transaction
        });

        for (let request of requests) {
            const request_id = request.id;

            request.status = 'Processing';
            await request.save({ transaction });

            const products = await Product.findAll({
                where: { request_id, status: 'Pending' },
                transaction
            });

            for (let product of products) {
                try {
                    product.status = 'Processing';
                    await product.save({ transaction });
                    console.log(`Processing requestId = ${request.id} and productId = ${product.serial_number}`)
                    const inputUrls = product.input_image_urls.split(',');
                    const outputUrls = [];
                    let count = 1;

                    for (const url of inputUrls) {
                        const outputUrl = await processImage(url.trim(), product.id, count);
                        count++;
                        outputUrls.push(outputUrl);
                    }

                    product.output_image_urls = outputUrls.join(',');
                    product.status = 'Completed';
                    await product.save({ transaction });

                } catch (error) {
                    product.status = 'Failed';
                    await product.save({ transaction });
                }
            }

            const remainingProducts = await Product.count({
                where: { request_id, status: { [Op.in]: ['Pending', 'Processing'] } },
                transaction
            });

            if (remainingProducts === 0) {
                request.status = 'Completed';
                await request.save({ transaction });
            }
        }

        await transaction.commit();
        console.log("Processing completed");
    } catch (error) {
        await transaction.rollback();
        console.error('Error processing images with transaction:', error);
        throw new Error(error);
    }
};


module.exports = {
    processImages
};
