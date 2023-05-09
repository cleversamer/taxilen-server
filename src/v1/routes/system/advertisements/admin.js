const { advertisementsController } = require("../../../controllers");
const { advertisementValidator } = require("../../../middleware/validation");
const auth = require("../../../middleware/auth");

module.exports = (router) => {
  router.post(
    "/add",
    advertisementValidator.validateCreateAdvertisement,
    auth("createAny", "advertisement"),
    advertisementsController.createAdvertisement
  );
};
