const { advertisementsController } = require("../../../controllers");
const { advertisementValidator } = require("../../../middleware/validation");

module.exports = (router) => {
  router.get(
    "/all",
    advertisementValidator.validateGetAllAdvertisements,
    advertisementsController.getAllAdvertisements
  );
};
