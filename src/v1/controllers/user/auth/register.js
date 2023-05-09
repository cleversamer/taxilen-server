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

module.exports.registerWithEmailAndPhone = async (req, res, next) => {
  try {
    const { lang, name, email, phoneICC, phoneNSN, password, deviceToken } =
      req.body;

    // Create the user
    const { user, isAlreadyRegistered } = await authService.registerWithEmail(
      email,
      password,
      name,
      phoneICC,
      phoneNSN,
      deviceToken,
      lang
    );

    if (isAlreadyRegistered) {
      // Parse client data
      const { osName } = usersService.parseUserAgent(req);

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

      // Add login activity to user
      await loginActivitiesService.createLoginActivity(req, user._id);
    } else {
      // Send welcoming email
      await emailService.sendWelcomingEmail(
        user.getLanguage(),
        user.getEmail(),
        user.getName()
      );
    }

    if (!user.isEmailVerified()) {
      // Construct verification email
      const host = req.get("host");
      const protocol =
        host.split(":")[0] === "localhost" ? "http://" : "https://";
      const endpoint = "/api/users/email/verify/fast";
      const code = user.getCode("email");
      const token = user.genAuthToken();
      const verificationLink = `${protocol}${host}${endpoint}?code=${code}&token=${token}`;

      // Send register email with email verification code
      // if user is joining for the first time
      await emailService.sendVerificationCodeEmail(
        user.getLanguage(),
        user.getEmail(),
        user.getCode("email"),
        user.getName(),
        verificationLink
      );
    }

    if (!user.isPhoneVerified()) {
      // TODO: send phone activation code to user's phone.
    }

    // Create response object
    const response = {
      user: _.pick(user, clientSchema),
      token: user.genAuthToken(),
    };

    // Send response back to the client
    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.registerWithGoogle = async (req, res, next) => {
  try {
    const { lang, googleToken, phoneICC, phoneNSN, deviceToken } = req.body;

    // Create the user
    const { user, isAlreadyRegistered } = await authService.registerWithGoogle(
      googleToken,
      phoneICC,
      phoneNSN,
      deviceToken,
      lang
    );

    // Check if user is alredy registered
    // If yes, then send login activity email to user
    if (isAlreadyRegistered) {
      // Parse client data
      const { osName } = usersService.parseUserAgent(req);

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

      // Add login activity to user
      await loginActivitiesService.createLoginActivity(req, user._id);
    } else {
      // Send welcoming email
      await emailService.sendWelcomingEmail(
        user.getLanguage(),
        user.getEmail(),
        user.getName()
      );
    }

    // TODO: send phone activation code to user's phone.

    // Create the response object
    const response = {
      user: _.pick(user, clientSchema),
      token: user.genAuthToken(),
    };

    // Send response back to the client
    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};
