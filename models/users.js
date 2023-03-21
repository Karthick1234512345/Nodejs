module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    Email: DataTypes.STRING,
    Phonenumber: DataTypes.INTEGER,
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
  users.associate = function (models) {
    users.belongsTo(models.roles, {
      foreignKey: 'roleId',
      onDelete: 'CASCADE',
    });
  };
  users.associate = function (models) {
    users.hasMany(models.tokens, {
      foreignKey: 'userId',
    });
  };
  return users;
};
