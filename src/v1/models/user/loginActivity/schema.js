const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

module.exports.client = [
  "_id",
  "author",
  "os",
  "ip",
  "device",
  "engine",
  "cpu",
  "browser",
  "userAgent",
  "location",
  "date",
];

module.exports.mongodb = new Schema(
  {
    // Client ID => User ID
    author: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    // Client's operation system
    os: {
      type: String,
      trim: true,
      default: "",
    },
    // Client's device IP
    ip: {
      type: String,
      required: true,
      trim: true,
    },
    // Client's device
    device: {
      model: {
        type: String,
        trim: true,
        default: "",
      },
      type: {
        type: String,
        trim: true,
        default: "",
      },
      vendor: {
        type: String,
        trim: true,
        default: "",
      },
    },
    // Client's engine
    engine: {
      name: {
        type: String,
        trim: true,
        default: "",
      },
      version: {
        type: String,
        trim: true,
        default: "",
      },
    },
    // Client's cpu
    cpu: {
      architecture: {
        type: String,
        trim: true,
        default: "",
      },
    },
    // Client's browser
    browser: {
      name: {
        type: String,
        trim: true,
        default: "",
      },
      version: {
        type: String,
        trim: true,
        default: "",
      },
    },
    // Client's user agent
    userAgent: {
      type: String,
      trim: true,
      default: "",
    },
    // Client's location data
    location: {
      country: {
        type: String,
        trim: true,
        default: "",
      },
      city: {
        type: String,
        trim: true,
        default: "",
      },
      coordinates: {
        latitude: {
          type: String,
          trim: true,
          default: "",
        },
        longitude: {
          type: String,
          trim: true,
          default: "",
        },
      },
    },
    // Activity date
    date: {
      type: Date,
      required: true,
    },
  },
  {
    // To not avoid empty object when creating the document
    minimize: false,
  }
);
