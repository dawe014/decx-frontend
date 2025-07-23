const mongoose = require("mongoose");

// Import all models
require("./User");
require("./Influencer");
// Add other models as needed

module.exports = {
  User: mongoose.models.User,
  Influencer: mongoose.models.influencer,
  // Export other models
};
