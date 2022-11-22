'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

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
   options.tableName = 'SpotImages';
   return queryInterface.bulkInsert(options, [
    {
      id: 3,
      url: "image1 url",
      preview: true
    },
    {
      id: 5,
      url: "image2 url",
      preview: false
    },
    {
      id: 7,
      url: "image3 url",
      preview: true
    },
    {
      id: 8,
      url: "image4 url",
      preview: false
    },
    {
      id: 9,
      url: "image5 url",
      preview: true
    },
    {
      id: 10,
      url: "image6 url",
      preview: false
    },
    {
      id: 11,
      url: "image7 url",
      preview: true
    },
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {})
  }
};
