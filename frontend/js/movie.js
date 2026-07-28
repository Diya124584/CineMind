import {
    getMovie,
    getTrailer,
    getMovieBreakdown,
    addWatchlist
} from "./api.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const genres = document.getElementById("genres");
const poster = document.getElementById("poster");
const title = document.getElementById("title");
const meta = document.getElementById("meta");
const overview = document.getElementById("overview");

const trailerBtn = document.getElementById("trailer");
const watchlistBtn = document.getElementById("watchlist");


let currentMovie = null;

init();

async function init() {

    const movie = await getMovie(id);

    currentMovie = movie;

    document.querySelector(".movie-hero").style.backgroundImage =
        `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

    poster.src =
        `https://image.tmdb.org/t/p/w500${movie.poster_path}`;



    title.textContent = movie.title;

    const languageNames = {
        en: "English",
        hi: "Hindi",
        fr: "French",
        es: "Spanish",
        ko: "Korean",
        ja: "Japanese",
        ta: "Tamil",
        te: "Telugu",
        ml: "Malayalam",
        kn: "Kannada",
        zh: "Chinese",
        de: "German",
        it: "Italian"
    };

    meta.innerHTML = `
        <span>📅 ${movie.release_date.substring(0,4)}</span>
        <span>⭐ ${movie.vote_average.toFixed(1)}</span>
        <span>⏱ ${movie.runtime} mins</span>
        <span>🌐 ${languageNames[movie.original_language] || movie.original_language.toUpperCase()}</span>
    `;

    overview.textContent = movie.overview;

    genres.textContent = movie.genres
        .map(g => g.name)
        .join(" • ");

    // ================= TRAILER =================

    trailerBtn.onclick = async () => {

        const trailer = await getTrailer(id);

        if (trailer?.url) {

            window.open(trailer.url, "_blank");

        } else {

            window.open(
                `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " trailer")}`,
                "_blank"
            );

        }

    };

    // ================= WATCHLIST =================

    watchlistBtn.onclick = async () => {

        const token = localStorage.getItem("token");

        if (!token) {

            alert("Please login first.");
            return;

        }

        try {

            const result = await addWatchlist({

                movie_id: movie.id,
                movie_title: movie.title,
                poster_path: movie.poster_path

            }, token);

            alert(result.message);

        } catch (err) {

            console.error(err);
            alert("Couldn't add movie to watchlist.");

        }

    };

    // ================= AI BREAKDOWN =================

    const breakdownBtn = document.getElementById("aiBreakdown");

    breakdownBtn.onclick = async () => {

        breakdownBtn.disabled = true;
        breakdownBtn.innerHTML = "🧠 Thinking...";

        try {

            const result = await getMovieBreakdown({

                title: currentMovie.title,
                overview: currentMovie.overview,
                genres: currentMovie.genres
                    .map(g => g.name)
                    .join(", ")

            });

            document.getElementById("aiText").textContent = result.breakdown;

            document.getElementById("aiModal").style.display = "flex";

        } catch (err) {

            console.error(err);
            alert("Couldn't generate AI Breakdown.");

        }

        breakdownBtn.disabled = false;
        breakdownBtn.innerHTML = "✨ AI Breakdown";

    };

    

        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("movieContent").style.display = "block";

}

const modal = document.getElementById("aiModal");
const closeBtn = document.getElementById("closeAI");

closeBtn.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
};
