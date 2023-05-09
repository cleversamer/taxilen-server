const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { server } = require("../../../config/system");
const { user: config } = require("../../../config/models");

const verification = {
  email: {
    expiryInMins: 10,
    codeLength: config.verificationCode.exactLength,
  },
  phone: {
    expiryInMins: 10,
    codeLength: config.verificationCode.exactLength,
  },
  password: {
    expiryInMins: 10,
    codeLength: config.verificationCode.exactLength,
  },
  deletion: {
    expiryInMins: 10,
    codeLength: config.verificationCode.exactLength,
  },
};

module.exports = (mongodbSchema) => {
  //////////////////// AUTH TYPE ////////////////////
  mongodbSchema.methods.getAuthType = function () {
    return this.authType;
  };

  //////////////////// AVATAR ////////////////////
  mongodbSchema.methods.hasGoogleAvatar = function () {
    return this.avatarURL.includes("googleusercontent.com");
  };

  mongodbSchema.methods.clearAvatarURL = function () {
    this.avatarURL = "";
  };

  mongodbSchema.methods.updateAvatarURL = function (avatarURL) {
    this.avatarURL = avatarURL || "";
  };

  mongodbSchema.methods.getAvatarURL = function () {
    return this.avatarURL;
  };

  //////////////////////// NAME ////////////////////////
  mongodbSchema.methods.updateName = function (name) {
    this.name = name;
  };

  mongodbSchema.methods.getName = function () {
    return this.name;
  };

  mongodbSchema.methods.compareName = function (name) {
    return this.name === name;
  };

  //////////////////////// EMAIL ////////////////////////
  mongodbSchema.methods.isEmailVerified = function () {
    return this.verified.email;
  };

  mongodbSchema.methods.verifyEmail = function () {
    this.verified.email = true;
  };

  mongodbSchema.methods.unverifyEmail = function () {
    this.verified.email = false;
  };

  mongodbSchema.methods.updateEmail = function (email) {
    this.email = email;
  };

  mongodbSchema.methods.getEmail = function () {
    return this.email;
  };

  //////////////////////// PHONE ////////////////////////
  mongodbSchema.methods.isPhoneVerified = function () {
    return this.verified.phone;
  };

  mongodbSchema.methods.verifyPhone = function () {
    this.verified.phone = true;
  };

  mongodbSchema.methods.unverifyPhone = function () {
    this.verified.phone = false;
  };

  mongodbSchema.methods.updatePhone = function (icc, nsn) {
    this.phone = {
      full: `${icc}${nsn}`,
      icc,
      nsn,
    };
  };

  mongodbSchema.methods.getPhone = function () {
    return this.phone.full;
  };

  mongodbSchema.methods.getPhoneICC = function () {
    return this.phone.icc;
  };

  mongodbSchema.methods.getPhoneNSN = function () {
    return this.phone.nsn;
  };

  //////////////////////// ROLE ////////////////////////
  mongodbSchema.methods.getRole = function () {
    return this.role;
  };

  mongodbSchema.methods.isAdmin = function () {
    return this.role === "admin";
  };

  mongodbSchema.methods.updateRole = function (role) {
    this.role = role;
  };

  //////////////////////// LANGUAGE ////////////////////////
  mongodbSchema.methods.switchLanguage = function () {
    this.display.language = this.display.language === "en" ? "ar" : "en";
  };

  mongodbSchema.methods.updateLanguage = function (lang) {
    // Check if `lang` param exists
    if (!lang) {
      return;
    }

    this.display.language = lang;
  };

  mongodbSchema.methods.getLanguage = function () {
    return this.display.language;
  };

  //////////////////////// NOTIFICATIONS ////////////////////////
  mongodbSchema.methods.addNotification = function (notification) {
    const { maxNotificationsCount } = config;

    // Make sure that the max notifications count is considered.
    this.notifications = this.notifications.slice(0, maxNotificationsCount);

    // If the max count reached then we remove the oldest one.
    if (this.notifications.length === maxNotificationsCount) {
      this.notifications.pop();
    }

    // Add the notification to the beginning of the array
    this.notifications.unshift(notification);
  };

  mongodbSchema.methods.seeNotifications = function () {
    // Return `true` if there are no notifications
    // True means no new notifications
    if (!this.notifications.length) {
      return true;
    }

    const list = [...this.notifications];

    // Declare a variable to track unseen notifications
    let isAllSeen = true;

    // Mark all notification as seen
    this.notifications = this.notifications.map((n) => {
      isAllSeen = isAllSeen && n.seen;

      return {
        ...n,
        seen: true,
      };
    });

    // Return the result
    return { isAllSeen, list };
  };

  mongodbSchema.methods.clearNotifications = function () {
    const isEmpty = !this.notifications.length;
    this.notifications = [];
    return isEmpty;
  };

  mongodbSchema.methods.hasReceivedNotification = function (notification) {
    // Check if user has received this notification
    // and didn't saw it
    const index = this.notifications.findIndex(
      (n) =>
        n.title.en === notification.title.en &&
        n.title.ar === notification.title.ar &&
        n.body.en === notification.body.en &&
        n.body.ar === notification.body.ar &&
        !n.seen
    );

    // This means that the current user has received
    // the given notification before, and it hasn't
    // read it.
    return index >= 0;
  };

  //////////////////////// LINKS ////////////////////////
  mongodbSchema.methods.updateLink = function (key, value) {
    this.links[key] = value;
  };

  mongodbSchema.methods.removeLink = function (key) {
    this.links[key] = "";
  };

  //////////////////////// DEVICE TOKEN ////////////////////////
  mongodbSchema.methods.updateDeviceToken = function (deviceToken) {
    // Check if `deviceToken` param exists
    if (!deviceToken) {
      return;
    }

    // Update user's device token
    this.deviceToken = deviceToken;
  };

  mongodbSchema.methods.getDeviceToken = function () {
    return this.this.deviceToken;
  };

  //////////////////////// TOKEN ////////////////////////
  mongodbSchema.methods.genAuthToken = function () {
    const body = {
      sub: this._id.toHexString(),
      email: this.email,
      phone: this.phone.full,
      password: this.password + server.PASSWORD_SALT,
    };

    return jwt.sign(body, process.env["JWT_PRIVATE_KEY"]);
  };

  //////////////////////// LAST LOGIN ////////////////////////
  mongodbSchema.methods.updateLastLogin = function () {
    this.lastLogin = new Date();
  };

  mongodbSchema.methods.getLastLogin = function () {
    return this.lastLogin;
  };

  //////////////////////// VERIFICATION CODES ////////////////////////
  mongodbSchema.methods.genCode = function (length = 4) {
    const possibleNums = Math.pow(10, length - 1);
    return Math.floor(possibleNums + Math.random() * 9 * possibleNums);
  };

  mongodbSchema.methods.updateCode = function (key) {
    const { codeLength, expiryInMins } = verification[key];

    // Generate code
    const code = this.genCode(codeLength);

    // Generate expiry date
    // const mins = expiryInMins * 60 * 1000;
    // const expiryDate = new Date() + mins;
    const mins = expiryInMins * 60 * 1000;
    const expiryDate = new Date(Date.now() + mins);

    // Update email verification code
    this.verification[key] = { code, expiryDate };
  };

  mongodbSchema.methods.isMatchingCode = function (key, code) {
    return this.verification[key].code == code;
  };

  mongodbSchema.methods.isValidCode = function (key) {
    const { expiryDate } = this.verification[key];

    // Check if the now date is before the expiry date
    return new Date() < expiryDate;
  };

  mongodbSchema.methods.getCode = function (key) {
    return this.verification[key].code;
  };

  mongodbSchema.methods.getCodeRemainingTime = function (key) {
    const { expiryDate } = this.verification[key];

    // Calculate difference in milliseconds between now
    // and expiry date
    const diffInMs = expiryDate - new Date();

    if (diffInMs <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    // Calculate remaining seconds with fractions
    const diffInSec = Math.floor(diffInMs / 1000);

    // Calculate remaining days
    const days = Math.floor(diffInSec / (3600 * 24));

    // Calculate remaining hours
    const hours = Math.floor((diffInSec % (3600 * 24)) / 3600);

    // Calculate remaining minutes
    const minutes = Math.floor((diffInSec % 3600) / 60);

    // Calculate remaining seconds without fractions
    const seconds = Math.floor(diffInSec % 60);

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  //////////////////////// PASSWORD ////////////////////////
  mongodbSchema.methods.comparePassword = async function (candidate) {
    // Check if user doesn't have a password
    // and the candidate password argument
    // is also an empty string
    if (!this.password && !candidate) {
      return true;
    }

    // Otherwise, compare candidate password with the current password
    return await bcrypt.compare(candidate, this.password);
  };

  mongodbSchema.methods.updatePassword = async function (newPassword) {
    const salt = await bcrypt.genSalt(11);
    const hashed = await bcrypt.hash(newPassword, salt);
    this.password = hashed;
  };

  mongodbSchema.methods.hasPassword = function () {
    return !!this.password;
  };

  //////////////////////// ACCOUNT STATUS ////////////////////////
  mongodbSchema.methods.markAsDeleted = function () {
    this.deleted = true;
  };

  mongodbSchema.methods.isDeleted = function () {
    return this.deleted;
  };

  mongodbSchema.methods.restoreAccount = function () {
    // Mark account as not deleted
    this.deleted = false;

    // Clear account deletion code
    this.verification.deletion = { code: "", expiryDate: null };
  };

  //////////////////////// USER'S MADE REQUESTS ////////////////////////
  mongodbSchema.methods.addRequest = function () {
    this.noOfRequests = this.noOfRequests + 1;
  };
};
