const { model } = require("mongoose");
const schema = require("./schema");
const setupMethods = require("./setupMethods");

setupMethods(schema.mongodb);

const User = model("User", schema.mongodb);

module.exports = {
  User,
  clientSchema: schema.client,
};
