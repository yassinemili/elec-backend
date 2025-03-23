const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
    {
        /* competitionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Competition",
            required: true
        }, */
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        attachmentFile: {
            type: String,
            default: null,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
