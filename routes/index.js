const express = require('express');

const personCore = require('../core/person');
const { validatePayload } = require('./middlewares/validate-payload');

const router = express.Router();

router.post('/login', validatePayload, (req, res, next) => personCore.postlogin(req, res, next));
router.post('/sendotp', validatePayload, (req, res, next) => personCore.sendOTP(req, res, next));
router.post('/refreshtoken', validatePayload, (req, res, next) => personCore.generateNewAccessToken(req, res, next));
router.post('/verifyOTP', validatePayload, (req, res, next) => personCore.verifyOTP(req, res, next));
router.post('/forgotpassword', validatePayload, (req, res, next) => personCore.forgotPassword(req, res, next));
router.post('/resetpassword', validatePayload, (req, res, next) => personCore.resetPassword(req, res, next));
router.post('/changepassword', validatePayload, (req, res, next) => personCore.changepassword(req, res, next));
router.get('/getuserbyname', validatePayload, (req, res, next) => personCore.getuserbyname(req, res, next));
router.post('/createuser', (req, res, next) => personCore.createUser(req, res, next));
router.put('/edituser', (req, res, next) => personCore.edituser(req, res, next));

module.exports = router;
