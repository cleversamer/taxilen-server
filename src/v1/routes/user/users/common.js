const { usersController } = require("../../../controllers");
const { userValidator } = require("../../../middleware/validation");
const auth = require("../../../middleware/auth");

module.exports = (router) => {
  //////////////////// AUTHENTICATE ////////////////////
  router.get(
    "/authenticate",
    userValidator.validateAuthenticateUser,
    auth("readOwn", "user", true),
    usersController.authenticateUser
  );

  //////////////////// PROFILE ////////////////////
  router.patch(
    "/profile/email/update",
    userValidator.validateUpdateEmail,
    auth("updateOwn", "user"),
    usersController.updateEmail
  );

  router.patch(
    "/profile/avatar/update",
    userValidator.validateUpdateAvatar,
    auth("updateOwn", "user"),
    usersController.updateAvatar
  );

  router.delete(
    "/profile/avatar/delete",
    auth("updateOwn", "user"),
    usersController.deleteAvatar
  );

  router.patch(
    "/profile/language/switch",
    auth("updateOwn", "user"),
    usersController.switchLanguage
  );

  router.patch(
    "/profile/link/:linkKey/update",
    userValidator.validateUpdateLink,
    auth("updateOwn", "user"),
    usersController.updateLink
  );

  router.delete(
    "/profile/link/:linkKey/remove",
    userValidator.validateRemoveLink,
    auth("updateOwn", "user"),
    usersController.removeLink
  );

  //////////////////// NOTIFICATIONS ////////////////////
  router.get(
    "/notifications/see",
    auth("readOwn", "notification"),
    usersController.seeNotifications
  );

  router.delete(
    "/notifications/clear",
    auth("deleteOwn", "notification"),
    usersController.clearNotifications
  );

  router.patch(
    "/notifications/disable",
    auth("updateOwn", "notification"),
    usersController.disableNotifications
  );

  router.patch(
    "/notifications/enable",
    auth("updateOwn", "notification"),
    usersController.enableNotifications
  );

  //////////////////// ACCOUNT DELETION ////////////////////
  router.get(
    "/account/deletion/request",
    userValidator.validateRequestAccountDeletion,
    auth("deleteOwn", "user", true),
    usersController.requestAccountDeletion
  );

  router.post(
    "/account/deletion/code/check",
    userValidator.validateCode,
    auth("readOwn", "user", true),
    usersController.checkCode("deletion")
  );

  router.get(
    "/account/deletion/confirm",
    userValidator.validateConfirmAccountDeletion,
    usersController.confirmAccountDeletion
  );

  //////////////////// EMAIL ////////////////////
  router
    .route("/email/verify")
    .get(
      auth("readOwn", "emailVerificationCode", true),
      userValidator.validateSendEmailVerificationCode,
      usersController.resendEmailOrPhoneVerificationCode("email")
    )
    .post(
      userValidator.validateCode,
      auth("updateOwn", "emailVerificationCode", true),
      usersController.verifyEmailOrPhone("email")
    );

  router.post(
    "/verification/email/code/check",
    userValidator.validateCode,
    auth("readOwn", "emailVerificationCode", true),
    usersController.checkCode("email")
  );

  router.post(
    "/email/used",
    userValidator.validateEmail,
    usersController.checkIfEmailUsed
  );

  router.get(
    "/email/verify/fast",
    userValidator.validateVerifyEmailByLink,
    usersController.verifyEmailByLink
  );

  //////////////////// PHONE ////////////////////
  router
    .route("/phone/verify")
    .get(
      auth("readOwn", "phoneVerificationCode", true),
      userValidator.validateSendPhoneVerificationCode,
      usersController.resendEmailOrPhoneVerificationCode("phone")
    )
    .post(
      userValidator.validateCode,
      auth("updateOwn", "phoneVerificationCode", true),
      usersController.verifyEmailOrPhone("phone")
    );

  router.post(
    "/verification/phone/code/check",
    userValidator.validateCode,
    auth("readOwn", "phoneVerificationCode", true),
    usersController.checkCode("phone")
  );

  router.post(
    "/phone/used",
    userValidator.validatePhone,
    usersController.checkIfPhoneUsed
  );

  //////////////////// PASSWORD ////////////////////
  router
    .route("/password/forgot")
    .get(
      userValidator.validateSendForgotPasswordCode,
      usersController.sendForgotPasswordCode
    )
    .post(
      userValidator.validateHanfleForgotPassword,
      usersController.handleForgotPassword
    );

  router.patch(
    "/password/change",
    userValidator.validateChangePassword,
    auth("updateOwn", "password"),
    usersController.changePassword
  );
};
