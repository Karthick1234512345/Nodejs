const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const model = require('../../models');
const { ErrorHandler } = require('../errorHandler/error');

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const jwtRefreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY;

const generateToken = async (user) => {
  const tokenPayload = {
    userId: user.id,
    email: user.Email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  const accessToken = jwt.sign(tokenPayload, jwtSecretKey, { expiresIn: '19m' });

  let refreshToken = null;
  let expiryDate = null;

  const tokenFromDB = await model.tokens.findOne({ where: { userId: user.id } });
  if (tokenFromDB && tokenFromDB.refreshToken && tokenFromDB.expiryDate > new Date()) {
    refreshToken = tokenFromDB.refreshToken;
    expiryDate = tokenFromDB.expiryDate;
  } else {
    const refreshTokenPayload = {
      userId: user.id,
      email: user.Email,
      firstName: user.firstName,
      lastName: user.lastName,
      tokenId: uuid.v4(),
    };
    refreshToken = jwt.sign(refreshTokenPayload, jwtRefreshSecretKey, { expiresIn: '30d' });
    expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await model.tokens.create({
      id: refreshTokenPayload.tokenId,
      accessToken,
      refreshToken,
      expiryDate,
      userId: user.id,
    });
  }
  return { accessToken, refreshToken };
};

// eslint-disable-next-line consistent-return
const verifyToken = async (accessToken, next) => {
  try {
    // Check if token has been invalidated
    // eslint-disable-next-line max-len
    const invalidatedToken = await model.invalidatedTokens.findOne({ where: { accessToken }, raw: true });
    if (invalidatedToken) {
      const err = new ErrorHandler('ERR_LOGGED_OUT');
      next(err);
    }

    const decodedToken = jwt.verify(accessToken, jwtSecretKey);
    return decodedToken;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const err = new ErrorHandler('ERR_TOKEN_EXPIRED');
      next(err);
    } else {
      const err = new ErrorHandler('ERR_INVLD_TKN');
      next(err);
    }
  }
};

module.exports = { generateToken, verifyToken };
