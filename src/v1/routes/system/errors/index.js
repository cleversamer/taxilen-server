const { Router } = require("express");
const setupAdminRoutes = require("./admin");

const router = Router();

setupAdminRoutes(router);

module.exports = router;
