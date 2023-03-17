/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      Email: {
        type: Sequelize.STRING,
      },
      temproaryPassword: {
        type: Sequelize.STRING,
      },
      temproaryPasswordExpiry: {
        type: Sequelize.DATE,
      },
      roleId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Roles',
          key: 'id',
          as: 'roleId',
        },
      },
      accountType: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM('enabled', 'disabled'),
        allowNull: false,
      },
      permanentPassword: {
        type: Sequelize.STRING,
      },
      otpHash: {
        type: Sequelize.STRING,
      },
      otpExpiry: {
        type: Sequelize.STRING,
      },
      otpAttempts: {
        type: Sequelize.INTEGER,
      },
      otpWrongAttempts: {
        type: Sequelize.INTEGER,
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
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
