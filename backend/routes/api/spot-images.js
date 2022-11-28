const express = require('express');

const {SpotImage, Spot} = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();


//Delete a Spot Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const deleteSpotImage = await SpotImage.findByPk(req.params.imageId)
    // console.log(deleteSpotImage, 'deleting spot image')
    // console.log(req.params, 'parammmmmmms')
    if (!deleteSpotImage){
        return res.status(404).json(
            {
                "message": "Spot Image couldn't be found",
                "statusCode": 404
            }
        )
    }

    await deleteSpotImage.destroy();
    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})



module.exports = router;