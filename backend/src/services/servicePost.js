const modelPost = require('../model/modelPost');
const categories = require('../config/categories.json');

const validator = require('../utilities/validator');
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

    let postCategories;

    if (userCategories) {
        postCategories = userCategories?.split(",");
        if (postCategories.length == 0) postCategories = Object.values(categories).flat();
        else postCategories.forEach(category => validator.Category(category));
    }
    else {
        postCategories = Object.values(categories).flat();
    }

    const pageSize = 10;
    const pageNumber = parseInt(page);
    const validPage = isNaN(pageNumber) || pageNumber <= 1 ? 0 : pageNumber - 1;

    return await modelPost.GetCategoriesPosts(postCategories, validPage, pageSize);
}


module.exports = { Post, GetUserPosts, GetCategoriesPosts }