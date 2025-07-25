const db = require('./db');

async function CreateUser(email) {
    const now = new Date();
    await db.query('INSERT INTO users (email, created_at) VALUES ($1, $2)', [email, now]);
    return await GetUserByEmail(email);
}

async function GetUser(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
}

async function GetUserByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}

async function GetUserByUsername(username) {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
}

async function UpdateUser(fields, index, values) {
    const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING *;`;

    const result = await db.query(query, values);
    return result.rows[0];
}

module.exports = { CreateUser, GetUser, GetUserByEmail, GetUserByUsername, UpdateUser };