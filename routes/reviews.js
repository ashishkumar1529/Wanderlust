const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapasync");
const ExpressError = require("../utils/expressError");

const Review = require("../models/review.js");
const Listing = require("../models/listings");
const { isLoggedIn,isReviewAuthor } = require("../middleware.js");
const {validateReview} = require("../middleware.js");
const reviewcontroller = require("../controllers/reviews.js");

// Reviews route
// post route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewcontroller.createReview));

// Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewcontroller.deleteReview));

module.exports = router;