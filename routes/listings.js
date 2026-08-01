const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync");
const Listing = require("../models/listings.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
var multer  = require('multer');
const {storage} = require("../cloud_config.js");
var upload = multer({storage });

router.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggedIn,validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingController.createListing));


//NEW ROUTE
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,validateListing,upload.single('listing[image]'),wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));
// EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing));


module.exports = router;