const { Schema } = require("mongoose");
const { user: config } = require("../../../config/models");
const countriesData = require("../../../data/countries");

module.exports.client = [
  "_id",
  "avatarURL",
  "name",
  "email",
  "phone",
  "role",
  "verified",
  "links",
  "display",
  "notifications",
  "balance",
  "referral",
  "lastLogin",
];

module.exports.mongodb = new Schema(
  {
    // User's first authentication type
    authType: {
      type: String,
      required: true,
      trim: true,
      enum: config.authTypes,
      default: config.authTypes[0],
    },
    // User's avatar URL
    avatarURL: {
      type: String,
      default: "",
    },
    // User's full name
    name: {
      type: String,
      trim: true,
      required: true,
      // !!DO NOT provide `minlength` and `maxlength` to this field!
      //
      // Because when a user registers with a Google account or
      // another account, their name will be taken from that account
      // and it may not apply to the provided limitations, and this
      // will end up with a failed registration proccess.
    },
    // The email of the user
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: config.email.minLength,
      maxlength: config.email.maxLength,
    },
    // The phone of the user
    phone: {
      // The full phone number (icc + nsn)
      full: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: countriesData.minPhone,
        maxlength: countriesData.maxPhone,
      },
      // The icc of user's phone
      icc: {
        type: String,
        required: true,
        trim: true,
        enum: countriesData.countries.map((c) => c.icc),
        minlength: countriesData.minICC,
        maxlength: countriesData.maxICC,
      },
      // The nsn of user's phone
      nsn: {
        type: String,
        required: true,
        trim: true,
        minlength: countriesData.minNSN,
        maxlength: countriesData.maxNSN,
      },
    },
    // The hashed password of the user
    password: {
      type: String,
      trim: true,
      default: "",
    },
    // The role of the user
    role: {
      type: String,
      enum: config.roles,
      default: config.roles[0],
    },
    // User's links (Like social media, website, ...etc)
    links: {
      instagram: {
        type: String,
        trim: true,
        maxlength: config.link.maxLength,
        default: "",
      },
      twitter: {
        type: String,
        trim: true,
        maxlength: config.link.maxLength,
        default: "",
      },
      linkedin: {
        type: String,
        trim: true,
        maxlength: config.link.maxLength,
        default: "",
      },
      facebook: {
        type: String,
        trim: true,
        maxlength: config.link.maxLength,
        default: "",
      },
      youtube: {
        type: String,
        trim: true,
        maxlength: config.link.maxLength,
        default: "",
      },
      website: {
        type: String,
        trim: true,
        maxlength: config.link.maxLength,
        default: "",
      },
      other: {
        type: String,
        trim: true,
        maxlength: config.link.maxLength,
        default: "",
      },
    },
    // User's display settings
    display: {
      // User's display language
      language: {
        type: String,
        required: true,
        trim: true,
        enum: config.languages,
        default: config.languages[0],
      },
      // User's display mode
      mode: {
        type: String,
        required: true,
        trim: true,
        enum: config.displayModes,
        default: config.displayModes[0],
      },
    },
    // The email and phone verification status of the user
    verified: {
      email: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: Boolean,
        default: false,
      },
    },
    // The notifications of the user
    notifications: {
      active: {
        type: Boolean,
        default: true,
      },
      list: {
        type: Array,
        default: [],
        minLength: 0,
        maxLength: config.maxNotificationsCount,
      },
    },
    // User's balance
    balance: {
      type: Number,
      default: 0,
    },
    // User's referral code
    referral: {
      number: {
        type: Number,
        default: 0,
      },
      code: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: config.referralCode.exactLength,
        maxlength: config.referralCode.exactLength,
      },
    },
    // The device token of the user (Used for sending notifications to it)
    deviceToken: {
      type: String,
      minlength: config.deviceToken.minLength,
      maxlength: config.deviceToken.maxLength,
      default: "",
    },
    // The last login date of the user
    lastLogin: {
      type: Date,
      default: new Date(),
    },
    // Shows if account is deleted or not
    deleted: {
      type: Boolean,
      default: false,
    },
    // The number of requests the user has made
    noOfRequests: {
      type: Number,
      default: 0,
    },
    // The email, phone, and password verification codes
    verification: {
      email: {
        code: {
          type: String,
          default: "",
        },
        expiryDate: {
          type: Date,
          default: "",
        },
      },
      phone: {
        code: {
          type: String,
          default: "",
        },
        expiryDate: {
          type: Date,
          default: "",
        },
      },
      password: {
        code: {
          type: String,
          default: "",
        },
        expiryDate: {
          type: Date,
          default: "",
        },
      },
      deletion: {
        code: {
          type: String,
          default: "",
        },
        expiryDate: {
          type: Date,
          default: "",
        },
      },
    },
  },
  {
    // To not avoid empty object when creating the document
    minimize: false,
    // To automatically write creation/update timestamps
    // Note: the update timestamp will be updated automatically
    timestamps: true,
  }
);
