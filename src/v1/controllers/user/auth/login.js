const {
  authService,
  emailService,
  usersService,
  loginActivitiesService,
} = require("../../../services");
const { user: userNotifications } = require("../../../config/notifications");
const httpStatus = require("http-status");
const { clientSchema } = require("../../../models/user/user");
const _ = require("lodash");

module.exports.loginWithEmailOrPhone = async (req, res, next) => {
  try {
    const { lang, emailOrPhone, password, deviceToken, socketId } = req.body;

    // Find user with provided credentials
    const { user, isDeleted } = await authService.loginWithEmailOrPhone(
      emailOrPhone,
      password,
      deviceToken,
      lang
    );

    // Create the response object
    const response = {
      user: _.pick(user, clientSchema),
      token: user.genAuthToken(),
    };

    // Connect user's socket to their own room
    usersService.joinSocketToUserRoom(socketId, user._id);

    // Send response back to the client
    res.status(httpStatus.OK).json(response);

    // Parse client data
    const { osName } = usersService.parseUserAgent(req);

    if (isDeleted) {
      // Send welcome back email to user
      await emailService.sendWelcomeBackEmail(
        user.getLanguage(),
        user.getEmail(),
        user.getName()
      );
    } else {
      // Send login activity email to user
      await emailService.sendLoginActivityEmail(
        user.getLanguage(),
        user.getEmail(),
        user.getName(),
        osName
      );

      // Send notification to user
      await usersService.sendNotification(
        [user._id],
        userNotifications.newLoginActivity(user.getLastLogin())
      );
    }

    // Add login activity to user
    await loginActivitiesService.createLoginActivity(req, user);
  } catch (err) {
    next(err);
  }
};

module.exports.loginWithEmail = async (req, res, next) => {
  try {
    const { lang, email, password, deviceToken, socketId } = req.body;

    // Find user with provided credentials
    const { user, isDeleted } = await authService.loginWithEmail(
      email,
      password,
      deviceToken,
      lang
    );

    // Create the response object
    const response = {
      user: _.pick(user, clientSchema),
      token: user.genAuthToken(),
    };

    // Send response back to the client
    res.status(httpStatus.OK).json(response);

    // Connect user's socket to their own room
    usersService.joinSocketToUserRoom(socketId, user._id);

    // Parse client data
    const { osName } = usersService.parseUserAgent(req);

    if (isDeleted) {
      // Send welcome back email to user
      await emailService.sendWelcomeBackEmail(
        user.getLanguage(),
        user.getEmail(),
        user.getName()
      );
    } else {
      // Send login activity email to user
      await emailService.sendLoginActivityEmail(
        user.getLanguage(),
        user.getEmail(),
        user.getName(),
        osName
      );

      // Send notification to user
      await usersService.sendNotification(
        [user._id],
        userNotifications.newLoginActivity(user.getLastLogin())
      );
    }

    // Add login activity to user
    await loginActivitiesService.createLoginActivity(req, user);
  } catch (err) {
    next(err);
  }
};

module.exports.loginWithPhone = async (req, res, next) => {
  try {
    const { lang, phoneICC, phoneNSN, password, deviceToken, socketId } =
      req.body;

    // Construct the full phone
    const fullPhone = `${phoneICC}${phoneNSN}`;

    // Find user with provided credentials
    const { user, isDeleted } = await authService.loginWithPhone(
      fullPhone,
      password,
      deviceToken,
      lang
    );

    // Create the response object
    const response = {
      user: _.pick(user, clientSchema),
      token: user.genAuthToken(),
    };

    // Send response back to the client
    res.status(httpStatus.OK).json(response);

    // Connect user's socket to their own room
    usersService.joinSocketToUserRoom(socketId, user._id);

    // Parse client data
    const { osName } = usersService.parseUserAgent(req);

    if (isDeleted) {
      // Send welcome back email to user
      await emailService.sendWelcomeBackEmail(
        user.getLanguage(),
        user.getEmail(),
        user.getName()
      );
    } else {
      // Send login activity email to user
      await emailService.sendLoginActivityEmail(
        user.getLanguage(),
        user.getEmail(),
        user.getName(),
        osName
      );

      // Send notification to user
      await usersService.sendNotification(
        [user._id],
        userNotifications.newLoginActivity(user.getLastLogin())
      );
    }

    // Add login activity to user
    await loginActivitiesService.createLoginActivity(req, user);
  } catch (err) {
    next(err);
  }
};

module.exports.loginWithGoogle = async (req, res, next) => {
  try {
    const { lang, googleToken, deviceToken, socketId } = req.body;

    // Find user by google email
    const { user, isDeleted } = await authService.loginWithGoogle(
      googleToken,
      deviceToken,
      lang
    );

    // Create the response object
    const response = {
      user: _.pick(user, clientSchema),
      token: user.genAuthToken(),
    };

    // Send response back to the client
    res.status(httpStatus.OK).json(response);

    // Connect user's socket to their own room
    usersService.joinSocketToUserRoom(socketId, user._id);

    if (isDeleted) {
      // Send welcome back email to user
      await emailService.sendWelcomeBackEmail(
        user.getLanguage(),
        user.getEmail(),
        user.getName()
      );
    } else {
      // Send login activity email to user
      await emailService.sendLoginActivityEmail(
        user.getLanguage(),
        user.getEmail(),
        user.getName(),
        osName
      );

      // Send notification to user
      await usersService.sendNotification(
        [user._id],
        userNotifications.newLoginActivity(user.getLastLogin())
      );
    }

    // Add login activity to user
    await loginActivitiesService.createLoginActivity(req, user);
  } catch (err) {
    next(err);
  }
};
