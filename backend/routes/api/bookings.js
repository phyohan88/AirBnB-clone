const express = require('express');

const { Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();


//Get All Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
    const {id} = req.user;


    const currentUserBookings = await Booking.findAll({where: { userId: id}})

    return res.json(currentUserBookings)
})

//Edit a Booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const {bookingId} = req.params
    console.log(bookingId, 'BOOKING ID =======')
    const editBooking = await Booking.findByPk(bookingId)
    if(!editBooking){
        return res.status(404).json(
            {
                "message": "Booking couldn't be found",
                "statusCode": 404
            }
        )
    }

    const {startDate, endDate} = req.body;
    if(endDate < startDate){
        return res.status(400).json(
            {
                "message": "Validation error",
                "statusCode": 400,
                "errors": {
                    "endDate": "endDate cannot come before startDate"
                }
            }
        )
    }

    editBooking.update({
        spotId: req.spotId,
        userId: req.useId,
        startDate,
        endDate
    })
    return res.json(editBooking)
})

//Delete a Spot
// router.delete('/:spotId', requireAuth, async (req, res) => {
//     const deleteSpot = await Spot.findOne({where: {id: req.params.spotId}})

//     await deleteSpot.destroy();
// })


module.exports = router;