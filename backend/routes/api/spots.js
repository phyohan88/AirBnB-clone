const express = require('express');

const { Spot, SpotImage, Booking, Review } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const review = require('../../db/models/review');
const {requireAuth} = require('../../utils/auth');

const router = express.Router();

//Get All Spots
router.get('/', async (req, res) => {
    // const { ownerId, address, city, state, country, lat, lng, name, description, price, avgRating, previewImage } = req.body;

    const spots = await Spot.findAll()

    return res.json(spots)
});

//Get Details of a Spot by Id
router.get('/:spotId', async (req, res) => {
    const spotId = req.params.spotId
    const thisSpot = await Spot.findByPk(spotId)
    if (!thisSpot){
        return res.status(404).json({
  "message": "Spot couldn't be found",
  "statusCode": 404
})
    }

    const spots = await Spot.findByPk(spotId)
    

    return res.json(spots)
})

//Edit a Spot
router.put('/:spotId', async (req, res) => {

    const getSpotId = await Spot.findByPk('spotId')
    const editSpot = await Spot.update({id: 'spotId', ownerId: 'ownerId'})
})

//Create a Spot
router.post('/', async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    // const {id} = req.user
    let id = 1
    // console.log(ownerId, 'owner')
    const createSpot = await Spot.create({ ownerId: id, address, city, state, country, lat, lng, name, description, price })

    return res.status(201).json(createSpot)
});

//Create/Add image to spot
router.post('/:spotId/images', async (req, res) => {
    const { url, preview } = req.body;

    // const spotId = req.params.spotId
    const {spotId} = req.params
    const errorImage = await Spot.findByPk(spotId)
    if(!errorImage){
        return res.status(404).json({
  "message": "Spot couldn't be found",
  "statusCode": 404
})
    }
   
    const addImage = await SpotImage.create({ spotId, url, preview })

    // console.log(addImage, 'imageeeeeeeeeeeeeeeeeee')
    return res.json({'id': addImage.id, 'url': addImage.url, 'preview': addImage.preview })

});

//Create a Booking based on spotId 
router.post('/:spotId/bookings', async (req, res) => {
    const { startDate, endDate } = req.body;

    if(endDate < startDate){
        return res.status(400).json({
  "message": "Validation error",
  "statusCode": 400,
  "errors": {
    "endDate": "endDate cannot be on or before startDate"
  }
})
    }
    const spotId = req.params.spotId
    const {id} = req.user

    const bookingQuery = await Booking.findOne({ spotId })
    if(bookingQuery){
        return res.status(403).json({
  "message": "Sorry, this spot is already booked for the specified dates",
  "statusCode": 403,
  "errors": {
    "startDate": "Start date conflicts with an existing booking",
    "endDate": "End date conflicts with an existing booking"
  }
})
    }

    const bookingForSpotId = await Booking.create({ spotId, userId: id, startDate, endDate })

    return res.json(bookingForSpotId)
})

//Get all Bookings for a Spot based on the Spot's id

router.get('/:spotId/bookings', async (req, res) => {
    const { spotId, startDate, endDate } = req.body;
    
    const spotIds = await Spot.findByPk(spotId)
    if(!spotIds){
        return res.status(404).json({
  "message": "Spot couldn't be found",
  "statusCode": 404
})
    }
    const {id} = req.user

    const bookingsForSpotId = await Booking.findAll({ userId: id, spotId, startDate, endDate })

    return res.json(bookingsForSpotId)
})


//Get all Spots owned by the Current User

router.get('/current', async (req, res) => {
    const { ownerId, address, city, state, country, lat, lng, name, description, price, avgRating, previewImage } = req.body;
    const currentUser = req.body.ownerId

    const spotForCurrentUser = await Spot.findOne({ currentUser })

    return res.json(spotForCurrentUser)
})


//Get Reviews by Spot Id
router.get('/:spotId/reviews', async (req, res) => {
    const { spotId, review, stars } = req.body

    const {id} = req.user

    
    
    const reviewsBySpotId = await Review.findAll({ userId: id, spotId, review, stars })

    return res.json(reviewsBySpotId)
})

//Create a Review for a Spot
// router.post('/:spotId/reviews', async (req, res) => {
//     const { review, stars } = req.body;

//     const {id} = req.review
//     const spotId = req.params.spotId
//     const reviewForSpot = await Review.create({ spotId, review, stars })

//     return res.json(reviewForSpot)
// })

    

module.exports = router;