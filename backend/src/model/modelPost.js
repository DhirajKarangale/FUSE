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

    console.log();
}

module.exports = { Post };