const mongoose = require('mongoose');

/* {
    "_id": ObjectId,
    "submissionId": ObjectId,
    "judgeId": ObjectId,ß
    "score": 85,
    "comments": "Great job!",
    "createdAt": ISODate()
  } */

const scoreSchema = new mongoose.Schema(
    {
        submissionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Submission",
            required: true,
        },
        judgeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        comments: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Score', scoreSchema);
