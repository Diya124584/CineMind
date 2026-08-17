const db = require("../config/db");
const gemini = require("../services/GroqService");
const tmdb = require("../services/tmdbService");

exports.recommendMovies = async (req, res) => {
    try {

        const { prompt } = req.body;

        const response = await gemini.getRecommendations(prompt);

        console.log("\n========== RAW GROQ RESPONSE ==========");
        console.log(response);

        let ai;

        try {
            ai = JSON.parse(response);
        } catch (err) {
            console.log("Invalid JSON from Groq:");
            console.log(response);

            return res.status(500).json({
                message: "Groq returned invalid JSON."
            });
        }

        console.log("\n========== MOVIE NAMES ==========");
        console.log(ai.movies);

        const movieNames = ai.movies;
        const breakdown = ai.breakdown;

        const movies = [];

        for (const name of movieNames) {

            const cleanTitle = name
                .replace(/\([^)]*\)/g, "")
                .replace(/-\s.*$/g, "")
                .replace(/\d{4}/g, "")
                .trim();

            try {

                const movie = await tmdb.searchSingleMovie(cleanTitle);

                if (movie) {
                    console.log("✅ Found:", movie.title);
                    movies.push(movie);
                } else {
                    console.log("❌ Not Found:", cleanTitle);
                }

            } catch (err) {

                console.log("❌ Error searching:", cleanTitle);
                console.error(err.message);

            }

        }

        const movieIds = movies.map(movie => movie.id);

        db.query(
            `INSERT INTO recommendation_history (user_id, prompt, movie_ids)
             VALUES (?, ?, ?)`,
            [
                1,
                prompt,
                JSON.stringify(movieIds)
            ],
            (err) => {
                if (err) {
                    console.error(err);
                }
            }
        );

        res.json({
            movies,
            breakdown
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: err.message
        });

    }
};

exports.movieBreakdown = async (req, res) => {

    try {

        const { title, overview, genres } = req.body;

        const breakdown = await gemini.getMovieBreakdown(
            title,
            overview,
            genres
        );

        res.json({
            breakdown
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: err.message
        });

    }

};