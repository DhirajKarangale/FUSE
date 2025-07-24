const db = require('./db');

const throwError = require('../utilities/throwError');
const statusCode = require('../utilities/statusCodes');
const messagesManager = require('../utilities/messagesManager');

async function Post(userId, postTitle, postBody, mediaURL, category) {
    const res = await db.query(
        `INSERT INTO posts (user_id, post_title, post_body, media_url, category) 
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id;`,
        [userId, postTitle, postBody, mediaURL, category]
    );

    const postId = res.rows[0].id;

    await db.query(`
        UPDATE users SET posts = COALESCE(posts, '{}') || $1
        WHERE id = $2;`, [[postId], userId]);
}

async function GetUserPosts(userId, pageNumber, pageSize) {

    const totalResult = await db.query(`
        SELECT COUNT(*) FROM posts
        WHERE user_id = $1 AND (deactivation IS NULL OR deactivation = '');
        `, [userId]);
    const totalPosts = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalPosts / pageSize);

    let posts = [];

    if (pageNumber < totalPages) {
        const res = await db.query(
            `SELECT posts.id, user_id, post_title, post_body, media_url, created_at, category
            FROM posts 
            WHERE user_id = $1 AND (deactivation IS NULL OR deactivation = '')
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3;`, [userId, pageSize, pageNumber * pageSize]
        );

        posts = res.rows;
    }

    return {
        posts: posts,
        currPage: pageNumber + 1,
        totalPages: totalPages
    }
}

async function GetCategoriesPosts(userId, categories, pageNumber, pageSize) {

    const totalResult = await db.query(`
        SELECT COUNT(*) FROM posts
        WHERE category = ANY($1) AND (deactivation IS NULL OR deactivation = '');
        `, [categories]);
    const totalPosts = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalPosts / pageSize);

    let posts = [];

    if (pageNumber < totalPages) {
        const res = await db.query(
            `SELECT posts.id, posts.user_id, posts.post_title, posts.post_body, posts.media_url, posts.created_at, posts.category, users.username, users.image_url as user_image_url, COALESCE(array_length(posts.likes, 1), 0) as "likes", ($4 = ANY(posts.likes)) as "isLiked"
            FROM posts 
            JOIN users ON users.id = posts.user_id
            WHERE category = ANY($1) AND (posts.deactivation IS NULL OR posts.deactivation = '')
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3;
            `, [categories, pageSize, pageNumber * pageSize, userId]
        );

        posts = res.rows;
    }

    return {
        posts: posts,
        currPage: pageNumber + 1,
        totalPages: totalPages
    }
}

async function Like(userId, postId) {
    const post = await db.query(`SELECT likes FROM posts WHERE id = $1`, [postId]);

    if (post.rowCount == 0) {
        throwError(messagesManager.Error('postNotFound'), statusCode.NOT_FOUND);
        return
    }

    const likes = post.rows[0].likes || [];

    if (likes.includes(userId)) {
        await db.query(`UPDATE posts SET likes = array_remove(likes, $1) WHERE id = $2`, [userId, postId]);
    }
    else {
        await db.query(`UPDATE posts SET likes = array_append(likes, $1) WHERE id = $2`, [userId, postId]);
    }
}

module.exports = { Post, GetUserPosts, GetCategoriesPosts, Like };