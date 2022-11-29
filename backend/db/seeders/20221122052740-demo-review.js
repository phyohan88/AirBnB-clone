'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Reviews';

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
   options.tableName = 'Reviews';
   return queryInterface.bulkInsert(options, [
    {
      // id: 3,
      userId: 3,
      spotId: 3,
      review: "This was a good spot!",
      stars: 4
    },
    {
      // id: 4,
      userId: 1,
      spotId: 1,
      review: "This was not bad spot!",
      stars: 3
    },
    {
      // id: 5,
      userId: 5,
      spotId: 5,
      review: "This was a bad spot!",
      stars: 2
    },
    {
      // id: 6,
      userId: 6,
      spotId: 6,
      review: "This was the best spot!",
      stars: 5
    },
    {
      // id: 7,
      userId: 7,
      spotId: 7,
      review: "This was the worst spot!",
      stars: 1
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
    // options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      // stars: { [Op.in]: [4, 3, 2, 5, 1]}
    });
  }
};
