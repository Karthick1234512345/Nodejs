const express = require('express');

const personCore = require('../core/person');
const { validatePayload } = require('./middlewares/validate-payload');
const checkAuth = require('./middlewares/auth');

const router = express.Router();

router.post('/login', validatePayload, (req, res, next) => personCore.postlogin(req, res, next));
router.post('/sendotp', validatePayload, (req, res, next) => personCore.sendOTP(req, res, next));
router.post('/refreshtoken', (req, res, next) => personCore.generateNewAccessToken(req, res, next));
router.post('/verifyOTP', validatePayload, (req, res, next) => personCore.verifyOTP(req, res, next));
router.post('/forgotpassword', validatePayload, (req, res, next) => personCore.forgotPassword(req, res, next));
router.post('/resetpassword', validatePayload, (req, res, next) => personCore.resetPassword(req, res, next));
router.post('/changepassword', validatePayload, (req, res, next) => personCore.changepassword(req, res, next));

router.use([checkAuth]);
router.post('/createuser', (req, res, next) => personCore.createUser(req, res, next));
router.get('/getallusers', (req, res, next) => personCore.getallusers(req, res, next));
router.post('/logout', (req, res, next) => personCore.logout(req, res, next));
router.put('/edituser', (req, res, next) => personCore.edituser(req, res, next));
router.put('/editusertesting', (req, res, next) => personCore.editapitesting(req, res, next));
router.get('/getuserbyname', (req, res, next) => personCore.getuserbyname(req, res, next));

module.exports = router;
