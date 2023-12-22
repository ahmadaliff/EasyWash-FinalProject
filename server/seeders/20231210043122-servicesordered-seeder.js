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
          orderId: `Order-1702535973296`,
          serviceId: 1,
          quantity: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          orderId: `Order-1702536051382`,
          serviceId: 1,
          quantity: 1,
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
