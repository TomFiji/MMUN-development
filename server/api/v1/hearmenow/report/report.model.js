
const mongoose = require("mongoose");

// Report schema
const reportSchema = new mongoose.Schema({
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Project",
        required: true,
    },
    message: {type: String, required: true},
    reporter: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    submissionDate: {type: Date, required: true, default: Date.now()},
});

module.exports = mongoose.model("Report", reportSchema);
