const movieModel = require("../models/movie.m");

exports.home = async (req, res, next) => {
  try {
    const isLogin = !!req.session.uid;
    const topRatingMovie = await movieModel.getTopRating();
    const topPopularMovie = await movieModel.getTopPopular();

    res.render("home", {
      title: "Home",
      isLogin,
      topRatingMovie,
      topPopularMovie,
    });
  } catch (error) {
    next(error);
  }
};
