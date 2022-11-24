const express = require('express');

const { Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


//Create a Booking based on spotId 
router.post('/', async (req, res) => {
    // const {}
})




module.exports = router;