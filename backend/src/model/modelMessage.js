const db = require('./db');

async function Search(userId, pageNumber, pageSize) {
    const countResult = await db.query(
        `SELECT COUNT(DISTINCT CASE 
            WHEN sender_id = $1 THEN receiver_id
            ELSE sender_id
         END)
         FROM messages
         WHERE sender_id = $1 OR receiver_id = $1;`,
        [userId]
    );

    const totalUsers = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalUsers / pageSize);

    let users = [];

    if (pageNumber < totalPages) {
        const result = await db.query(
            `SELECT DISTINCT ON (other_user.id)
              other_user.id,
              other_user.username,
              other_user.image_url,
              m.message,
              m.created_at
           FROM messages m
           JOIN users AS other_user
             ON other_user.id = CASE 
                  WHEN m.sender_id = $1 THEN m.receiver_id
                  ELSE m.sender_id
             END
           WHERE m.sender_id = $1 OR m.receiver_id = $1
           ORDER BY other_user.id, m.created_at DESC
           LIMIT $2 OFFSET $3;`,
            [userId, pageSize, pageNumber * pageSize]
        );

        users = result.rows;
    }

    return {
        users,
        currPage: pageNumber + 1,
        totalPages
    };
}

module.exports = { Search };