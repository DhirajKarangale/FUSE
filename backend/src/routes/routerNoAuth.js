const router = require('express').Router();
const servicePost = require('../services/servicePost');
const serviceComment = require('../services/serviceComment');

router.get('/post', async (req, res, next) => {
    try {
        const postId = req.query.postId;
        const response = await servicePost.GetPostById(postId);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/comments', async (req, res, next) => {
    try {
        const postId = req.query.postId;
        const response = await serviceComment.GetAllComments(postId);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = router;