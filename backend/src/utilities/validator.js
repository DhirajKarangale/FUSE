const errorThrow = require('./throwError');
const statusCode = require('../utilities/statusCodes');
const messagesManager = require('../utilities/messagesManager');

function Email(email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errorThrow(messagesManager.Error('emailInvalid'), statusCode.BAD_REQUEST);
}

function OTP(otp) {
    if (!/^\d{4}$/.test(String(otp))) errorThrow(messagesManager.Error('otpInvalid'), statusCode.BAD_REQUEST);
}

function ID(id) {
    const pattern = /^[1-9][0-9]*$/;
    if (!pattern.test(id)) errorThrow(messagesManager.Error('idInvalid'), statusCode.BAD_REQUEST);
}

function Username(username) {
    if (username.length < 3) errorThrow(messagesManager.Error('userNameLess'), statusCode.BAD_REQUEST);
}

function URL(url) {
    const pattern = /^(https?:\/\/)?([a-z\d-]+\.)+[a-z]{2,6}(:\d{1,5})?(\/.*)?$/i;
    if (!pattern.test(url)) errorThrow(messagesManager.Error('urlInvalid'), statusCode.BAD_REQUEST);
}

function About(about) {
    if (about.length < 5) errorThrow(messagesManager.Error('aboutInvalidLess'), statusCode.BAD_REQUEST);
    else if (about.length > 300) errorThrow(messagesManager.Error('aboutInvalidLarge'), statusCode.BAD_REQUEST);
}

function Category(category) {
    // check if categoty present
}

module.exports = { Email, OTP, ID, Username, About, URL, Category };