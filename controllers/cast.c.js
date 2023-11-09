const castModel = require("../models/cast.m");
const hbsH = require("../helpers/hbs_helper");

exports.searchCast = async (req, res, next) => {
  try {
    const { searchKey, perPage = 5, currentPage = 1 } = req.query;
    const isLogin = !!req.session.uid;
    const castList = await castModel.searchByName({ name: searchKey });

    console.log(castList);

    const totalPage = Math.ceil(castList.length / perPage);

    res.render("list-cast", {
      title: "List Cast",
      totalPage,
      currentPage,
      searchKey,
      isLogin,
      castList: castList.splice((currentPage - 1) * perPage, perPage),
      helpers: hbsH,
    });
  } catch (error) {
    next(error);
  }
};

exports.getDetail = async (req, res, next) => {
  try {
    const isLogin = !!req.session.uid;
    const { castID } = req.params;

    const castData = await castModel.getDetail({ cast_id: castID });

    res.render("detail-cast", {
      title: "Detail Cast",
      castData,
      isLogin,
    });
  } catch (error) {
    next(error);
  }
};
