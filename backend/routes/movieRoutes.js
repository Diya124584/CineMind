const express = require("express");

const router = express.Router();

const {
    getTrending,
    searchMovie,
    getMovie,
    getTrailer,
    getSimilarMovies,
    getMoviesByGenre
} = require("../controllers/movieController");

router.get("/trending", getTrending);

router.get("/search", searchMovie);

router.get("/trailer/:id", getTrailer);

router.get("/:id/similar", getSimilarMovies);

router.get("/:id", getMovie);

module.exports = router;