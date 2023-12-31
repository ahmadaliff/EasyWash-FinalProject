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
    return await queryInterface.bulkInsert(
      "ServicesOrdereds",
      [
        {
          orderId: `Order-1702535973299`,
          serviceId: 1,
          quantity: 2,
          price: 2000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          orderId: `Order-1702536051389`,
          serviceId: 1,
          quantity: 1,
          price: 2000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return await queryInterface.bulkDelete("ServicesOrdereds", null, {});
  },
};
