'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Bookings';

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
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 3,
        userId: 2,
        startDate: '2022-12-10',
        endDate: '2023-01-13'
      },
      {
        spotId: 2,
        userId: 1,
        startDate: '2022-12-15',
        endDate: '2023-01-15'
      },
      {
        spotId: 5,
        userId: 7,
        startDate: '2022-12-18',
        endDate: '2023-01-18'
      },
      {
        spotId: 6,
        userId: 9,
        startDate: '2022-12-20',
        endDate: '2023-01-25'
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
    // options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      // spotId: { [Op.in]: [3, 4, 5, 6]}
    });
  }
};
