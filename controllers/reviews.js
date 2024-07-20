const Campground = require("../models/campground");
const Review = require('../models/review');

module.exports.createReview = async(req,res)=>{
    // res.send('You Made It!');
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review Added Successfully!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async(req,res)=>{
    const { id, review_id } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash('success', 'Review Deleted Successfully!');
    res.redirect(`/campgrounds/${id}`);
    // res.send('Why Dleted Me??');
}
