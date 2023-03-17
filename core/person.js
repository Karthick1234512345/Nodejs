const helpers = require('../helpers/loginApi');
const helper = require('../helpers/sendOtp');
const generateNewAccessTokenn = require('../helpers/refreshToken.js');
const verifyotp = require('../helpers/verifyOtp');
const forgotpassword = require('../helpers/forgotPassword');
const resetpassword = require('../helpers/resetPassword');
const changepassword = require('../helpers/changePassword');
const getuserbyname = require('../helpers/getUsersbyId');

const personCore = {};

personCore.postlogin = (req, res, next) => {
  helpers.postlogin(req.body).then((response) => {
    res.status(200).json(response);
  }).catch((err) => {
    next(err);
  });
};
personCore.sendOTP = (req, res, next) => {
  helper.sendOTP(req.body).then((response) => {
    res.status(200).json(response);
  }).catch((err) => {
    next(err);
  });
};
personCore.generateNewAccessToken = (req, res, next) => {
  generateNewAccessTokenn.generateNewAccessToken(req.body).then((response) => {
    res.status(200).json(response);
  }).catch((err) => {
    next(err);
  });
};
personCore.verifyOTP = (req, res, next) => {
  verifyotp.verifyOTP(req.body).then((response) => {
    res.status(200).json(response);
  }).catch((err) => {
    next(err);
  });
};
personCore.forgotPassword = (req, res, next) => {
  forgotpassword.forgotPassword(req.body).then((response) => {
    res.status(200).json(response);
  }).catch((err) => {
    next(err);
  });
};
personCore.resetPassword = (req, res, next) => {
  resetpassword.resetPassword(req.body).then((response) => {
    res.status(200).json(response);
  }).catch((err) => {
    next(err);
  });
};
personCore.changepassword = (req, res, next) => {
  changepassword.changePassword(req.body).then((response) => {
    res.status(200).json(response);
  }).catch((err) => {
    next(err);
  });
};
personCore.getuserbyname = (req, res, next) => {
  getuserbyname.getUserByName(req.body).then((response) => {
    res.status(200).json(response);
  }).catch((err) => {
    next(err);
  });
};

module.exports = personCore;
