const db = require('./db');

async function Post(userId, postTitle, postBody, mediaURL, category) {
    await db.query(
        'INSERT INTO posts (user_id, post_title, post_body, media_url, category) VALUES ($1, $2, $3, $4, $5)',
        [userId, postTitle, postBody, mediaURL, category]
    );
}

module.exports = { Post };