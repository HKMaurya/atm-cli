const toLowerCase = (data) => {
    return data ? data.toLowerCase() : '';
};

const toUpperCase = (data) => {
    return data ? data.toUpperCase() : '';
};

const removeEmptySpace = (data) => {
    return data ? data.trim() : '';
};

const capitalizeFirstLetter = (string) => {
    string = toLowerCase(string);
    return toUpperCase(string.charAt(0)) + string.slice(1);
}

const checkValidAmount = (data) => {
    let isString = isNaN(data);
    if(isString) {
        return 'string'
    } else {
        let amt = parseFloat(data);
        if(amt > 0) {
            return amt
        } else {
            return 'validAmt'
        }
    }
}

module.exports = {
    capitalizeFirstLetter,
    removeEmptySpace,
    toLowerCase,
    checkValidAmount
}