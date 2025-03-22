const Announcement = require('../models/announcementModel');

// Get all announcements
const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().populate('competitionId');
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get a single announcement by ID
const getAnnouncementById = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id).populate('competitionId');
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }
        res.status(200).json(announcement);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Create a new announcement
const createAnnouncement = async (req, res) => {
    try {
        const { competitionId, title, content } = req.body;
        const newAnnouncement = new Announcement({ competitionId, title, content });
        const savedAnnouncement = await newAnnouncement.save();
        res.status(201).json(savedAnnouncement);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update an existing announcement
const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedAnnouncement = await Announcement.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedAnnouncement) {
            return res.status(404).json({ message: "Announcement not found" });
        }
        res.status(200).json(updatedAnnouncement);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete an announcement
const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
        if (!deletedAnnouncement) {
            return res.status(404).json({ message: "Announcement not found" });
        }
        res.status(200).json({ message: "Announcement deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { getAllAnnouncements, createAnnouncement, getAnnouncementById, updateAnnouncement, deleteAnnouncement };
