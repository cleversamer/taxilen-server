const httpStatus = require("http-status");
const _ = require("lodash");
const { User, clientSchema } = require("../../../models/user/user");
const {
  usersService,
  excelService,
  notificationsService,
} = require("../../../services");

module.exports.changeUserRole = async (req, res, next) => {
  try {
    const { emailOrPhone, role } = req.body;

    // Asking service to update user's role
    const updatedUser = await usersService.changeUserRole(emailOrPhone, role);

    // Create the response object
    const response = _.pick(updatedUser, clientSchema);

    // Send response back to the client
    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.verifyUser = async (req, res, next) => {
  try {
    const { emailOrPhone } = req.body;

    // Asking service to verify user's email and phone
    const updatedUser = await usersService.verifyUser(emailOrPhone);

    // Create the response object
    const response = _.pick(updatedUser, clientSchema);

    // Send response back to the client
    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.findUserByEmailOrPhone = async (req, res, next) => {
  try {
    const { role, emailOrPhone } = req.query;

    // Asking service to find a user by its email or phone
    // with a specific role
    const user = await usersService.findUserByEmailOrPhone(
      emailOrPhone,
      role,
      true
    );

    // Create the response object
    const response = _.pick(user, clientSchema);

    // Send response back to the client
    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.exportUsersToExcel = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ _id: -1 });

    // Get the path to the excel file
    const filePath = await excelService.exportUsersToExcelFile(users);

    // Create the response object
    const response = {
      type: "file/xlsx",
      path: filePath,
    };

    // Send response back to the client
    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.sendNotification = async (req, res, next) => {
  try {
    const { userIds, titleEN, titleAR, bodyEN, bodyAR } = req.body;

    const notification = notificationsService.createNotification(
      titleEN,
      titleAR,
      bodyEN,
      bodyAR
    );

    res.status(httpStatus.OK).json(notification);

    await usersService.sendNotification(userIds, notification);
  } catch (err) {
    next(err);
  }
};

module.exports.getMostUsedUsers = async (req, res, next) => {
  try {
    const admin = req.user;
    const { page, limit } = req.query;

    // Get most used users in the specified page
    const { currentPage, totalPages, users } =
      await usersService.getMostUsedUsers(admin, page, limit);

    // Create the response object
    const response = {
      currentPage,
      totalPages,
      users: users.map((user) => _.pick(user, clientSchema)),
    };

    // Send response back to the client
    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};
