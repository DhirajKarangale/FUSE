const router = require('express').Router();
const serviceMessage = require('../services/serviceMessage');

router.get('/usersearch', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const page = req.query.page;
        const response = await serviceMessage.SearchUser(userId, page);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = router;