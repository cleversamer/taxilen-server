const { clientSchema } = require("../../../models/system/advertisement.model");
const { advertisementsService } = require("../../../services");
const httpStatus = require("http-status");
const _ = require("lodash");

module.exports.getAllAdvertisements = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    // Find advertisements at the given page
    const { currentPage, totalPages, advertisements } =
      await advertisementsService.getAllAdvertisements(page, limit);

    // Create the response object
    const response = {
      currentPage,
      totalPages,
      advertisements: advertisements.map((ad) => _.pick(ad, clientSchema)),
    };

    // Send the response back to client
    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};
