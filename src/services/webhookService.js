const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { Op } = require('sequelize');
const { createObjectCsvWriter } = require('csv-writer');
const Product = require('../models/product');
const Request = require('../models/request');


const triggerWebhook = async () => {
    try {
        const requests = await Request.findAll({
            where: { is_webhook_sent: false, status: { [Op.notIn]: ['Pending', 'Processing'] } },
            order: [['createdAt', 'ASC']],
        });
        console.log(requests.length)

        for (let request of requests) {
            try {
                const requestId = request.id;

                const remainingProducts = await Product.count({
                    where: { request_id: requestId, status: { [Op.in]: ['Pending', 'Processing'] } },
                });

                if (remainingProducts) {
                    continue;
                }

                const products = await Product.findAll({
                    where: { request_id: requestId, status: { [Op.notIn]: ['Pending', 'Processing'] } },
                });

                const csvWriter = createObjectCsvWriter({
                    path: 'products.csv',
                    header: [
                        { id: 'serial_number', title: 'Serial Number' },
                        { id: 'product_name', title: 'Product Name' },
                        { id: 'input_image_urls', title: 'Input Image URLs' },
                        { id: 'output_image_urls', title: 'Output Image URLs' },
                    ],
                });

                const records = products.map(product => ({
                    serial_number: product.serial_number,
                    product_name: product.product_name,
                    input_image_urls: product.input_image_urls,
                    output_image_urls: product.output_image_urls,
                }));
                console.log("dxdx",records)
                await csvWriter.writeRecords(records);
                const form = new FormData();

                form.append('file', fs.createReadStream('products.csv'));
                form.append('data', JSON.stringify(records));

                const response = await axios.post(process.env.WEBHOOK_URL, form, {
                    headers: {
                        ...form.getHeaders(),
                    },
                });
                if (response.status === 200) {
                    request.is_webhook_sent = true;
                    await request.save();
                    console.log('Webhook sent successfully.');
                } else {
                    console.error('Failed to send webhook.');
                }
            } catch (error) {
                console.log("Webhook service failed at", request.id)
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

module.exports = {
    triggerWebhook
};


module.exports = { triggerWebhook };
