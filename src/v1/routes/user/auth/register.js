const { authController } = require("../../../controllers");
const { authValidator } = require("../../../middleware/validation");

module.exports = (router) => {
  router.post(
    "/register/email",
    authValidator.validateRegisterWithEmail,
    authController.registerWithEmailAndPhone
  );

  router.post(
    "/register/google",
    authValidator.validateRegisterWithGoogle,
    authController.registerWithGoogle
  );
};
