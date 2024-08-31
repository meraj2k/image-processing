const validateCSV = (row) => {
    const requiredColumns = ['Serial Number', 'Product Name', 'Input Image Urls'];

    for (const column of requiredColumns) {
        if (!row[column]) {
            return false;
        }
    }

    if (!validateSerialNumber(row['Serial Number'])) {
        return false;
    }
    if (!validateProductName(row['Product Name'])) {
        return false;
    }
    if (!validateImageUrls(row['Input Image Urls'])) {
        return false;
    }

    return true;
};


const validateSerialNumber = (serialNumber) => {
    return typeof serialNumber === 'string' && serialNumber.trim().length > 0;
};

const validateProductName = (productName) => {
    return typeof productName === 'string' && productName.trim().length > 0;
};


const validateImageUrls = (urls) => {
    if (typeof urls !== 'string' || urls.trim().length === 0) {
        return false;
    }

    const urlArray = urls.split(',').map(url => url.trim());
    const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;

    for (const url of urlArray) {
        if (!urlPattern.test(url)) {
            return false;
        }
    }
    return true;
};

module.exports = {
    validateCSV
};

