const saltHashPwd = require('./saltHashPwd');
const appConstants = require('../../config/constants');

const getSaltedOTP = () => new Promise((resolve, reject) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  saltHashPwd.hash(otp.toString()).then((hashedOTP) => {
    resolve({ hashedOTP, otp });
  }).catch((error) => {
    reject(error);
  });
});

const generateRandomPassword = () => {
  const specialCharacter = '@#!*&-';
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const tempPassword = [];
  const passwordCharacters = specialCharacter + letters + numbers;
  // eslint-disable-next-line no-plusplus, no-undef
  for (let i = 0, n = passwordCharacters.length; i < appConstants.TEMP_PASSWORD_LENGTH; i++) {
    tempPassword.push(passwordCharacters.charAt(Math.floor(Math.random() * n)));
  }
  return tempPassword.join('');
};

//
module.exports = {
  getSaltedOTP,
  generateRandomPassword,
};
