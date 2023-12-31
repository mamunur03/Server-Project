const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String},
  role: { type: String, enum: ['driver', 'passenger', 'admin'], required: true },
  isPending: { type: Boolean, default: false },
  token: { type: String },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
