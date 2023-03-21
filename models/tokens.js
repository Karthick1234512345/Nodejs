module.exports = (sequelize, DataTypes) => {
  const tokens = sequelize.define(
    'tokens',
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
  tokens.associate = function (models) {
    // associations can be defined here
    tokens.belongsTo(models.users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return tokens;
};
