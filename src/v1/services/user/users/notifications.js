const { User } = require("../../../models/user/user");
const notificationsService = require("../../cloud/notifications");
const serverErrorsService = require("../../system/serverErrors");
const innerServices = require("./inner");
const {
  user: userNotifications,
  admin: adminNotifications,
} = require("../../../config/notifications");

module.exports.notifyUsersWithUnseenNotifications = async () => {
  try {
    // Find users with unseen notifications
    const users = await User.find({
      notifications: { $elemMatch: { seen: false } },
    });

    // Check if there are users with unseen notifications
    if (!users || !users.length) {
      return;
    }

    const notification = userNotifications.hasUnreadNotifications();

    // Pick only users that they haven't received this notification
    const userIds = users
      .filter((user) => !user.hasReceivedNotification(notification))
      .map((user) => user._id);

    // Check if there are users that they haven't received
    // this notification yet.
    if (!userIds || !userIds.length) {
      return;
    }

    await this.sendNotification(userIds, notification);
  } catch (err) {
    return;
  }
};

module.exports.notifyAdminsWithServerErrors = async () => {
  try {
    // Find users with unseen notifications
    const admins = await User.find({ role: "admin" });

    // Check if there are users with unseen notifications
    if (!admins || !admins.length) {
      return;
    }

    // Check if there are server errors occurred
    const serverErrorsCount = await serverErrorsService.getAllErrorsCount();
    if (!serverErrorsCount) {
      return;
    }

    // Construct the notification object
    const notification =
      adminNotifications.serverErrorsOccurred(serverErrorsCount);

    // Pick only users that they haven't received this notification
    const adminIds = admins
      .filter((user) => !user.hasReceivedNotification(notification))
      .map((user) => user._id);

    // Check if there are users that they haven't received
    // this notification yet.
    if (!adminIds || !adminIds.length) {
      return;
    }

    await this.sendNotification(adminIds, notification);
  } catch (err) {
    return;
  }
};

module.exports.sendNotification = async (userIds, notification, callback) => {
  try {
    // Validate callback function
    callback = typeof callback === "function" ? callback : () => {};

    // Decide query criteria based on array of users
    const queryCriteria = userIds.length
      ? { _id: { $in: userIds } }
      : { role: { $not: { $in: ["admin"] } } };

    // Check if there are users
    const users = await User.find(queryCriteria);
    if (!users || !users.length) {
      return;
    }

    // Get users' tokens and add notification to them
    const tokens = users.map(async (user) => {
      try {
        // Add notification to user
        user.addNotification(notification);

        // Save user to the BB
        await user.save();

        return { lang: user.getLanguage(), value: user.getDeviceToken() };
      } catch (err) {
        return "";
      }
    });

    // Get device tokens for english users
    const enTokens = tokens
      .filter((token) => token.lang === "en")
      .map((token) => token.value);

    // Get device tokens for arabic users
    const arTokens = tokens
      .filter((token) => token.lang === "ar")
      .map((token) => token.value);

    // Send notification to english users
    notificationsService.sendPushNotification(
      notification.title.en,
      notification.body.en,
      enTokens,
      callback,
      notification.photoURL
    );

    // Send notification to arabic users
    notificationsService.sendPushNotification(
      notification.title.ar,
      notification.body.ar,
      arTokens,
      callback,
      notification.photoURL
    );

    return true;
  } catch (err) {
    throw err;
  }
};

module.exports.sendNotificationToAdmins = async (notification, callback) => {
  try {
    // Validate callback function
    callback = typeof callback === "function" ? callback : () => {};

    // Check if there are admins
    const admins = await innerServices.findAdmins();
    if (!admins.length) {
      return;
    }

    // Get admins' tokens and add notification to them
    const tokens = admins.map(async (admin) => {
      try {
        // Add the notification to user's notifications array
        admin.addNotification(notification);

        // Save the user to the database
        await admin.save();

        return { lang: admin.favLang, value: admin.deviceToken };
      } catch (err) {
        return "";
      }
    });

    // Get device tokens for english users
    const enTokens = tokens
      .filter((token) => token.lang === "en")
      .map((token) => token.value);

    // Get device tokens for arabic users
    const arTokens = tokens
      .filter((token) => token.lang === "ar")
      .map((token) => token.value);

    // Send notification to english users
    notificationsService.sendPushNotification(
      notification.title.en,
      notification.body.en,
      enTokens,
      callback,
      notification.photoURL
    );

    // Send notification to arabic users
    notificationsService.sendPushNotification(
      notification.title.ar,
      notification.body.ar,
      arTokens,
      callback,
      notification.photoURL
    );

    return true;
  } catch (err) {
    throw err;
  }
};
