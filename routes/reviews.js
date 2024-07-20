const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require("../utils/catchAsync");
const { reviewSchema } = require('../schemas')
const {isLoggedIn,isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');
const ExpressError = require("../utils/ExpressError");

const validateReview = (req,res,next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);  
    }
    else
    {
        next();
    }
}

router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:review_id',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;