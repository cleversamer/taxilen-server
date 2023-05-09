const { authController } = require("../../../controllers");
const { authValidator } = require("../../../middleware/validation");

module.exports = (router) => {
  router.post(
    "/login/any",
    authValidator.validateLoginWithEmailOrPhone,
    authController.loginWithEmailOrPhone
  );

  router.post(
    "/login/email",
    authValidator.validateLoginWithEmail,
    authController.loginWithEmail
  );

  router.post(
    "/login/phone",
    authValidator.validateLoginWithPhone,
    authController.loginWithPhone
  );

  router.post(
    "/login/google",
    authValidator.validateLoginWithGoogle,
    authController.loginWithGoogle
  );
};
