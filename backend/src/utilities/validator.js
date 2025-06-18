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
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidV4Regex.test(id)) errorThrow(messagesManager.Error('idInvalid'), statusCode.BAD_REQUEST);
}

function About(about) {
    if (about == null && about.length < 5) errorThrow(messagesManager.Error('aboutInvalid'), statusCode.BAD_REQUEST);
}

module.exports = { Email, OTP, ID, About };