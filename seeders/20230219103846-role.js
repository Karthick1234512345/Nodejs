module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', [
      {
        id: 1,
        name: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Suprveisor',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Employee',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },
  down: (queryInterface, Sequelize) => {      
    return queryInterface.bulkDelete('Roles', null, {});
  }
};