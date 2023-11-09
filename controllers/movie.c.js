const movieModel = require("../models/movie.m");
const hbsH = require("../helpers/hbs_helper");

exports.searchMovie = async (req, res, next) => {
  try {
    const { searchKey, searchType, perPage = 8, currentPage = 1 } = req.query;
    const isLogin = !!req.session.uid;
    const movieList = await movieModel.searchByTitle({ title: searchKey });

    if (searchType === "cast") {
      res.redirect(
        `/cast/search?searchType=${searchType}&searchKey=${searchKey}`,
      );
    }

    const totalPage = Math.ceil(movieList.length / perPage);

    res.render("list-movie", {
      title: "List Movie",
      movieList: movieList.splice((currentPage - 1) * perPage, perPage),
      totalPage,
      currentPage,
      searchKey,
      isLogin,
      helpers: hbsH,
    });
  } catch (error) {
    next(error);
  }
};

exports.detailMovie = async (req, res, next) => {
  try {
    const { movieID } = req.params;
    const isLogin = !!req.session.uid;
    const movieData = await movieModel.getDetail(movieID);

    res.render("detail-movie", {
      title: "Detail Movie",
      movieData,
      isLogin,
      account_id: req.session.uid,
    });
  } catch (error) {
    next(error);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const { movieID } = req.params;
    let { page = 1, per_page = 5 } = req.query;

    page = Number.parseInt(page);
    per_page = Number.parseInt(per_page);

    const reviewData = await movieModel.getReview(movieID);

    const total_page = Math.ceil(reviewData.length / per_page);

    res.json({
      data: reviewData.splice((page - 1) * per_page, per_page),
      total_page,
      page,
      per_page,
    });
  } catch (error) {
    next(error);
  }
};

exports.favoriteMovie = async (req, res, next) => {
  try {
    const { perPage = 8, currentPage = 1 } = req.query;
    const isLogin = !!req.session.uid;

    if (!isLogin) {
      res.redirect("/login");
      return;
    }

    const movieList = await movieModel.getFavoriteMovie({
      account_id: req.session.uid,
    });

    const totalPage = Math.ceil(movieList.length / perPage);

    res.render("list-movie", {
      title: "Favorite Movie",
      movieList: movieList.splice((currentPage - 1) * perPage, perPage),
      totalPage,
      currentPage,
      isLogin,
      helpers: hbsH,
    });
  } catch (error) {
    next(error);
  }
};

exports.addFavoriteMovie = async (req, res, next) => {
  try {
    const { movie_id, account_id } = req.body;
    const movie = await movieModel.addFavoriteMovie({ movie_id, account_id });
    res.json(movie);
  } catch (error) {
    next(error);
  }
};
