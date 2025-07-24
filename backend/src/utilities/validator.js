const errorThrow = require('./throwError');
const statusCode = require('../utilities/statusCodes');
const categories = require('../config/categories.json');
const messagesManager = require('../utilities/messagesManager');

function Email(email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errorThrow(messagesManager.Error('emailInvalid'), statusCode.BAD_REQUEST);
}

function OTP(otp) {
    if (!/^\d{6}$/.test(String(otp))) errorThrow(messagesManager.Error('otpInvalid'), statusCode.BAD_REQUEST);
}

function ID(id) {
    const pattern = /^[1-9][0-9]*$/;
    if (!pattern.test(id)) errorThrow(messagesManager.Error('idInvalid'), statusCode.BAD_REQUEST);
}

function Username(username) {
    if (username.length < 2) errorThrow(messagesManager.Error('userNameLess'), statusCode.BAD_REQUEST);
    if (username.length > 20) errorThrow(messagesManager.Error('userNameMore'), statusCode.BAD_REQUEST);
}

function URL(url) {
    const pattern = /^(https?:\/\/)?([a-z\d-]+\.)+[a-z]{2,6}(:\d{1,5})?(\/.*)?$/i;
    if (!pattern.test(url)) errorThrow(messagesManager.Error('urlInvalid'), statusCode.BAD_REQUEST);
}

function About(about) {
    if (about.length < 5) errorThrow(messagesManager.Error('aboutInvalidLess'), statusCode.BAD_REQUEST);
    else if (about.length > 500) errorThrow(messagesManager.Error('aboutInvalidLarge'), statusCode.BAD_REQUEST);
}

function Category(category) {
    const normalize = str => str.replace(/\s+/g, '').toLowerCase();

    const normalizedInput = normalize(category);

    const isValid = Object.values(categories).some(subcategories =>
        subcategories.some(sub => normalize(sub) === normalizedInput)
    );

    if (!isValid) {
        errorThrow(messagesManager.Error('categoryInvalid'), statusCode.BAD_REQUEST);
    }
}

function PostTitle(postTitle) {
    if (typeof postTitle !== 'string' || postTitle.trim().length < 5) {
        errorThrow(messagesManager.Error('postTitleShort'), statusCode.BAD_REQUEST);
    }

    if (postTitle.trim().length > 250) {
        errorThrow(messagesManager.Error('postTitleLong'), statusCode.BAD_REQUEST);
    }
}

function PostBody(postBody) {
    if (typeof postBody !== 'string' || postBody.trim().length < 20) {
        errorThrow(messagesManager.Error('postBodyShort'), statusCode.BAD_REQUEST);
    }

    if (postBody.trim().length > 10000) {
        errorThrow(messagesManager.Error('postBodyLong'), statusCode.BAD_REQUEST);
    }
}

function Comment(Comment) {
    if (typeof Comment !== 'string' || Comment.trim().length < 1) {
        errorThrow(messagesManager.Error('commentShort'), statusCode.BAD_REQUEST);
    }

    if (Comment.trim().length > 500) {
        errorThrow(messagesManager.Error('commentLong'), statusCode.BAD_REQUEST);
    }
}

module.exports = { Email, OTP, ID, Username, About, URL, Category, PostTitle, PostBody, Comment };