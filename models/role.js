module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  }, {});
  Role.associate = function (models) {
    Role.hasMany(models.User, {
      foreignKey: 'roleId',
    });
  };

  return Role;
};
