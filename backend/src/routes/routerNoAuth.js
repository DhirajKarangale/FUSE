const router = require('express').Router();
const servicePost = require('../services/servicePost');

router.get('/post', async (req, res, next) => {
    try {
        const postId = req.query.postId;
        const userId = req.query.userId;
        const response = await servicePost.GetPostById(postId, userId);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = router;