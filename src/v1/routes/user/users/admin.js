const { usersController } = require("../../../controllers");
const { userValidator } = require("../../../middleware/validation");
const auth = require("../../../middleware/auth");

module.exports = (router) => {
  router.patch(
    "/admin/role/change",
    userValidator.validateUpdateUserRole,
    auth("updateAny", "user"),
    usersController.changeUserRole
  );

  router.patch(
    "/admin/user/verify",
    userValidator.validateVerifyUser,
    auth("updateAny", "user"),
    usersController.verifyUser
  );

  router.get(
    "/admin/user/find",
    userValidator.validateFindUserByEmailOrPhone,
    auth("readAny", "user"),
    usersController.findUserByEmailOrPhone
  );

  router.get(
    "/export",
    auth("readAny", "user"),
    usersController.exportUsersToExcel
  );

  router.post(
    "/admin/notifications/send",
    userValidator.validateSendNotification,
    auth("createAny", "notification"),
    usersController.sendNotification
  );

  router.get(
    "/usage/most",
    userValidator.validateGetMostUsedUsers,
    auth("readAny", "user"),
    usersController.getMostUsedUsers
  );
};
