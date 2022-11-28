const { VOTE_TYPES, STATUS, AUTHOR_TYPES } = require("../constants");

const mongoose = require("mongoose");

// Nested schema for User which represents metadata used for resetting a user's password
const metadataSchema = new mongoose.Schema({
  newUserToken: { type: String, required: false },
  emailToken: { type: String, required: false },
  csrfToken: { type: String, required: false },
  expirationToken: { type: Number, required: false },
  newEmail: { type: String, required: false },
  newEmailToken: {type: String, required: false },
  newEmailExpiration: {type: Number, required: false },
});

// Main User schema
const userSchema = new mongoose.Schema({
  group: { type: String, required:false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  country: { type: String, required: true },
  birthDate: { type: Date, required: true },
  zipCode: { type: String, required: true },
  profilePicture: { type: String },
  status: { type: String, enum: STATUS, required: true },
  authorType: { type: String, enum: AUTHOR_TYPES, required: true },
  favoriteProjects: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Project",
  },
  votes: {
    for: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Project",
    },
    against: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Project",
    },
    abstain: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Project",
    },
  },
  projects: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Project",
  },
  metadata: { type: metadataSchema, required: false },
});

module.exports = mongoose.model("User", userSchema);
