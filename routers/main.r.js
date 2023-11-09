const app = require("express");
const router = app.Router();

const mainController = require("../controllers/main.c");

router.get("", mainController.home);

module.exports = router;
