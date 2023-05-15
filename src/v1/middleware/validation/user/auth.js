const commonMiddleware = require("../common");

module.exports.validateRegisterWithEmail = [
  commonMiddleware.conditionalCheck("lang", commonMiddleware.checkLanguage),
  commonMiddleware.conditionalCheck(
    "referralCode",
    commonMiddleware.checkLanguage
  ),
  commonMiddleware.checkName,
  commonMiddleware.checkForRealName("name"),
  commonMiddleware.checkEmail,
  commonMiddleware.checkPhoneICC,
  commonMiddleware.checkPhoneNSN,
  commonMiddleware.checkPassword,
  commonMiddleware.conditionalCheck(
    "deviceToken",
    commonMiddleware.checkDeviceToken
  ),
  commonMiddleware.next,
  commonMiddleware.limitRegister,
];

module.exports.validateRegisterWithGoogle = [
  commonMiddleware.conditionalCheck("lang", commonMiddleware.checkLanguage),
  commonMiddleware.conditionalCheck(
    "referralCode",
    commonMiddleware.checkLanguage
  ),
  commonMiddleware.checkPhoneICC,
  commonMiddleware.checkPhoneNSN,
  commonMiddleware.conditionalCheck(
    "deviceToken",
    commonMiddleware.checkDeviceToken
  ),
  commonMiddleware.next,
  commonMiddleware.limitRegister,
];

module.exports.validateLoginWithEmailOrPhone = [
  commonMiddleware.conditionalCheck("lang", commonMiddleware.checkLanguage),
  commonMiddleware.checkEmailOrPhone,
  commonMiddleware.checkPassword,
  commonMiddleware.conditionalCheck(
    "deviceToken",
    commonMiddleware.checkDeviceToken
  ),
  commonMiddleware.next,
  commonMiddleware.limitLogin,
];

module.exports.validateLoginWithEmail = [
  commonMiddleware.conditionalCheck("lang", commonMiddleware.checkLanguage),
  commonMiddleware.checkEmail,
  commonMiddleware.checkPassword,
  commonMiddleware.conditionalCheck(
    "deviceToken",
    commonMiddleware.checkDeviceToken
  ),
  commonMiddleware.next,
  commonMiddleware.limitLogin,
];

module.exports.validateLoginWithPhone = [
  commonMiddleware.conditionalCheck("lang", commonMiddleware.checkLanguage),
  commonMiddleware.checkPhoneICC,
  commonMiddleware.checkPhoneNSN,
  commonMiddleware.checkPassword,
  commonMiddleware.conditionalCheck(
    "deviceToken",
    commonMiddleware.checkDeviceToken
  ),
  commonMiddleware.limitLogin,
  commonMiddleware.next,
];

module.exports.validateLoginWithGoogle = [
  commonMiddleware.conditionalCheck("lang", commonMiddleware.checkLanguage),
  commonMiddleware.conditionalCheck(
    "deviceToken",
    commonMiddleware.checkDeviceToken
  ),
  commonMiddleware.next,
  commonMiddleware.limitLogin,
];
