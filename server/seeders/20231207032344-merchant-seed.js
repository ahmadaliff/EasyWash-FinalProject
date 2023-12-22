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
    return queryInterface.bulkInsert("Merchants", [
      {
        id: 1,
        name: "Laundry 1",
        userId: 3,
        description: "ini adalah description",
        imagePath: null,
        location: `{"lat":-6.223710368739434,"lng":106.84333920478822}`,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Laundry 2",
        userId: 4,
        description: "ini adalah description",
        imagePath: null,
        location: `{"lat":-6.223710368739434,"lng":106.84333920478822}`,
        isVerified: false,
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

    return queryInterface.bulkDelete("Merchants", null, {});
  },
};
