const app = require("express");
const router = app.Router();

const movieController = require("../controllers/movie.c");

router.get("/search", movieController.searchMovie);
router.get("/favorite-movie", movieController.favoriteMovie);
router.post("/favorite-movie", movieController.addFavoriteMovie);
router.get("/:movieID", movieController.detailMovie);
router.get("/:movieID/getReview", movieController.getReviews);

module.exports = router;
