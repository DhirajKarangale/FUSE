const db = require('./db');

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

async function GetCategoriesPosts(categories, pageNumber, pageSize) {

    const totalResult = await db.query(`
        SELECT COUNT(*) FROM posts
        WHERE category = ANY($1) AND (deactivation IS NULL OR deactivation = '');
        `, [categories]);
    const totalPosts = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalPosts / pageSize);

    let posts = [];

    if (pageNumber < totalPages) {
        const res = await db.query(
            `SELECT posts.id, posts.user_id, posts.post_title, posts.post_body, posts.media_url, posts.created_at, posts.category, users.username, users.image_url as user_image_url
            FROM posts 
            JOIN users ON users.id = posts.user_id
            WHERE category = ANY($1) AND (posts.deactivation IS NULL OR posts.deactivation = '')
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3;
            `, [categories, pageSize, pageNumber * pageSize]
        );

        posts = res.rows;
    }

    return {
        posts: posts,
        currPage: pageNumber + 1,
        totalPages: totalPages
    }
}

module.exports = { Post, GetUserPosts, GetCategoriesPosts };