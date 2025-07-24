const db = require('./db');

async function Get(postId, pageNumber, pageSize) {
    const totalResult = await db.query(`SELECT COUNT(*) FROM comments 
        WHERE post_id = $1 AND (deactivation IS NULL OR deactivation = '')`, [postId]);

    const totalComments = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalComments / pageSize);

    let comments = [];

    if (pageNumber < totalPages) {

        const res = await db.query(`
            SELECT comments.comment, users.username, users.image_url AS user_image_url
            FROM comments
            JOIN users ON users.id = comments.user_id
            WHERE comments.post_id = $1 AND (comments.deactivation IS NULL OR comments.deactivation = '')
            ORDER BY comments.created_at DESC
            LIMIT $2 OFFSET $3;`, [postId, pageSize, pageNumber * pageSize]);

        comments = res.rows;
    }

    return {
        comments: comments,
        currPage: pageNumber + 1,
        totalPages: totalPages
    }
}


async function Add(userId, postId, comment) {
    await db.query(`INSERT INTO comments (post_id, user_id, comment) VALUES ($1, $2, $3)`, [postId, userId, comment]);
}

async function Delete(commentId) {

}


module.exports = { Get, Add, Delete };