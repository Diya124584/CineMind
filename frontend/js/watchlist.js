import {
    getWatchlist,
    removeWatchlist
} from "./api.js";

const token = localStorage.getItem("token");

const grid = document.getElementById("watchlistGrid");

if (!token) {

    grid.innerHTML = `

        <div class="empty">

            <i class="fa-solid fa-lock"></i>

            <h2>Login Required</h2>

            <p>Please login to view your watchlist.</p>

        </div>

    `;

} else {

    loadWatchlist();

}

async function loadWatchlist() {

    try {

        const movies = await getWatchlist(token);

        if (!movies.length) {

            grid.innerHTML = `

                <div class="empty">

                    <i class="fa-solid fa-heart-crack"></i>

                    <h2>Your Watchlist is Empty</h2>

                    <p>Save movies you love and they'll appear here.</p>

                </div>

            `;

            return;

        }

        grid.innerHTML = "";

        movies.forEach(movie => {

            const card = document.createElement("div");

            card.className = "movie-card";

            card.innerHTML = `

                <img
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    alt="${movie.movie_title}"
                >

                <div class="movie-info">

                    <h3>${movie.movie_title}</h3>

                    <button
                        class="remove-btn"
                        data-id="${movie.movie_id}"
                    >

                        <i class="fa-solid fa-trash"></i>

                        Remove

                    </button>

                </div>

            `;

            // Open movie page when clicking the card
            card.querySelector("img").addEventListener("click", () => {

                window.location.href = `movie.html?id=${movie.movie_id}`;

            });

            // Remove from watchlist
            card.querySelector(".remove-btn").addEventListener("click", async (e) => {

                e.stopPropagation();

                const movieId = e.target.closest("button").dataset.id;

                try {

                    await removeWatchlist(movieId, token);

                    loadWatchlist();

                } catch (err) {

                    console.error(err);

                    alert("Couldn't remove movie.");

                }

            });

            grid.appendChild(card);

        });

    } catch (err) {

        console.error(err);

        grid.innerHTML = `

            <div class="empty">

                <i class="fa-solid fa-circle-exclamation"></i>

                <h2>Something went wrong</h2>

                <p>Unable to load your watchlist.</p>

            </div>

        `;

    }

}