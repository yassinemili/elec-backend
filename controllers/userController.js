const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate("teamId", "name");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, role, teamId } = req.body;
        const passwordHash = await bcrypt.hash(password, 10); // Hash password
        const user = new User({ name, email, passwordHash, role, teamId });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: "Error creating user", error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("teamId", "name");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getAllUsers, createUser, getUserById };
