import {
    getTrendingMovies,
    getAIRecommendations,
    getTrailer,
    getMovieBreakdown,
    getWatchlist,
    removeWatchlist,
    markWatched,
    getWatchedMovies
} from "./api.js";

let currentHeroMovie = null;
const heroBreakdownBtn = document.getElementById("heroBreakdown");

// ================= HERO =================

async function loadHero() {

    const hero = document.getElementById("hero");

    hero.classList.remove("show");
    hero.classList.add("hidden");

    try {

        console.log("Loading trending movies...");

        const movies = await getTrendingMovies();

        console.log("Movies:", movies);

        if (!movies || movies.length === 0) {
            console.log("No movies returned");
            return;
        }

        const movie = movies[0];

        currentHeroMovie = movie;

        document.getElementById("hero-title").textContent = movie.title;

        document.getElementById("hero-overview").textContent =
            movie.overview.length > 160
                ? movie.overview.substring(0, 160) + "..."
                : movie.overview;

        document.getElementById("hero-rating").textContent =
            `⭐ ${movie.vote_average.toFixed(1)}`;

        document.getElementById("hero-year").textContent =
            movie.release_date?.substring(0, 4) || "N/A";

        hero.style.backgroundImage = `
            linear-gradient(
                rgba(0,0,0,.35),
                rgba(0,0,0,.65)
            ),
            url(https://image.tmdb.org/t/p/original${movie.backdrop_path})
        `;

        hero.classList.remove("hidden");
        hero.classList.add("show");

        console.log("Hero loaded successfully");

    } catch (error) {

        console.error("Error loading hero:", error);

    }

}

loadHero();

document
    .querySelector(".watch-btn")
    .addEventListener("click", openTrailer);

async function openTrailer() {

    if (!currentHeroMovie) return;

    try {

        const trailer = await getTrailer(currentHeroMovie.id);

        if (trailer?.url) {

            window.open(trailer.url, "_blank");

        } else {

            window.open(
                `https://www.youtube.com/results?search_query=${encodeURIComponent(currentHeroMovie.title + " trailer")}`,
                "_blank"
            );

        }

    } catch (error) {

        console.error("Error loading trailer:", error);

    }

}

heroBreakdownBtn.addEventListener("click", async () => {

    if (!currentHeroMovie) return;

    heroBreakdownBtn.disabled = true;
    heroBreakdownBtn.textContent = "Generating...";

    try {

        const result = await getMovieBreakdown({

            title: currentHeroMovie.title,

            overview: currentHeroMovie.overview,

            genres: currentHeroMovie.genre_ids.join(", ")

        });

        document.getElementById("aiText").textContent =
    result.breakdown;

document.getElementById("aiModal").style.display =
    "flex";

    } catch (err) {

        console.error(err);
        alert("Couldn't generate AI Breakdown.");

    }

    heroBreakdownBtn.disabled = false;
    heroBreakdownBtn.innerHTML = "✨ AI Breakdown";

});

// ================= AI SEARCH =================

document
    .getElementById("searchBtn")
    .addEventListener("click", loadAI);

async function loadAI() {

    const prompt =
        document.getElementById("aiPrompt").value.trim();

    if (!prompt) return;

    const container =
        document.getElementById("aiResults");

    container.innerHTML = `
        <div class="loading">
            <h2>🎬 Finding the perfect movies...</h2>
        </div>
    `;

    try {

        const result = await getAIRecommendations(prompt);

        sessionStorage.setItem(
            "recommendations",
            JSON.stringify(result.movies)
        );

        sessionStorage.setItem(
            "breakdown",
            result.breakdown
        );

        renderBreakdown(result.breakdown);

        renderMovies(result.movies);

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="loading">
                <h2>❌ Something went wrong.</h2>
                <p>Please try again.</p>
            </div>
        `;

    }

}

async function loadMood(prompt) {

    const container = document.getElementById("aiResults");

    container.innerHTML = `
        <div class="loading">
            <h2>🎬 Finding the perfect movies...</h2>
        </div>
    `;

    try {

        const result = await getAIRecommendations(prompt);

        sessionStorage.setItem(
            "recommendations",
            JSON.stringify(result.movies)
        );

        sessionStorage.setItem(
            "breakdown",
            result.breakdown
        );

        renderBreakdown(result.breakdown);

renderMovies(result.movies);

// Wait one frame so the new content is fully rendered
requestAnimationFrame(() => {

    document.getElementById("aiBreakdown").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});

    } catch (err) {

        console.error(err);

        container.innerHTML = `
            <div class="loading">
                <h2>Couldn't load recommendations.</h2>
            </div>
        `;

    }

}

// ================= AI BREAKDOWN =================

function renderBreakdown(text) {

    let card = document.getElementById("aiBreakdown");

    if (!card) {

        card = document.createElement("div");

        card.id = "aiBreakdown";

        card.className = "ai-breakdown";

        const results = document.getElementById("aiResults");

        results.parentNode.insertBefore(card, results);

    }

    card.innerHTML = `
        <h2>🧠 AI Breakdown</h2>
        <p>${text}</p>
    `;

}

async function loadWatchlist() {

    const token = localStorage.getItem("token");
    const section = document.getElementById("watchlist");

    if (!token) {
        section.style.display = "none";
        return;
    }

    const grid = document.getElementById("watchlistGrid");
    const movies = await getWatchlist(token);

    if (!movies.length) {
        section.style.display = "none";
        return;
    }

    section.style.display = "block";
    grid.innerHTML = "";

    movies.forEach(movie => {

        grid.innerHTML += `
        <div class="movie-card">

            <img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                onclick="location.href='movie.html?id=${movie.movie_id}'">

            <div class="card-info">

                <h3>${movie.movie_title}</h3>

                <div class="watchlist-actions">

                    <button
                        class="watched-btn"
                        data-id="${movie.movie_id}">
                        ✓ Watched
                    </button>

                    <button
                        class="remove-btn"
                        data-id="${movie.movie_id}">
                        Remove
                    </button>

                </div>

            </div>

        </div>
        `;
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {

    btn.onclick = async () => {

        await removeWatchlist(btn.dataset.id, token);

        loadWatchlist();
        loadWatched();

    };

});

    document.querySelectorAll(".watched-btn").forEach(btn => {

        btn.onclick = async () => {

            await markWatched(btn.dataset.id, token);

            loadWatchlist();
            loadWatched();

        };

    });

}

async function loadWatched() {

    const token = localStorage.getItem("token");
    const section = document.getElementById("watchedSection");

    if (!token) {
        section.style.display = "none";
        return;
    }

    const grid = document.getElementById("watchedGrid");
    const movies = await getWatchedMovies(token);

    if (!movies.length) {
        section.style.display = "none";
        return;
    }

    section.style.display = "block";
    grid.innerHTML = "";

    movies.forEach(movie => {

        grid.innerHTML += `
        <div class="movie-card">

            <img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                onclick="location.href='movie.html?id=${movie.movie_id}'">

            <div class="card-info">

    <h3>${movie.movie_title}</h3>

    <div class="watchlist-actions">

        <span class="watched-label">
            ✅ Watched
        </span>

        <button
            class="remove-btn watched-remove-btn"
            data-id="${movie.movie_id}">

            Remove

        </button>

    </div>

</div>

        </div>
        `;
    });

    document.querySelectorAll(".watched-remove-btn").forEach(btn => {

    btn.onclick = async () => {

        await removeWatchlist(btn.dataset.id, token);

        loadWatched();

    };

});

}
// ================= RENDER MOVIES =================

function renderMovies(movies) {

    const container =
        document.getElementById("aiResults");

    container.innerHTML = "";

    if (!movies || movies.length === 0) {

        container.innerHTML = `
            <div class="loading">
                <h2>No movies found.</h2>
            </div>
        `;

        return;

    }

    movies.forEach(movie => {

        const poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "images/no-poster.png";

        container.innerHTML += `

            <div
                class="movie-card"
                onclick="location.href='movie.html?id=${movie.id}'"
            >

                <img
                    src="${poster}"
                    alt="${movie.title}">

                <div class="card-info">

                    <h3>${movie.title}</h3>

                    <span>
                        ⭐ ${movie.vote_average.toFixed(1)}
                    </span>

                </div>

                <p class="year">
                    ${movie.release_date?.substring(0,4) || "N/A"}
                </p>

            </div>

        `;

    });

}


// ================= RESTORE SESSION =================

const savedBreakdown = sessionStorage.getItem("breakdown");

if (savedBreakdown) {

    renderBreakdown(savedBreakdown);

}

const savedMovies = sessionStorage.getItem("recommendations");

if (savedMovies) {

    renderMovies(JSON.parse(savedMovies));

}

document.getElementById("closeAI").onclick = () => {

    document.getElementById("aiModal").style.display =
        "none";

};

window.onclick = (e) => {

    if (e.target.id === "aiModal") {

        document.getElementById("aiModal").style.display =
            "none";

    }

};

// ================= MOOD CARDS =================

document.getElementById("movieNight").onclick = () =>
    loadMood(
        "Recommend fun blockbuster movies perfect for a movie night with friends or family."
    );

document.getElementById("emotional").onclick = () =>
    loadMood(
        "Recommend emotional movies that are heartfelt, touching, and likely to make someone cry."
    );

document.getElementById("mind").onclick = () =>
    loadMood(
        "Recommend mind-blowing movies with shocking plot twists and intelligent storytelling."
    );

document.getElementById("horror").onclick = () =>
    loadMood(
        "Recommend genuinely scary horror movies with suspense and terrifying atmosphere."
    );

document.getElementById("romance").onclick = () =>
    loadMood(
        "Recommend romantic movies perfect for a date night with great chemistry and a satisfying love story."
    );

document.getElementById("surprise").onclick = () =>
    loadMood(
        "Recommend unique hidden gem movies from any genre that most people haven't watched."
    );

loadWatchlist();
loadWatched();
// ================= AUTH =================

const authArea = document.getElementById("authArea");

const user = JSON.parse(localStorage.getItem("user"));

if (user) {

    authArea.innerHTML = `

        <div class="user-box">

            <span>

                <i class="fa-solid fa-user"></i>

                ${user.username}

            </span>

            <button id="logoutBtn">

                Logout

            </button>

        </div>

    `;

    document
        .getElementById("logoutBtn")
        .onclick = () => {

            localStorage.clear();

            window.location.href = "login.html";

        };

} else {

    authArea.innerHTML = `

        <button
            class="login-btn"
            onclick="window.location.href='login.html'">

            Login

        </button>

    `;

}