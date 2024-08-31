const fs = require('fs');
const csv = require('csv-parser');
const { validateCSV } = require('./validationService');
const Request = require('../models/request');
const Product = require('../models/product');

const processCSV = async (filePath, requestId) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', async (data) => {
                if (validateCSV(data)) {
                    results.push({
                        request_id: requestId,
                        serial_number: data['Serial Number'],
                        product_name: data['Product Name'],
                        input_image_urls: data['Input Image Urls'],
                    });
                } else {
                    stream.destroy();
                    await Request.update({ status: 'Failed' }, { where: { id: requestId } });
                    return resolve(2);
                }
            })
            .on('end', async () => {
                try {
                    await Product.bulkCreate(results);
                    resolve(1);
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};

module.exports = {
    processCSV
}
