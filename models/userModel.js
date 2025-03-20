const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["admin", "judge", "participant"], default: "participant" },
        teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
