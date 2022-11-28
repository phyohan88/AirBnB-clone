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
    // console.log(bookingId, 'BOOKING ID =======')
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
    // console.log(typeof endDate, 'this is end date')
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
    if (editBooking.endDate < endDate){
        console.log(editBooking.endDate, 'editing end date ====')
        console.log(endDate, ' end date')
        return res.status(403).json(
            {
                "message": "Past bookings can't be modified",
                "statusCode": 403
            })
    }
    // const currentDate = new Date()
    // const getCurrentTime = currentDate.getTime()
    // console.log(currentDate.getHours(), 'this is hours =====')

    // const end = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}`

    // if()

    // console.log(end, 'endddddd======')
    
    // console.log(getCurrentTime, 'this is current time')
   
    // console.log(currentDate, 'today date ==========')

    editBooking.update({
        spotId: req.spotId,
        userId: req.useId,
        startDate,
        endDate
    })
    return res.json(editBooking)
})

//Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const deleteBooking = await Booking.findOne({where: {id: req.params.bookingId}})

    if(!deleteBooking){
        return res.status(404).json(
            {
                "message": "Booking couldn't be found",
                "statusCode": 404
            }
        )
    }
    deleteBooking.destroy();
    return res.json(
        {
            "message": "Successfully deleted",
            "statusCode": 200
        })
})


module.exports = router;