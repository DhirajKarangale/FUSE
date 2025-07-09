const modelPost = require('../model/modelPost');
const categories = require('../config/categories.json');

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


async function GetUserPosts(userId, page) {
    validator.ID(userId);

    const pageSize = 10;
    const pageNumber = parseInt(page);
    const validPage = isNaN(pageNumber) || pageNumber <= 1 ? 0 : pageNumber - 1;

    return await modelPost.GetUserPosts(userId, validPage, pageSize);
}

async function GetCategoriesPosts(userCategories, page) {
    if (userCategories) {
        if (typeof userCategories === 'string') {
            try {
                userCategories = JSON.parse(userCategories);
                if (userCategories.length == 0) userCategories = Object.values(categories).flat();
            } catch (e) {
                throwError(messagesManager.Error("categoriesArray"), statusCode.BAD_REQUEST);
            }
        }

        if (!Array.isArray(userCategories)) throwError(messagesManager.Error("categoriesArray"), statusCode.BAD_REQUEST);
        userCategories.forEach(category => validator.Category(category));
    }
    else {
        userCategories = Object.values(categories).flat();
    }

    const pageSize = 10;
    const pageNumber = parseInt(page);
    const validPage = isNaN(pageNumber) || pageNumber <= 1 ? 0 : pageNumber - 1;

    return await modelPost.GetCategoriesPosts(userCategories, validPage, pageSize);
}


module.exports = { Post, GetUserPosts, GetCategoriesPosts }