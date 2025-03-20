const mongoose = require('mongoose');

/* {
    "_id": ObjectId,
    "name": "Alpha Squad",
    "members": [
      { "userId": ObjectId, "role": "leader" },
      { "userId": ObjectId, "role": "member" }
    ],
    "competitions": [ObjectId], // Reference competitions team is part of
    "createdAt": ISODate(),
    "updatedAt": ISODate()
  } */

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        members: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                role: {
                    type: String,
                    enum: ["member", "leader"],
                    default: "member"
                }
            }
        ],
        competitions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Competition"
            }
        ]
    },
    { timestamps: true }
);

module.export = mongoose.model('Team', teamSchema)

