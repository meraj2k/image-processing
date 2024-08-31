const Request = require('../models/request');
const Product = require('../models/product');
const { sendErrorResponse, sendSuccessResponse } = require('../utils/utils');

const checkStatus = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await Request.findByPk(requestId, {
            include: Product,
        });

        if (!request) {
            return sendErrorResponse(res, 404, 'Request not found');
        }

        return sendSuccessResponse(res, {
            status: request.status,
            products: request.Products.map((product) => ({
                serial_number: product.serial_number,
                product_name: product.product_name,
                input_image_urls: product.input_image_urls,
                output_image_urls: product.output_image_urls,
                status: product.status,
            })),
        })
    } catch (error) {
        return sendErrorResponse(res, 500, "" + error || error.message)
    }
};

module.exports = {
    checkStatus,
};
