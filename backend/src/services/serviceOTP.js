const nodemailer = require('nodemailer');
const modelOtp = require('../model/modelOtp');
const validator = require('../utilities/validator');
const throwError = require('../utilities/throwError');
const statusCode = require('../utilities/statusCodes');
const messagesManager = require('../utilities/messagesManager');
const { emailContent } = require('../utilities/emailContent');
require('dotenv').config();

function GenerateOTP(length) {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}

async function SendMail(email, otp, type) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.Email,
            pass: process.env.EMAILPASS
        }
    });

    const { subject, body } = emailContent(otp, type);

    const mailOptions = {
        from: `"ChangeXel" <${process.env.Email}>`,
        to: email,
        subject: subject,
        html: body,
    };

    try {
        await transporter.sendMail(mailOptions);
        return messagesManager.Success('otpSent');
    } catch (error) {
        throw throwError(messagesManager.Error('otpSent'), statusCode.SERVICE_UNAVAILABLE);
    }
}

async function GetOtp(email, type) {
    validator.Email(email);
    const otp = GenerateOTP(4);
    await modelOtp.SetOtp(email, otp)
    return await SendMail(email, otp, type);
}

async function VerifyOtp(email, otp) {
    validator.Email(email);
    validator.OTP(otp);
    await modelOtp.VerifyOtp(email, otp) 
    return "OTP verifyed";
}

module.exports = { GetOtp, VerifyOtp };