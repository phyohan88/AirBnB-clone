// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { email, firstName, lastName, password, username } = req.body;
    
    const user = await User.signup({ email, firstName, lastName, username, password });

    // const existingUser = await User.findOne({
    //   where: { email: req.body.email}
    // })
    // console.log(existingUser, 'existingUser')
    // if (existingUser.email === user.email){
    //   return res.status(403).json(
    //     {
    //       "message": "User already exists",
    //       "statusCode": 403,
    //       "errors": {
    //         "email": "User with that email already exists"
    //       }
    //     }
    //   )
    // }
    await setTokenCookie(res, user);

    return res.json({
      user,
    });
  }
);

// Sign up
// router.post(
//   '/',
//   async (req, res) => {
//     const { email, password, username } = req.body;
//     const user = await User.signup({ email, username, password });

//     await setTokenCookie(res, user);

//     return res.json({
//       user
//     });
//   }
// );


module.exports = router;