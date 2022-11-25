const express = require('express');

const { Review, Spot, SpotImage, Booking, Users } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//Get all Reviews of the current User

// router.get('/current', async (req, res) => {
//     const { userId, spotId, review, stars, User: {id, firstName, lastName}, Spot: {ownerId, address, city, state, country, lat, lng, name, price, previewImage}, ReviewImages: {url}} = req.body;

//     const currentUser = req.body.userId
//     const reviewForCurrentUser = await Review.findOne({ currentUser })

//     return res.json(reviewForCurrentUser)

// })





module.exports = router;