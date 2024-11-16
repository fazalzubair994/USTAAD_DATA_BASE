const express = require("express");
const { getRouteInfo } = require("../controllers/routeInfoController");
const router = express.Router();

router.get("/", getRouteInfo);

module.exports = router;
