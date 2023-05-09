module.exports = (mongodbSchema) => {
  // Create an index on the `author` field
  // to fetch user's login activity fast
  mongodbSchema.index({ author: -1 });
};
