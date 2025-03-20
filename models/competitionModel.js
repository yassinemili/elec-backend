const mongoose = require('mongoose');

/* {
    "_id": ObjectId,
    "name": "Winter Coding Challenge",
    "description": "A hackathon for winter coding.",
    "startDate": ISODate(),
    "endDate": ISODate(),
    "teams": [ObjectId], // References teams participating
    "challenges": [ObjectId], // References all challenges
    "createdAt": ISODate(),
    "updatedAt": ISODate()
  }
 */

const competitionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        teams: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Team"
            }
        ],
        challenges: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Challenge"
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Competition", competitionSchema);


