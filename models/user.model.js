const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ['driver', 'passenger',] }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;