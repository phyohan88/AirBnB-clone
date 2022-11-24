const express = require('express');

const { Spot, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//Get All Spots
router.get('/', async (req, res) => {
    // const { ownerId, address, city, state, country, lat, lng, name, description, price, avgRating, previewImage } = req.body;

    const spots = await Spot.findAll()

    return res.json(spots)
});

//Create a Spot
router.post('/', async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const {id} = req.user
    // console.log(ownerId, 'owner')
    const createSpot = await Spot.create({ ownerId: id, address, city, state, country, lat, lng, name, description, price })

    return res.status(201).json(createSpot)
});

//Create/Add image to spot
router.post('/:spotId/images', async (req, res) => {
    const { url, preview } = req.body;

    const spotId = req.params.spotId
   
    const addImage = await SpotImage.create({ spotId, url, preview })

    return res.json(addImage)
})
    

module.exports = router;