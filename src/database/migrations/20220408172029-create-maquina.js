"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("dadosMaquina", {
      rotacao: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      avanco: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      temperatura: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable("dadosMaquina");
  },
};
