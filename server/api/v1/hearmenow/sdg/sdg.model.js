const { SDG } = require("../constants");

const mongoose = require("mongoose");

// Main SDG schema
const sdgSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: Number, enum: SDG, required: true },
  projectId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Project",
  },
});

module.exports = mongoose.model("SDG", sdgSchema);
