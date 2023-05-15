const admin = require("firebase-admin");
const FCM = require("fcm-notification");
const serviceAccount = require("../../../config/system/service-account.json");
const { Notification } = require("../../../config/notifications");

const credentials = admin.credential.cert(serviceAccount);
const fcm = new FCM(credentials);

module.exports.sendPushNotification = (
  title,
  body,
  tokens,
  callback,
  photoURL
) => {
  try {
    // Filter device token
    //
    // HINT: if you pass an empty token to firebase then
    //       the notification will not be sent due to an error.
    tokens = filterTokens(tokens);

    // Construct the payload of the notification
    const payload = {
      data: {},
      notification: {
        title,
        body,
        icon: photoURL,
      },
    };

    // Send notification to users
    fcm.sendToMultipleToken(payload, tokens, callback);
  } catch (err) {
    throw err;
  }
};

module.exports.createNotification = (titleEN, titleAR, bodyEN, bodyAR) => {
  try {
    return new Notification(titleEN, titleAR, bodyEN, bodyAR);
  } catch (err) {
    throw err;
  }
};

const filterTokens = (tokens = []) =>
  tokens.filter((token) => token && token !== "token");
