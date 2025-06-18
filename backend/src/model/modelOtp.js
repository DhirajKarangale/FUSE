const db = require('./db');
const throwError = require('../utilities/throwError');
const statusCode = require('../utilities/statusCodes');
const messagesManager = require('../utilities/messagesManager');

async function SetOtp(email, otp) {
    const result = await db.query('SELECT id FROM otps WHERE email = $1', [email]);

    if (result.rows.length > 0) {
        await db.query(
            'UPDATE otps SET otp = $1, created_at = CURRENT_TIMESTAMP WHERE email = $2',
            [otp, email]
        );
    } else {
        await db.query(
            'INSERT INTO otps (email, otp) VALUES ($1, $2)',
            [email, otp]
        );
    }
}

async function VerifyOtp(email, otp) {
    const result = await db.query(
        'SELECT otp, created_at FROM otps WHERE email = $1',
        [email]
    );

    if (result.rows.length === 0) throwError(messagesManager.Error('otpEmailNotFound'), statusCode.NOT_FOUND);

    const { otp: storedOtp, created_at } = result.rows[0];

    const createdTime = new Date(created_at);
    const now = new Date();
    const diffInMinutes = (now - createdTime) / 1000 / 60;

    if (diffInMinutes > 5) throwError(messagesManager.Error('otpExpire'), statusCode.BAD_REQUEST);
    if (storedOtp !== otp) throwError(messagesManager.Error('otpInvalid'), statusCode.BAD_REQUEST);
}

module.exports = { SetOtp, VerifyOtp };