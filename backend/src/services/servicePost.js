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


module.exports = { Post }