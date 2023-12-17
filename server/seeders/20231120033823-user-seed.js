"use strict";

/** @type {import('sequelize-cli').Migration} */

const { hashPassword } = require("../utils/bcryptUtil");
const { chatStreamClient } = require("../utils/streamChatUtil");

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

    await chatStreamClient.upsertUsers([
      {
        id: "1",
        name: "Ahmad Alif Sofian",
        image: null,
      },
      {
        id: "2",
        name: "user",
        image: null,
      },
      {
        id: "3",
        name: "Laundry 1",
        image: null,
      },
      {
        id: "4",
        name: "Laundry 2",
        image: null,
      },
    ]);
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
        role: "merchant",
        imagePath: null,
        isVerified: true,
        password: hashPassword("password123"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        fullName: "laundry 2",
        email: "laundry2@user.com",
        role: "merchant",
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
