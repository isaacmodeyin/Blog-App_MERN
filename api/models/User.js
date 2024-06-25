const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, minlength: 4, unique: true },
  password: { type: String, required: true },
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;


// const mongoose = require("mongoose");
// const { Schema, model } = mongoose;

// const UserSchema = new Schema({
//   username: { type: String, required: true, minlength: 4, unique: true }, // username must be a least 4 characters long
//   password: { type: String, required: true, minlength: 8 }, // Password must be at least 8 characters long
// });

// const UserModel = model("User", UserSchema);

// module.exports = UserModel;
