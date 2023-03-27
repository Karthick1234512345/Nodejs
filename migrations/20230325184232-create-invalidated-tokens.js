/ @type {import('sequelize-cli').Migration} /;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invalidatedTokens', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      accessToken: {
        type: Sequelize.STRING(500),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('invalidatedTokens');
  },
};
