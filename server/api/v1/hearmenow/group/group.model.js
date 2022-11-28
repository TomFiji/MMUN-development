const mongoose = require("mongoose");

// user group schema
const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teachers: [
    {
      name: { type: String },
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    },
  ],
  students: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
});

module.exports = mongoose.model("Group", groupSchema);
