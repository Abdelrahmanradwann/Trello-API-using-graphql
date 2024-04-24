

function errorHandle(data, code) {
    const error = new Error(data);
    error.code = code;
    return error;
}
module.exports = {
    errorHandle
}