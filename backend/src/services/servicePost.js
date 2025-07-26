const modelPost = require('../model/modelPost');
const categories = require('../config/categories.json');

const validator = require('../utilities/validator');
const messagesManager = require('../utilities/messagesManager');

async function Post(id, body) {
    validator.ID(id);
    validator.Category(body.category);
    validator.PostTitle(body.postTitle);
    if (body.mediaURL) validator.URL(body.mediaURL);
    if (body.postBody) validator.PostBody(body.postBody);

    await modelPost.Post(id, body.postTitle, body.postBody, body.mediaURL, body.category);

    return messagesManager.Success('postAdded');
}

async function GetUserPosts(userId, currUserId, page) {
    validator.ID(userId);

    const pageSize = 10;
    const pageNumber = parseInt(page);
    const validPage = isNaN(pageNumber) || pageNumber <= 1 ? 0 : pageNumber - 1;

    return await modelPost.GetUserPosts(userId, currUserId, validPage, pageSize);
}

async function GetPopularPosts(userId, page) {
    const pageSize = 10;
    const commentWeight = 1.0;
    const likeWeight = 0.65;
    const pageNumber = parseInt(page);
    const validPage = isNaN(pageNumber) || pageNumber <= 1 ? 0 : pageNumber - 1;

    return await modelPost.GetPopularPosts(userId, validPage, pageSize, commentWeight, likeWeight);
}

async function GetCategoriesPosts(userId, userCategories, page) {

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

    return await modelPost.GetCategoriesPosts(userId, postCategories, validPage, pageSize);
}

async function Like(userId, postId) {
    validator.ID(userId);
    validator.ID(postId);

    await modelPost.Like(userId, postId);

    return "Operation Successful";
}

async function Delete(postId) {
    await modelPost.Delete(postId);
}

module.exports = { Post, GetUserPosts, GetCategoriesPosts, GetPopularPosts, Like, Delete }