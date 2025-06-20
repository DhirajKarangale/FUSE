const router = require('express').Router();
const serviceUser = require('../services/serviceUser');

router.get('/', async (req, res, next) => {
    try {
        let id = req.query.id;
        if (!id) id = req.user.id;
        const response = await serviceUser.GetUser(id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.put('/', async (req, res, next) => {
    try {
        const id = req.user.id;
        const body = req.body;
        const response = await serviceUser.UpdateUser(id, body);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = router;