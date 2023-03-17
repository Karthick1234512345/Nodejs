module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    'Token',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      refreshToken: DataTypes.STRING,
      expiryDate: DataTypes.STRING(5000),
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
    },
    {},
  );
  Token.associate = function (models) {
    // associations can be defined here
    Token.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return Token;
};
