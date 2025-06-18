const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/router');

require('dotenv').config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

(async () => {
    try {
        app.listen(PORT, () => { console.log("Server started at port " + PORT); });
    } catch (error) {
        console.error("Failed to connect to the database:", error.message);
    }
})();