const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {

    addToWatchlist,

    getWatchlist,

    markAsWatched,

    getWatchedMovies,

    removeFromWatchlist

} = require("../controllers/watchlistController");


// =====================
// ADD TO WATCHLIST
// =====================

router.post(
    "/add",
    verifyToken,
    addToWatchlist
);


// =====================
// GET WATCHLIST
// =====================

router.get(
    "/",
    verifyToken,
    getWatchlist
);


// =====================
// MARK AS WATCHED
// =====================

router.put(
    "/watched/:movieId",
    verifyToken,
    markAsWatched
);


// =====================
// GET WATCHED MOVIES
// =====================

router.get(
    "/watched",
    verifyToken,
    getWatchedMovies
);


// =====================
// REMOVE FROM WATCHLIST
// =====================

router.delete(
    "/:movieId",
    verifyToken,
    removeFromWatchlist
);

module.exports = router;