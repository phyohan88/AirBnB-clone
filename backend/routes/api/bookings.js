const express = require('express');

const { Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


//Get All Current User's Bookings
router.get('/current', async (req, res) => {
    const { spotId, Spot: {ownerId, address, city, state, country, lat, lng, name, price, previewImage}, userId, startDate, endDate } = req.body;

    const currentUserBookings = await Booking.findall({ ownerId })

    return res.json(currentUserBookings)
})



module.exports = router;