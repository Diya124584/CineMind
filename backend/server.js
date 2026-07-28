const express = require("express");
const cors = require("cors");
const watchlistRoutes = require("./routes/watchlistRoutes");
const movieRoutes = require("./routes/movieRoutes");
const aiRoutes = require("./routes/aiRoutes");

require("dotenv").config();

require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/authRoutes");
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("🚀 CineMind Backend Running");
});

const verifyToken = require("./middleware/authMiddleware");

app.get("/profile", verifyToken, (req, res) => {

    res.json({
        message: "Welcome!",
        user: req.user
    });

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});