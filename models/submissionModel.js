const mongoose = require('mongoose');

/* {
    "_id": ObjectId,
    "challengeId": ObjectId,
    "teamId": ObjectId,
    "submittedAt": ISODate(),
    "status": "pending", // ["pending", "reviewed"]
    "submissionFile": "https://example.com/file.pdf",
    "scores": [
      { "judgeId": ObjectId, "score": 80, "comments": "Well done!" }
    ]
  } */

const submissionSchema = new mongoose.Schema(
    {
        challengeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Challenge",
            required: true,
        },
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true,
        },
        submittedAt: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "reviewed"],
            default: "pending",
        },
        submissionFile: {
            type: String, // Stores the Google Drive URL for the submission file
            required: true,
        },
        scores: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Score",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
