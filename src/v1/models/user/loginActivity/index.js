const { model } = require("mongoose");
const schema = require("./schema");
const setupIndexes = require("./setupIndexes");

setupIndexes(schema.mongodb);

const LoginActivity = model("LoginActivity", schema.mongodb);

module.exports = {
  LoginActivity,
  clientSchema: schema.client,
};
