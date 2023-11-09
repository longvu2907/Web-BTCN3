const accountModel = require("../models/account.m");
const CryptoJS = require("crypto-js");
const hashLength = 64;

exports.getLogin = async (req, res, next) => {
  try {
    if (req.session.uid) {
      return res.redirect("/");
    }
    res.render("login", { title: "login" });
  } catch (error) {
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await accountModel.getByUsername({ username });

    if (user) {
      const pwDB = user.password;

      const salt = pwDB.slice(hashLength);
      const pwSalt = password + salt;
      const pwHashed = CryptoJS.SHA3(pwSalt, {
        outputLength: hashLength * 4,
      }).toString(CryptoJS.enc.Hex);
      if (pwDB === pwHashed + salt) {
        req.session.uid = user.id;
        return res.redirect("/");
      }
    }

    res.render("login", {
      title: "login",
      validate: "is-invalid",
      error: "Wrong username or password!",
      ...req.body,
    });
  } catch (error) {
    next(error);
  }
};

exports.getRegister = async (req, res, next) => {
  try {
    res.render("register", { title: "register" });
  } catch (error) {
    next(error);
  }
};

exports.postRegister = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const userDB = await accountModel.getByUsername({ username });

    if (userDB) {
      return res.render("register", {
        title: "register",
        validate: "is-invalid",
        error: "Username existed",
        ...req.body,
      });
    }

    const salt = Date.now().toString(16);
    const pwSalt = password + salt;
    const pwHashed = CryptoJS.SHA3(pwSalt, {
      outputLength: hashLength * 4,
    }).toString(CryptoJS.enc.Hex);

    const user = await accountModel.add({
      username,
      password: pwHashed + salt,
    });

    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res, next) => {
  try {
    delete req.session.uid;
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};
