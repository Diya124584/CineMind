const express = require("express");

const router = express.Router();

const {
    recommendMovies,
    movieBreakdown
} = require("../controllers/aiController");

router.post("/recommend", recommendMovies);
router.post("/movie-breakdown", movieBreakdown);

module.exports = router;