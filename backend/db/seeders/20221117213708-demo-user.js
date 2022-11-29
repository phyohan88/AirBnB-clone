'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Users';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'first',
        lastName: 'last',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'second',
        lastName: 'hello',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'third',
        lastName: 'Joe',
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // options.tableName = 'Users';
    // options.username = { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {});
    // username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
  }
};
