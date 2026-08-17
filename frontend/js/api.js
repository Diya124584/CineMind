const BASE_URL = "https://cinemind-t7qi.onrender.com/api";

// ================= AUTH =================

export async function register(user) {

    const response = await fetch(`${BASE_URL}/auth/register`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(user)

    });

    return response.json();

}


export async function login(user) {

    const response = await fetch(`${BASE_URL}/auth/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(user)

    });

    return response.json();

}



// ================= MOVIES =================

export async function getTrendingMovies() {

    const response =
        await fetch(`${BASE_URL}/movies/trending`);

    return response.json();

}


export async function searchMovie(query) {

    const response =
        await fetch(`${BASE_URL}/movies/search?query=${query}`);

    return response.json();

}

export async function getMovie(id){

    const response = await fetch(`${BASE_URL}/movies/${id}`);

    return response.json();

}

export async function getSimilarMovies(id){

    const response = await fetch(`${BASE_URL}/movies/${id}/similar`);

    return response.json();

}

// ================= AI =================

export async function getAIRecommendations(prompt) {

    const response = await fetch(

        `${BASE_URL}/ai/recommend`,

        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                prompt
            })

        }

    );

    return response.json();

}

export async function getMovieBreakdown(movie) {

    const response = await fetch(

        `${BASE_URL}/ai/movie-breakdown`,

        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(movie)

        }

    );

    return response.json();

}


// ================= WATCHLIST =================

export async function getWatchlist(token) {

    const response = await fetch(

        `${BASE_URL}/watchlist`,

        {

            headers: {
                Authorization: `Bearer ${token}`
            }

        }

    );

    return response.json();

}


export async function addWatchlist(movie, token) {

    const response = await fetch(

        `${BASE_URL}/watchlist/add`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify(movie)

        }

    );

    return response.json();

}

export async function removeWatchlist(movieId, token) {

    const response = await fetch(

        `${BASE_URL}/watchlist/${movieId}`,

        {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    return response.json();

}

// ================= WATCHED =================

export async function markWatched(movieId, token) {

    const response = await fetch(

        `${BASE_URL}/watchlist/watched/${movieId}`,

        {

            method: "PUT",

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    return response.json();

}


export async function getWatchedMovies(token) {

    const response = await fetch(

        `${BASE_URL}/watchlist/watched`,

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    return response.json();

}
// ================= TRAILER =================

export async function getTrailer(movieId) {

    const response = await fetch(

        `${BASE_URL}/movies/trailer/${movieId}`

    );

    return response.json();

}

