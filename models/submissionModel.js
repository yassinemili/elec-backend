const mongoose = require('mongoose');

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
