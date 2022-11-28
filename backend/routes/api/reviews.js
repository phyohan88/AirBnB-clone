const express = require('express');

const { Review, Spot, SpotImage, Booking, User, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//Get all Reviews of the current User
router.get('/current', requireAuth, async (req, res) => {
    const {id} = req.user;
    // const id = req.user.id
    // console.log(id, "HEYYYYYYYYYYYYYY")

    const reviewForCurrentUser = await Review.findAll({
        where: {userId: id},
        attributes: [
            'id',
            'userId',
            'spotId', 
            'review', 
            'stars', 
            'createdAt',
            'updatedAt'
        ]
    })
    console.log(reviewForCurrentUser, 'review for current user')
    // reviewForCurrentUser.foro(async ele => {
    let emptyArr = [];
    for (let ele of reviewForCurrentUser){
        ele = ele.toJSON()
        console.log(typeof ele, 'element .................')
        const user = await User.findOne({
            where: {id: id},
            attributes: [
                'id',
                'firstName',
                'lastName'
            ]
        })
        const spot = await Spot.findOne({raw: true,
            where: {id: ele.spotId},
            attributes: [
                'id',
                'ownerId',
                'address',
                'city',
                'state',
                'country',
                'lat',
                'lng',
                'name',
                'price'
                // 'previewImage'
            ]
        })
        const reviewImages = await ReviewImage.findAll({
        where: {reviewId: ele.id},
        attributes: [
            'id',
            'url'
        ]
        })

        const previewImage = await SpotImage.findOne({raw: true,
            where: {spotId: ele.spotId},//spot.id = spotImages.spotId
            attributes: [
                'url'
            ]
        })
        // console.log(user,'user====================')
        // console.log(user.id, 'user.id ===============')
        // spot = spot.toJSON()
        spot.previewImage = previewImage.url
        console.log(previewImage, 'preview imageeeeeeee')
        console.log(spot, 'spottttt ====================')
        ele['User'] = user
        ele['Spot'] = spot
        ele['ReviewImages'] = reviewImages
        // ele['Spot']['previewImage'] = previewImage
        
        emptyArr.push(ele)
    }
    // console.log(reviewForCurrentUser, 'helooooooooooooo')
    // reviewForCurrentUser.forEach(review => {
    //     console.log(review.toJSON().id)
    // })
    return res.json({Review: emptyArr})
})

//Edit a Review 
router.put('/:reviewId', requireAuth, async (req, res) => {
    const {reviewId} = req.params
    // console.log(reviewId, 'REVIEW ID')
    const editReview = await Review.findByPk(reviewId)

    if(!editReview){
        return res.status(404).json(
            {
                "message": "Review couldn't be found",
                "statusCode": 404
            }
        )
    }

    const {review, stars} = req.body;
    if(!review || !stars || stars < 1 || stars > 5){
        return res.status(400).json(
            {
                "message": "Validation error",
                "statusCode": 400,
                "errors": {
                    "review": "Review text is required",
                    "stars": "Stars must be an integer from 1 to 5"
                }
            })
    }
    
    editReview.update({
        userId: req.userId,
        spotId: req.spotId,
        review,
        stars
    })
    return res.json(editReview)
})

//Create an image for a Review
router.post('/:reviewId/images', async (req, res) => {
    const { url } = req.body;
    // console.log(req.params, 'req params')
    const reviewId  = req.params.reviewId
    // console.log(reviewId, 'review iddddddddddd')
    const errorReviewImage = await Review.findByPk(reviewId)
    if (!errorReviewImage){
        return res.status(404).json(
            {
                "message": "Review couldn't be found",
                "statusCode": 404
            })
    }
    
    const addImageReview = await ReviewImage.create({ reviewId, url })

    return res.json({'id': addImageReview.id, 'url': addImageReview.url})
})

// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const deleteReview = await Review.findOne({where: {id: req.params.reviewId}})

    if(!deleteReview){
        return res.status(404).json(
            {
                "message": "Review couldn't be found",
                "statusCode": 404
            }
        )
    }
    console.log(deleteReview, 'delete review')
    deleteReview.destroy();
    return res.json(
        {
            "message": "Successfully deleted",
            "statusCode": 200
        }
    )
})


module.exports = router;