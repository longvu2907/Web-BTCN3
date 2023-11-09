const app = require("express");
const router = app.Router();

const castController = require("../controllers/cast.c");

router.get("/search", castController.searchCast);
router.get("/:castID", castController.getDetail);

module.exports = router;
