const router = require('express').Router();
const servicePost = require('../services/servicePost');

router.get('/', async (req, res, next) => {
    // try {
    //     let id = req.query.id;
    //     if (!id) id = req.user.id;
    //     const response = await serviceUser.GetUser(id);
    //     res.status(200).json(response);
    // } catch (error) {
    //     next(error);
    // }
});

router.get('/user', async (req, res, next) => {
    try {
        const id = req.user.id;
        const page = req.query.page;
        const response = await servicePost.GetUserPost(id, page);
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