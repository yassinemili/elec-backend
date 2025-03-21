const mongoose = require("mongoose");

/* 
{
    "_id": ObjectId,
    "name": "John Doe",
    "passwordHash": "hashed_password",
    "role": "participant", // ["admin", "judge", "participant"]
    "teamId": ObjectId, // Direct reference for quick lookup
    "createdAt": ISODate(),
    "updatedAt": ISODate()
  } */

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["admin", "participant"],
            default: "participant"
        },
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            default: null
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
