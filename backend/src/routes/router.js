const router = require('express').Router();
const routerOTP = require('./routerOTP');
const routerUser = require('./routerUser');
const routerAuth = require('./routerAuth');
const jwt = require('../utilities/jwt');
const errorLogger = require('../utilities/errorLogger');
const requestLogger = require('../utilities/requestLogger');

router.use(requestLogger);
router.use('/otp', routerOTP);
router.use(jwt.ValidateToken);
router.use('/auth', routerAuth);
router.use('/user', routerUser);

router.use(errorLogger);

module.exports = router;