'use strict';

// const { sequelize } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}
options.tableName = 'Spots';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  options.tableName = 'Spots';
  await queryInterface.bulkInsert(options, [
    {
      ownerId: 2,
      address: "123 One St",
      city: "City 1",
      state: "California",
      country: "USA",
      lat: 38.7689348,
      lng: -120.5789323,
      name: "Silent Hill",
      description: "Place where people want to adventure",
      price: 200
    },

    {
      ownerId: 3,
      address: "134 Second St",
      city: "City 2",
      state: "Utah",
      country: "USA",
      lat: 33.7689348,
      lng: -110.5789323,
      name: "Sandy Valley",
      description: "Place where people want to chill",
      price: 135
    },

    {
      ownerId: 1,
      address: "111 Third Lane",
      city: "City 4",
      state: "Florida",
      country: "USA",
      lat: 88.7689348,
      lng: -190.5789323,
      name: "Cool Beach",
      description: "Place where people want to relax",
      price: 285
    },

  ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {});
    // name: { [Op.in]: ['Silent Hill', 'Sand Valley', 'Cool Beach'] }
  }
};
