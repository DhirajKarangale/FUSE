const modelPost = require('../model/modelPost');

const validator = require('../utilities/validator');
const throwError = require('../utilities/throwError');
const statusCode = require('../utilities/statusCodes');
const messagesManager = require('../utilities/messagesManager');

async function Post(id, body) {
    validator.ID(id);
    validator.Category(body.category);
    validator.URL(body.mediaURL);
    validator.PostTitle(body.postTitle);
    validator.PostBody(body.postBody);

    await modelPost.Post(id, body.postTitle, body.postBody, body.mediaURL, body.category);

    return messagesManager.Success('postAdded');
}


async function GetUserPost(userId, page) {
    validator.ID(userId);

    const pageSize = 10;
    const pageNumber = parseInt(page);
    const validPage = isNaN(pageNumber) || pageNumber <= 1 ? 0 : pageNumber - 1;

    return await modelPost.GetUserPost(userId, validPage, pageSize);
}


module.exports = { Post, GetUserPost }