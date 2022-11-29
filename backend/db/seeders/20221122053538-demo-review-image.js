'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.table = 'ReviewImages';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up:async  (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = 'ReviewImages';
   return queryInterface.bulkInsert(options, [
    {
      reviewId: 3,
      url: "review3 url"
    },
    {
      reviewId: 1,
      url: "review5 url"
    },
    {
      reviewId: 2,
      url: "review6 url"
    },
    // {
    //   reviewId: 7,
    //   url: "review7 url"
    // },
   ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // options.tableName = 'ReviewImage';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {});
    // reviewId: { [Op.in]: [3, 4, 5, 6, 7]}
  }
};
