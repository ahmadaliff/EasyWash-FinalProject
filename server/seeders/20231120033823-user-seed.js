"use strict";

/** @type {import('sequelize-cli').Migration} */

const { hashPassword } = require("../utils/bcryptUtil");

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

    return queryInterface.bulkInsert("Users", [
      {
        id: 1,
        fullName: "Ahmad Alif Sofian",
        email: "alif12sofian@gmail.com",
        phone: "",
        role: "admin",
        imagePath: null,
        isVerified: true,
        password: hashPassword("password123"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        fullName: "user",
        email: "user@user.com",
        role: "user",
        imagePath: null,
        isVerified: true,
        password: hashPassword("password123"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        fullName: "laundry",
        email: "laundry@user.com",
        role: "laundry",
        imagePath: null,
        isVerified: true,
        password: hashPassword("password123"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        fullName: "courier",
        email: "courier@user.com",
        role: "courier",
        imagePath: null,
        isVerified: true,
        password: hashPassword("password123"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        fullName: "laundry 2",
        email: "laundry2@user.com",
        role: "laundry",
        imagePath: null,
        isVerified: false,
        password: hashPassword("password123"),
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
    return queryInterface.bulkDelete("Users", null, {});
  },
};
