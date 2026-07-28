const axios = require("axios");
const tmdb = require("../services/tmdbService");

exports.getTrending = async (req, res) => {

    try {

        const movies = await tmdb.getTrendingMovies();

        res.json(movies);

    } catch (err) {

        res.status(500).json(err);

    }

};

exports.searchMovie = async (req, res) => {

    try {

        const movies = await tmdb.searchMovies(req.query.query);

        res.json(movies);

    } catch (err) {

        res.status(500).json(err);

    }

};

exports.getMovie = async (req, res) => {

    try {

        const movie = await tmdb.getMovieDetails(req.params.id);

        res.json(movie);

    } catch (err) {

        res.status(500).json(err);

    }

};

exports.getTrailer = async (req, res) => {

    try {

        const { id } = req.params;

        const response = await axios.get(

            `https://api.themoviedb.org/3/movie/${id}/videos`,

            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_TOKEN}`
                }
            }

        );

        const trailer = response.data.results.find(

            video =>
                video.type === "Trailer" &&
                video.site === "YouTube"

        );

        if (!trailer) {

            return res.json(null);

        }

        res.json({

            url: `https://www.youtube.com/watch?v=${trailer.key}`

        });

    } catch (err) {

        res.status(500).json(err);

    }

};


exports.getSimilarMovies = async (req, res) => {

    try{

        const response = await axios.get(

            `${TMDB_BASE}/movie/${req.params.id}/similar`,

            {
                params:{
                    api_key:TMDB_API_KEY
                }
            }

        );

        res.json(response.data.results);

    }catch(err){

        res.status(500).json(err);

    }

};
