
const errorMessages = {
    400: 'The request was invalid or malformed.',
    401: 'Authentication is required to access this resource.',
    403: 'You do not have permission to access this resource.',
    404: 'The requested resource was not found.',
    500: 'An internal server error occurred.',
};

const sendErrorResponse = (res, statusCode = 500, message) => {

    const errorMessage = message || errorMessages[statusCode] || errorMessages[500];

    return res.status(statusCode).json({
        success: false,
        error: {
            code: statusCode,
            message: errorMessage
        }
    });
};

const sendSuccessResponse = (res, data, message = 'Request was successful') => {
    return res.status(200).json({
        success: true,
        message: message,
        data: data
    });
};

module.exports = {
    sendErrorResponse,
    sendSuccessResponse,
}