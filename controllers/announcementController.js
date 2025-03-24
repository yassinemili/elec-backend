const Announcement = require('../models/announcementModel');
const { getIO } = require("../config/socket");
const cloudinary = require("../config/cloudinary");

const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find();
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createAnnouncement = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Missing required field(s)" });
        }

        let downloadUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "announcements",
                resource_type: "auto",
                use_filename: true,
                unique_filename: false,
            });

            downloadUrl = result.secure_url.replace("/upload/", "/upload/fl_announcement/");
        }

        const announcement = await Announcement.create({ title, content, attachmentFile: downloadUrl });
        if (!announcement) {
            return res.status(400).json({ message: "Invalid announcement data" });
        }

        const io = getIO();
        if (io) {
            const timestamp = new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });

            io.emit("announcement", { message: "New Announcement", timestamp });
        }

        res.status(201).json(announcement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = {
    getAllAnnouncements,
    createAnnouncement
};

