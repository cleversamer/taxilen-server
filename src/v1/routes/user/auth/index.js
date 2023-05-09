const { Router } = require("express");
const setupLoginRoutes = require("./login");
const setupRegisterRoutes = require("./register");

const router = Router();

setupLoginRoutes(router);

setupRegisterRoutes(router);

module.exports = router;
