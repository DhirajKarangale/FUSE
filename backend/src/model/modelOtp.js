const db = require('./db');

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

    return result.rows[0];
}

module.exports = { SetOtp, VerifyOtp };