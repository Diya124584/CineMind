const db = require("../config/db");

// =====================
// ADD TO WATCHLIST
// =====================

exports.addToWatchlist = (req, res) => {

    const userId = req.user.id;

    const {
        movie_id,
        movie_title,
        poster_path
    } = req.body;

    const sql = `
        INSERT INTO watchlist
        (user_id, movie_id, movie_title, poster_path)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [userId, movie_id, movie_title, poster_path],
        (err) => {

            if (err) {

                return res.status(500).json({
                    message: "Movie already exists or database error",
                    error: err
                });

            }

            res.status(201).json({
                message: "Movie added to watchlist"
            });

        }
    );

};


// =====================
// GET WATCHLIST
// =====================

exports.getWatchlist = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT *
        FROM watchlist
        WHERE user_id = ?
        AND watched = FALSE
        ORDER BY added_at DESC
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {

            return res.status(500).json(err);

        }

        res.json(result);

    });

};


// =====================
// MARK AS WATCHED
// =====================

exports.markAsWatched = (req, res) => {

    const userId = req.user.id;

    const movieId = req.params.movieId;

    const sql = `
        UPDATE watchlist
        SET watched = TRUE,
            watched_at = NOW()
        WHERE user_id = ?
        AND movie_id = ?
    `;

    db.query(sql, [userId, movieId], (err) => {

        if (err) {

            return res.status(500).json({
                message: "Database Error"
            });

        }

        res.json({
            message: "Movie marked as watched."
        });

    });

};


// =====================
// GET WATCHED MOVIES
// =====================

exports.getWatchedMovies = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT *
        FROM watchlist
        WHERE user_id = ?
        AND watched = TRUE
        ORDER BY watched_at DESC
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {

            return res.status(500).json(err);

        }

        res.json(result);

    });

};


// =====================
// REMOVE FROM WATCHLIST
// =====================

exports.removeFromWatchlist = (req, res) => {

    const userId = req.user.id;

    const movieId = req.params.movieId;

    const sql = `
        DELETE FROM watchlist
        WHERE user_id = ?
        AND movie_id = ?
    `;

    db.query(sql, [userId, movieId], (err) => {

        if (err) {

            return res.status(500).json(err);

        }

        res.json({
            message: "Movie removed"
        });

    });

};