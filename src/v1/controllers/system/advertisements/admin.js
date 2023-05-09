const { clientSchema } = require("../../../models/system/advertisement.model");
const { advertisementsService } = require("../../../services");
const httpStatus = require("http-status");
const _ = require("lodash");

module.exports.createAdvertisement = async (req, res, next) => {
  try {
    const user = req.user;
    const {} = req.body;

    // Create advertisement
    const advertisement = await advertisementsService.createAdvertisement();

    // Create the response object
    const response = _.pick(advertisement, clientSchema);

    // Send the response back to client
    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};
