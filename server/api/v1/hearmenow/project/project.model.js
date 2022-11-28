const { VOTE_TYPES, SDG, AUTHOR_TYPES } = require("../constants");

const mongoose = require("mongoose");

// Main Project schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  images: { type: [String], required: true },
  description: { type: String },
  impactStatement: { type: String },
  abstract: { type: String },
  sdg: { type: [Number], enum: SDG, required: true },
  country: { type: String, required: true },
  authorType: { type: String, enum: AUTHOR_TYPES, required: true },
  datePublished: { type: Date },
  openDate: { type: Date },
  closeDate: { type: Date },
  isSponsored: { type: Boolean, default: false },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  votes: {
    for: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User"
    },
    against: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    abstain: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  }
});

module.exports = mongoose.model("Project", projectSchema);
