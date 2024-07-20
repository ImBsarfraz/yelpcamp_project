const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer  = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({ storage });

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('images'),validateCampground, catchAsync(campgrounds.CreateNewCampground))
    
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
.get(catchAsync(campgrounds.ShowCampground))
.put(isLoggedIn,isAuthor,upload.array('images'),validateCampground, catchAsync(campgrounds.UpdateCampground))
.delete(isLoggedIn ,isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit",isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditFom));


module.exports = router;