const mongoose = require('mongoose');

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

