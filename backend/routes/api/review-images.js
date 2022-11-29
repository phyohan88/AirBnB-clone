const express = require('express');

const { ReviewImage, Review, SpotImage, Spot} = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//Delete a Review Imgae
router.delete('/:reviewImageId', requireAuth, async (req, res) => {
    const deleteReviewImage = await ReviewImage.findByPk(req.params.reviewImageId)
    console.log(deleteReviewImage, 'delete image')

    if(!deleteReviewImage){
        return res.status(404).json(
            {
            
                "message": "Review Image couldn't be found",
                "statusCode": 404
                
            }
        )
    }
    
    await deleteReviewImage.destroy();
    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })

})




module.exports = router;