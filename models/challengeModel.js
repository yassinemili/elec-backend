const mongoose = require('mongoose');

/* 
{
    "_id": ObjectId,
    "competitionId": ObjectId,
    "title": "Build a To-Do App",
    "description": "Create a full-stack to-do application.",
    "points": 50,
    "submissions": [
      { "teamId": ObjectId, "submissionId": ObjectId }
    ],
    "createdAt": ISODate(),
    "updatedAt": ISODate()
  } */

const challengeSchema = new mongoose.Schema(
    {
        competitionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Competition",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        points: {
            type: Number,
            required: true
        },
        submissions: [
            {
                teamId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Team",
                    required: true
                },
                submissionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Submission",
                    required: true
                }
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Challenge", challengeSchema);

