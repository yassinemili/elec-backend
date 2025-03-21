const User = reauire("../models/userModel.js");
const Team = reauire("../models/teamModel.js");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findOne({ name: name });

        if (!user) return res.status(404).json({ message: "User not found" });

        const team = await Team.findById(user.teamId);
        if (!team) return res.status(404).json({ message: "Team not found" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        res.json({
            message: "Logged in successfully",
            user: {
                userId: user._id,
                role: user.role,
                userName: user.name
            },
            team: {
                teamId: team._id,
                teamName: team.name,
                
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


// Register user
const register = async (req, res) => {
    const { name, password } = req.body;

    try {
        const existingUser = await User.findOne({ name });

        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({ name, passwordHash: hashedPassword });

        await user.save();

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    const { name, newPassword } = req.body;

    try {
        const user = await User.findOne({ name });

        if (!user) return res.status(404).json({ message: "User not found" });

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        user.passwordHash = hashedPassword;

        await user.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = {
    login,
    register,
    resetPassword,
};
