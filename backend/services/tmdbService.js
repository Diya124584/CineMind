const axios = require("axios");

const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: process.env.TMDB_API_KEY
    }
});

exports.getTrendingMovies = async () => {
    const response = await api.get("/trending/movie/week");
    return response.data.results;
};

exports.searchMovies = async (query) => {
    const response = await api.get("/search/movie", {
        params: {
            query
        }
    });

    return response.data.results;
};

exports.getMovieDetails = async (id) => {
    const response = await api.get(`/movie/${id}`);
    return response.data;
};

exports.searchSingleMovie = async (title) => {

    const response = await api.get("/search/movie", {
        params: {
            query: title
        }
    });

    console.log("\nTMDB Search:", title);

    console.log(
        response.data.results.map(movie => movie.title)
    );

    return response.data.results[0];
};