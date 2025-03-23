const Challenge = require("../models/challengeModel");
const cloudinary = require("../config/cloudinary");

const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find()
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createChallenge = async (req, res) => {
  try {
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.points ||
      !req.body.category
    ) {
      return res.status(400).json({ message: "some information are required" });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "attechments",
      resource_type: "auto",
      use_filename: true,
      unique_filename: false,
      flags: "attachment",
    });

    const downloadUrl = result.secure_url.replace(
      "/upload/",
      "/upload/fl_attachment/"
    );

    const { title, description, points, hints, category } = req.body;
    const challenge = new Challenge({
      title,
      description,
      attechment: downloadUrl,
      points,
      hints,
      category,
    });
    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating challenge", error: error.message });
  }
};

const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllChallenges, createChallenge, getChallengeById };
