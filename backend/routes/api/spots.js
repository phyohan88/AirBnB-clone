const express = require('express');

const { Spot, SpotImage, Booking, Review, User, ReviewImage, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const review = require('../../db/models/review');
const {requireAuth} = require('../../utils/auth');
const { query } = require('express');

const router = express.Router();

//Get All Spots
router.get('/', async (req, res) => {
    // const { ownerId, address, city, state, country, lat, lng, name, description, price, avgRating, previewImage } = req.body;
    // const pageAsNumber = Number.parseInt(req.query.page);
    // const sizeAsNumber = Number.parseInt(req.query.size);


    // let page = 1;
    // if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0){
    //     page = pageAsNumber
    // }

    // let size = 10;
    // if(!Number.isNaN(sizeAsNumber)){
    //     if(sizeAsNumber > 0 && sizeAsNumber < 10){
    //         size = sizeAsNumber
    //     }
    // }
    let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;

    page = parseInt(page);
    size = parseInt(size);

    if (Number.isNaN(page)) page = 1;
    if (Number.isNaN(size)) size = 20;

    const where = { }

    if (req.query.minLat) query.where.minLat = req.query.minLat;
    if (req.query.maxLat) query.where.maxLat = req.query.maxLat;
    if (req.query.minLng) query.where.minLng = req.query.minLng;
    if (req.query.maxLng) query.where.maxLng = req.query.maxLng;
    if (req.query.minPrice) {
        if (req.query.minPrice >= 0){
            query.where.minPrice = req.query.minPrice;
        } 
    }
    if (req.query.maxPrice){
        if(req.query.minPrice >= 0){
            query.where.maxPrice = req.query.minPrice;
        }
    }

    if (req.query.maxPrice) query.where.maxPrice = req.query.maxPrice;

    const {spotId} = req.params
    const spots = await Spot.findAll({
        where, 
        limit: size,
        offset: size * (page - 1)
    })
    let emptyArr = [];
        for (let spot of spots) {
            spot = spot.toJSON()
            emptyArr.push(spot)
        }
        // console.log(previewImage.url, 'previewImage')
        // console.log(spot['previewImage'])
        // console.log(emptyArr, 'empty array ====')

        for(let spot of emptyArr){
            const previewImage = await SpotImage.findOne({
                    where: {spotId: spot.id},
                    attributes: [
                        'url'
                    ]
                })
        if(previewImage){

            spot['previewImage'] = previewImage.url
        }
        
        const starsForReview = await Review.findAll({ raw: true,
            where: {spotId: spot.id},
            attributes: {
                include: [
                    [
                        sequelize.fn("AVG", sequelize.col("stars")),
                        "avgRating"
                    ]
                ]
            }
        })
            spot['avgRating'] = starsForReview[0].avgRating

        // console.log(starsForReview[0], 'avg rating =====')
        // console.log(starsForReview, 'star for review')
        // console.log(previewImage, 'previewImage')
        // console.log(spot['previewImage'])
    }
    

    // console.log(spots, '===========spot========')

    return res.json({Spot: emptyArr, page, size})
    // return res.json({Spots: spots, 'previewImage': SpotImage.url})
});

//Get all Spots owned by the Current User

router.get('/current', requireAuth, async (req, res) => {
    // const { ownerId, address, city, state, country, lat, lng, name, description, price, avgRating, previewImage } = req.body;
    // const currentUser = await Session.findOne('userId')
    const {id} = req.user;

    let spotForCurrentUser = await Spot.findOne(
        {where: {ownerId: id},
            include: [{model: Review}]
        }
    )
    let sameSpot = await Spot.findOne(
        {where: {ownerId: id}})

        sameSpot = sameSpot.toJSON()

        // console.log(spotForCurrentUser.toJSON().Reviews[0].id, 'spottttt currrent user')
        const reviewIdForImage = spotForCurrentUser.toJSON().Reviews[0].id
        const reviewImage = await ReviewImage.findOne({
            where: {reviewId: reviewIdForImage}
        })
        // console.log(reviewImage, 'review image ======')
        // const reviewImage = await ReviewImage.findOne({where: {
        //     reviewId: 
        // }})
        const reviews = spotForCurrentUser.Reviews
        let starSum = 0
        let starLength = 0
        for(let review of reviews){
            starSum += review.stars
            starLength += 1
        }
        const avgStars = starSum / starLength
        sameSpot.avgStarRating = avgStars
        if(reviewImage){

            sameSpot.previewImage = reviewImage.url
        } else {
            sameSpot.previewImage = null
        }

    return res.json(sameSpot)
})

//Get Details of a Spot by Id
router.get('/:spotId', async (req, res) => {
    const spotId = req.params.spotId
    

    const thisSpot = await Spot.findByPk(spotId, 
        {
            include: {model: SpotImage, attributes: ['id', 'url', 'preview']}
        })
    // console.log(thisSpot, 'this spot ======')
    if (!thisSpot){
        return res.status(404).json(
            {
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
    }

    let spot = await Spot.findByPk(spotId, 
        {
            include: [{model: SpotImage, attributes: ['id', 'url', 'preview']}, {model: User, attributes: ['id', 'firstName', 'lastName']}], 
            
        })
        spot = spot.toJSON()
        spot.Owner = spot.User
        delete spot.User

    const reviews = await Review.findAll({where: {spotId: spotId}})
    let sum = 0   
        for (let review of reviews){
            sum += review.stars
        }

    let avg = sum /reviews.length
    // console.log(reviews.length, 'reviewwwwwwwws length')
        spot.numReviews = reviews.length
        spot.avgStarRating = avg
    // await spot.save()
    return res.json(spot)
})

//Edit a Spot
router.put('/:spotId', requireAuth, async (req, res) => {
   const spotId = req.params.spotId
//    const {spotId} = req.params
    const getSpotId = await Spot.findByPk(spotId)
    // console.log(getSpotId, 'SPOTTTTTTTTTTTTTTTT')
    
    if(!getSpotId){
        return res.status(404).json(
            {
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
    }
    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    if(!address || !city || !state || !country || !lat || !lng || !name || !description || !price){
        return res.status(400).json(
            {
                "message": "Validation Error",
                "statusCode": 400,
                "errors": {
                    "address": "Street address is required",
                    "city": "City is required",
                    "state": "State is required",
                    "country": "Country is required",
                    "lat": "Latitude is not valid",
                    "lng": "Longitude is not valid",
                    "name": "Name must be less than 50 characters",
                    "description": "Description is required",
                    "price": "Price per day is required"
                }
            })
    }
    getSpotId.update({
        // ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    return res.json(getSpotId)
})

//Create a Spot
router.post('/', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const {id} = req.user
    // let id = 1
    // console.log(ownerId, 'owner')
    if(!address || !city || !state || !country || !lat || !lng || !name || !description || !price){
        return res.status(400).json(
            {
                "message": "Validation Error",
                "statusCode": 400,
                "errors": {
                    "address": "Street address is required",
                    "city": "City is required",
                    "state": "State is required",
                    "country": "Country is required",
                    "lat": "Latitude is not valid",
                    "lng": "Longitude is not valid",
                    "name": "Name must be less than 50 characters",
                    "description": "Description is required",
                    "price": "Price per day is required"
                }
            })
    }

    const createSpot = await Spot.create({ ownerId: id, address, city, state, country, lat, lng, name, description, price })

    return res.status(201).json(createSpot)
});

//Create/Add image to spot
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { url, preview } = req.body;

    // const spotId = req.params.spotId
    const {spotId} = req.params
    const errorImage = await Spot.findByPk(spotId)
    if(!errorImage){
        return res.status(404).json(
            {
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
    }
   
    const addImage = await SpotImage.create({ spotId, url, preview })

    // console.log(addImage, 'imageeeeeeeeeeeeeeeeeee')
    return res.json({'id': addImage.id, 'url': addImage.url, 'preview': addImage.preview })

});

//Create a Booking based on spotId 
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { startDate, endDate } = req.body;

    if(endDate < startDate){
        return res.status(400).json(
            {
                "message": "Validation error",
                "statusCode": 400,
                "errors": {
                    "endDate": "endDate cannot be on or before startDate"
                }
            })
    }
    const spotId = +req.params.spotId
    // console.log(typeof spotId, ':typeof =================')
    const {id} = req.user
    // console.log(spotId, 'spotId ======')
    const bookingQuery = await Spot.findByPk( spotId )
    // console.log(bookingQuery, 'bookin query')
    if(!bookingQuery){
        return res.status(404).json(
            {
                "message": "Spot couldn't be found",
                "statusCode": 404
            }
    )}

    const bookingDates = await Booking.findAll({
        where: {spotId}
    })
    console.log(bookingDates, 'dates ===========')

    for(let booking of bookingDates){
      let startdateBooking =  booking.startDate
      let enddateBooking = booking.endDate
        if (startDate === startdateBooking || endDate === enddateBooking){
            return res.status(403).json(
                {
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "statusCode": 403,
                    "errors": {
                        "startDate": "Start date conflicts with an existing booking",
                        "endDate": "End date conflicts with an existing booking"
                    }
                }
            )
        }
    }
    const bookingForSpotId = await Booking.create({ spotId: spotId, userId: id, startDate, endDate })

    return res.json(bookingForSpotId)
})

//Get all Bookings for a Spot based on the Spot's id

router.get('/:spotId/bookings', async (req, res) => {
    // const { spotId, startDate, endDate } = req.body;
    const {spotId} = req.params
    const {id} = req.user

    let checkError = await Spot.findByPk(spotId)
    if(!checkError){
        return res.status(404).json(
            {
                "message": "Spot couldn't be found",
                "statusCode": 404
            })  
    }

    let checkUser = await Spot.findByPk(spotId)
        if(checkUser.ownerId !== id){
            let noOwner = await Booking.findAll({
                where: {spotId},
                attributes: ['spotId', 'startDate', 'endDate']
            })
            console.log(id, 'id ========')
            console.log(checkUser.ownerId, 'checkUser =======')
            return res.json({Bookings: noOwner})
        }
    let spotIds = await Booking.findAll({
            where: {spotId},
        
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }       
        })
    // spotIds = spotIds.toJSON()
    // console.log(spotIds, 'SPOTID')
    
    // const {id} = req.user
    // const bookingsForSpotId = await Booking.findAll({ where: {spotId}})
    return res.json({Bookings: spotIds})
})

//Get Reviews by Spot Id
router.get('/:spotId/reviews', async (req, res) => {
    // const { spotId, review, stars } = req.body
    // const {id} = req.user
    const { spotId } = req.params

    let existingSpot = await Review.findOne({
        where: {spotId: spotId}
    
    })
    if(!existingSpot){
        return res.status(404).json(
            {
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
    }
    console.log(existingSpot, 'existing spot ======')
    
    const reviewsBySpotId = await Review.findAll(
        {
            where: {spotId: spotId},
            attributes: [
                'id',
                'spotId',
                'userId',
                'review',
                'stars',
                'createdAt',
                'updatedAt',
            ],
            include: [
                {model: User, attributes: ['id', 'firstName', 'lastName']},
                {model: ReviewImage, attributes: ['id', 'url']}
            ]
        })
    
    
    return res.json(reviewsBySpotId)
})

// Create a Review for a Spot
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const { review, stars } = req.body;
    // console.log(review, stars, "HELLLLLLLLLLLLLLLLLO")
    if(!review){
        return res.status(400).json(
            {
                "message": "Validation error",
                "statusCode": 400,
                "errors": {
                    "review": "Review text is required"
                }
            })
    } else if (!stars || typeof(stars) !== "number" || stars < 1 || stars > 5) {
        return res.status(400).json(
            {
                "message": "Validation error",
                "statusCode": 400,
                "errors": {
                    "stars": "Stars must be an integer from 1 to 5"
                }
            })
    }
    console.log(review, 'review')
    const {spotId} = req.params
    const numSpotId = Number(spotId)
    // console.log(spotId,'spooooooooootIddddddd', typeof(spotId))
    // console.log(numSpotId,'spooooooooootIddddddd', typeof(numSpotId))
    const {id} = req.user
    const userId = req.user.id
    // console.log(userId, 'iddddddddddddddddddddd')
   
    const existingReview = await Review.findOne({
        where: {
            spotId: spotId,
            userId: id
        }
    })
    console.log(existingReview, '===existing review ===')

    if(existingReview){
        return res.status(403).json(
            {
                "message": "User already has a review for this spot",
                "statusCode": 403
            })
    }
    const errorReviews = await Spot.findOne({raw: true,
        where: {
            id: req.params.spotId,
        },
        include: {model: Review, as: 'Reviews'}   
    });


    console.log(errorReviews, 'heloooooooooooo!!!')
    if(!errorReviews){
        return res.status(404).json(
            { 
                "message": "Spot couldn't be found", 
                "statusCode": 404
            })
    }

    const reviewForSpot = await Review.create({ userId: id, spotId: numSpotId, review, stars })
    //  if(userId === reviewForSpot.id)
    // console.log(reviewForSpot, 'helllllloooooooooooooo')
    // return res.json(reviewForSpot)
    return res.json({'id': reviewForSpot.id, 'userId': reviewForSpot.userId, 'spotId': reviewForSpot.spotId, 'review': reviewForSpot.review, 'stars': reviewForSpot.stars, 'createdAt': reviewForSpot.createdAt, 'updatedAt': reviewForSpot.updatedAt })

})

// Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const deleteSpot = await Spot.findOne({where: {id: req.params.spotId}})
    console.log(deleteSpot, 'delete spot =====')
    if(!deleteSpot){
        return res.status(404).json(
            {
                "message": "Spot couldn't be found",
                "statusCode": 404
            }
        )
    }
    deleteSpot.destroy();
    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})    

module.exports = router;