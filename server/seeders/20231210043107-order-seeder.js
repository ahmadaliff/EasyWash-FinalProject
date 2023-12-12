"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return await queryInterface.bulkInsert("Orders", [
      {
        userId: 2,
        totalPrice: 80,
        status: "app_pending",
        location: `{"lat":-6.223710368739434,"lng":106.84333920478822}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        totalPrice: 120,
        location: `{"lat":-6.223710368739434,"lng":106.84333920478822}`,
        status: "app_finish",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    return await queryInterface.bulkDelete("Orders", null, {});
  },
};
