module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    Email: DataTypes.STRING,
    temproaryPassword: DataTypes.STRING,
    temproaryPasswordExpiry: DataTypes.DATE,
    roleId: DataTypes.INTEGER,
    accountType: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('enabled', 'disabled'),
      allowNull: false,
    },
    permanentPassword: DataTypes.STRING,
    otpHash: DataTypes.STRING,
    otpExpiry: DataTypes.STRING,
    otpAttempts: DataTypes.INTEGER,
    otpWrongAttempts: DataTypes.INTEGER,
  }, {});
  User.associate = function (models) {
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      onDelete: 'CASCADE',
    });
  };
  User.associate = function (models) {
    User.hasMany(models.Token, {
      foreignKey: 'userId',
    });
  };
  return User;
};
