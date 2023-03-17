const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const model = require('../../models');

const generateToken = async (user) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  const tokenPayload = {
    userId: user.id,
    email: user.Email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  const token = jwt.sign(tokenPayload, jwtSecretKey, { expiresIn: '5m' });

  const jwtRefreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY;
  const refreshTokenPayload = {
    userId: user.id,
    email: user.Email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  let refreshToken = null;
  let expiryDate = null;

  const tokenFromDB = await model.Token.findOne({ where: { userId: user.id } });
  if (tokenFromDB && tokenFromDB.refreshToken && tokenFromDB.expiryDate > new Date()) {
    refreshToken = tokenFromDB.refreshToken;
    expiryDate = tokenFromDB.expiryDate;
  } else {
    refreshToken = jwt.sign(refreshTokenPayload, jwtRefreshSecretKey, { expiresIn: '30d' });
    expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await model.Token.create({
      id: uuid.v4(),
      refreshToken,
      expiryDate,
      userId: user.id,
    });
  }
  return { token, refreshToken };
};

module.exports = { generateToken };
