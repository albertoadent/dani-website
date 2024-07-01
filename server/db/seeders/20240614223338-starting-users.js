"use strict";

/** @type {import('sequelize-cli').Migration} */
const { User } = require("../models");

const users = [
  {
    first_name: "Alberto",
    last_name: "Dent",
    email: "tiubgdui@gmail.com",
    username: "helloWorld",
    password: "helloworld",
    role: "admin",
  },
  {
    first_name: "Dani",
    last_name: "Alberto",
    email: "hello@gmail.com",
    username: "helloWorld1",
    password: "helloworld",
    role: "owner",
  },
];

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
    queryInterface.bulkInsert("Users", users);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete("Users", users);
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
