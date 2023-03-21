module.exports = (sequelize, DataTypes) => {
  const roles = sequelize.define('roles', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  }, {});
  roles.associate = function (models) {
    roles.hasMany(models.users, {
      foreignKey: 'roleId',
    });
  };

  return roles;
};
