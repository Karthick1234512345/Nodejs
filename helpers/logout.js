const { ErrorHandler } = require('../util/errorHandler/error');
const model = require('../models');
const logger = require('../services/logger');

const logout = async (req) => {
  const { userId } = req;

  if (!userId) {
    throw new ErrorHandler('ERR_MNDTR_PRM_MSNG');
  }

  logger.info(`Invalidating token for userId ${userId}`);

  try {
    const existingUser = await model.users.findOne({ where: { id: userId } });
    if (!existingUser) {
      throw new ErrorHandler('ERR_USER_NOT_FOUND');
    }
    const token = await model.tokens.findOne({
      where: { userId },
    });

    await model.invalidatedTokens.create({
      accessToken: token.accessToken,
    });

    await model.tokens.destroy({
      where: { userId },
    });

    logger.info(`Token invalidated and deleted for userId ${userId}`);
    return {
      success: true,
    };
  } catch (error) {
    logger.error(`Error while invalidating token for userId ${userId}`);
    logger.error(error);
    throw error;
  }
};

module.exports = {
  logout,
};
