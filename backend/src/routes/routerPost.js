const router = require('express').Router();
const servicePost = require('../services/servicePost');

router.get('/', async (req, res, next) => {
    try {
        const page = req.query.page;
        const categories = req.query.categories;
        const response = await servicePost.GetCategoriesPosts(categories, page);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/user', async (req, res, next) => {
    try {
        const id = req.user.id;
        const page = req.query.page;
        const response = await servicePost.GetUserPosts(id, page);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const id = req.user.id;
        const body = req.body;
        const response = await servicePost.Post(id, body);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = router;