module.exports = (sequelize, DataTypes) => {
  const invalidatedTokens = sequelize.define(
    'invalidatedTokens', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      accessToken: {
        type: DataTypes.STRING(500),
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

    },

  );
  return invalidatedTokens;
};
