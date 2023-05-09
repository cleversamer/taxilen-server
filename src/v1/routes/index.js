const router = require("express").Router();
const authRoute = require("./user/auth");
const usersRoute = require("./user/users");
const loginActivitiesRoute = require("./user/loginActivities");
const reviewsRoute = require("./system/reviews");
const errorsRoute = require("./system/errors");
const advertisementsRoute = require("./system/advertisements");

const routes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: usersRoute,
  },
  {
    path: "/activities/login",
    route: loginActivitiesRoute,
  },
  {
    path: "/reviews",
    route: reviewsRoute,
  },
  {
    path: "/errors",
    route: errorsRoute,
  },
  {
    path: "/advertisements",
    route: advertisementsRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
