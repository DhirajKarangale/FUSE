const modelComment = require('../model/modelComment');

const throwError = require('../utilities/throwError');
const statusCode = require('../utilities/statusCodes');
const validator = require('../utilities/validator');
const messagesManager = require('../utilities/messagesManager');

async function Get(postId, page) {
    validator.ID(postId);

    const pageSize = 10;
    const pageNumber = parseInt(page);
    const validPage = isNaN(pageNumber) || pageNumber <= 1 ? 0 : pageNumber - 1;

    return await modelComment.Get(postId, validPage, pageSize);
}


async function Add(userId, body) {
    validator.ID(userId);
    validator.ID(body.postId);
    validator.Comment(body.comment);

    await modelComment.Add(userId, body.postId, body.comment);
}

async function Delete(postId) {

}


module.exports = { Get, Add, Delete };