const db = require('./db');

const throwError = require('../utilities/throwError');
const statusCode = require('../utilities/statusCodes');
const messagesManager = require('../utilities/messagesManager');

async function Post(userId, postTitle, postBody, mediaURL, category) {
    const now = new Date();
    const res = await db.query(
        `INSERT INTO posts (user_id, post_title, post_body, media_url, category, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id;`,
        [userId, postTitle, postBody, mediaURL, category, now]
    );

    const postId = res.rows[0].id;

    await db.query(`
        UPDATE users SET posts = COALESCE(posts, '{}') || $1
        WHERE id = $2;`, [[postId], userId]);
}

async function GetUserPosts(userId, currentUser, pageNumber, pageSize) {

    const totalResult = await db.query(`
        SELECT COUNT(*) FROM posts
        WHERE user_id = $1 AND (deactivation IS NULL OR deactivation = '');`
        , [userId]);
    const totalPosts = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalPosts / pageSize);

    let posts = [];

    if (pageNumber < totalPages) {
        const res = await db.query(
            `SELECT 
                posts.id, 
                posts.user_id, 
                posts.post_title, 
                posts.post_body, 
                posts.media_url, 
                posts.created_at, 
                posts.category, 
                COALESCE(array_length(posts.likes, 1), 0) AS "likes", 
                ($4 = ANY(posts.likes)) AS "isLiked",
                COALESCE(comment_counts.count, 0) AS "comments",
                CASE WHEN user_comments.user_id IS NOT NULL THEN true ELSE false END AS "isCommented"
            FROM posts 
            LEFT JOIN (
                SELECT post_id, COUNT(*) AS count
                FROM comments 
                WHERE deactivation IS NULL OR deactivation = ''
                GROUP BY post_id
            ) AS comment_counts ON comment_counts.post_id = posts.id
            LEFT JOIN (
                SELECT DISTINCT post_id, user_id
                FROM comments 
                WHERE user_id = $1 AND (deactivation IS NULL OR deactivation = '')
            ) AS user_comments ON user_comments.post_id = posts.id
            WHERE posts.user_id = $1 AND (posts.deactivation IS NULL OR posts.deactivation = '')
            ORDER BY posts.created_at DESC
            LIMIT $2 OFFSET $3`, [userId, pageSize, pageNumber * pageSize, currentUser]
        );

        posts = res.rows;
    }

    return {
        posts: posts,
        currPage: pageNumber + 1,
        totalPages: totalPages
    }
}

async function GetPopularPosts(userId, pageNumber, pageSize, commentWeight, likeWeight) {

    const totalResult = await db.query(`
        SELECT COUNT(*) FROM posts 
        WHERE deactivation IS NULL OR deactivation = '';
    `);
    const totalPosts = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalPosts / pageSize);

    let posts = [];

    if (pageNumber < totalPages) {
        const res = await db.query(
            `SELECT 
                posts.id,
                posts.user_id,
                posts.post_title,
                posts.post_body,
                posts.media_url,
                posts.created_at,
                posts.category,
                users.username,
                users.image_url AS user_image_url,
                COALESCE(array_length(posts.likes, 1), 0) AS "likes",
                ($3 = ANY(posts.likes)) AS "isLiked",
                COALESCE(comment_counts.count, 0) AS "comments",
                CASE WHEN user_comments.user_id IS NOT NULL THEN true ELSE false END AS "isCommented",
                -- Cast to numeric for decimal weights
                (COALESCE(comment_counts.count, 0)::numeric * $4 + COALESCE(array_length(posts.likes, 1), 0)::numeric * $5) AS "popularity"
            FROM posts
            JOIN users ON users.id = posts.user_id
            LEFT JOIN (
                SELECT post_id, COUNT(*) AS count
                FROM comments
                WHERE deactivation IS NULL OR deactivation = ''
                GROUP BY post_id
            ) AS comment_counts ON comment_counts.post_id = posts.id
            LEFT JOIN (
                SELECT DISTINCT post_id, user_id
                FROM comments
                WHERE user_id = $3 AND (deactivation IS NULL OR deactivation = '')
            ) AS user_comments ON user_comments.post_id = posts.id
            WHERE (posts.deactivation IS NULL OR posts.deactivation = '')
            ORDER BY popularity DESC, posts.created_at DESC
            LIMIT $1 OFFSET $2;`,
            [pageSize, pageNumber * pageSize, userId, commentWeight, likeWeight]
        );

        posts = res.rows;
    }

    return {
        posts,
        currPage: pageNumber + 1,
        totalPages
    };
}

async function GetCategoriesPosts(userId, categories, pageNumber, pageSize) {

    const totalResult = await db.query(`
        SELECT COUNT(*) FROM posts
        WHERE category = ANY($1) AND (deactivation IS NULL OR deactivation = '');`
        , [categories]);
    const totalPosts = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalPosts / pageSize);

    let posts = [];

    if (pageNumber < totalPages) {
        const res = await db.query(
            `SELECT 
                posts.id,
                posts.user_id,
                posts.post_title,
                posts.post_body,
                posts.media_url,
                posts.created_at,
                posts.category,
                users.username,
                users.image_url AS user_image_url,
                COALESCE(array_length(posts.likes, 1), 0) AS "likes",
                ($4 = ANY(posts.likes)) AS "isLiked",
                COALESCE(comment_counts.count, 0) AS "comments",
                CASE WHEN user_comments.user_id IS NOT NULL THEN true ELSE false END AS "isCommented"
            FROM posts
            JOIN users ON users.id = posts.user_id
            LEFT JOIN (
                SELECT post_id, COUNT(*) AS count
                FROM comments
                WHERE deactivation IS NULL OR deactivation = ''
                GROUP BY post_id
            ) AS comment_counts ON comment_counts.post_id = posts.id
            LEFT JOIN (
                SELECT DISTINCT post_id, user_id
                FROM comments
                WHERE user_id = $4 AND (deactivation IS NULL OR deactivation = '')
            ) AS user_comments ON user_comments.post_id = posts.id
            WHERE category = ANY($1)
              AND (posts.deactivation IS NULL OR posts.deactivation = '')
            ORDER BY posts.created_at DESC
            LIMIT $2 OFFSET $3;`
            , [categories, pageSize, pageNumber * pageSize, userId]
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

async function Delete(postId) {
    await db.query(`UPDATE posts SET deactivation = 'Deleted' WHERE id = $1`, [postId]);
}

module.exports = { Post, GetUserPosts, GetCategoriesPosts, GetPopularPosts, Like, Delete };