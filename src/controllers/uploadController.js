const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const Request = require('../models/request');
const { sendSuccessResponse, sendErrorResponse } = require("../utils/utils");
const { processCSV } = require('../services/uploadService');

const upload = multer({ dest: 'uploads/' });

const uploadCSV = async (req, res) => {
    try {
        const requestId = uuidv4();

        const request = await Request.create({ id: requestId });

        const success = await processCSV(req.file.path,requestId);
        if (success == 1) {
            return sendSuccessResponse(res, { requestId });
        }
        return sendErrorResponse(res, 400, "Invalid CSV format");
    } catch (error) {
        return sendErrorResponse(res, 500, "" + error || error.message)
    }
};

module.exports = { upload, uploadCSV };
