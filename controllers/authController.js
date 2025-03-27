const User = require("../models/userModel.js");
const Team = require("../models/teamModel.js");
const bcrypt = require('bcryptjs');
const { generateAccessToken } = require("../utils/tokenUtils");

const login = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let teamData = null;
    if (user.role === "participant") {
      const team = await Team.findById(user.team);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      teamData = {
        teamId: team._id,
        teamName: team.name,
      };
    }
    let roleData = null;
    if (user.role === "admin") {
      roleData = {
        role: "1112",
      };
    } else if (user.role === "participant") {
      roleData = {
        role: "1",
      };
    }

    if (!user.passwordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = await generateAccessToken({
      userId: user._id,
      role: user.role,
    });

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.json({
      message: "Logged in successfully",
      user: {
        userId: user._id,
        userName: user.name,
      },
      team: teamData,
      role: roleData,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


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
  resetPassword,
};
