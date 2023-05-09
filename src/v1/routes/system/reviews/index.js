const { Router } = require("express");
const setupCommonRoutes = require("./common");
const setupAdminRoutes = require("./admin");

const router = Router();

setupCommonRoutes(router);

setupAdminRoutes(router);

module.exports = router;
