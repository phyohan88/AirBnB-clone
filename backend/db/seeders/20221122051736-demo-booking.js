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
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 3,
        userId: 4,
        startDate: '12-10-2022',
        endDate: '01-13-2023'
      },
      {
        spotId: 4,
        userId: 5,
        startDate: '12-15-2022',
        endDate: '01-15-2023'
      },
      {
        spotId: 5,
        userId: 7,
        startDate: '12-18-2022',
        endDate: '01-18-2023'
      },
      {
        spotId: 6,
        userId: 9,
        startDate: '12-20-2022',
        endDate: '01-25-2023'
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
      spotId: { [Op.in]: [3, 4, 5, 6]}
    }, {});
  }
};
