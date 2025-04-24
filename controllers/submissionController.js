const Submission = require("../models/submissionModel");
const Score = require("../models/scoreModel");
const Team = require("../models/teamModel");
const cloudinary = require("../config/cloudinary");

const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("challengeId")
      .populate("teamId", "name")
      .populate("userId", "name")
      .populate("scores");
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSubmissionByTeamId = async (req, res) => {
  try {
    const { teamId } = req.params;

    const submissions = await Submission.find({ teamId })
      .populate("challengeId", "wave")
      .populate("teamId", "name")
      .populate("userId", "name")
      .populate("scores");

    if (!submissions || submissions.length === 0) {
      return res
        .status(404)
        .json({ message: "No submissions found for this team" });
    }

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createSubmission = async (req, res) => {
  try {
    const { challengeId, teamId, userId, submissionText } = req.body;

    // Prevent duplicate submissions for the same challenge by the same team
    const existingSubmission = await Submission.findOne({
      teamId,
      challengeId,
    });

    if (existingSubmission) {
      return res.status(400).json({ message: "Submission already exists" });
    }

    let downloadUrl = null;

    // Only upload file if it exists
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "submissions",
        resource_type: "auto",
        use_filename: true,
        unique_filename: false,
        flags: "attachment",
      });

      downloadUrl = result.secure_url.replace(
        "/upload/",
        "/upload/fl_attachment/"
      );
    }

    // Create submission entry
    const submission = new Submission({
      challengeId,
      teamId,
      userId,
      submissionFile: downloadUrl, // Will be null if no file
      submissionText: submissionText || "",
      isSolved: false,
    });

    const existingScore = await Score.findOne({ submissionId: submission._id });
    if (!existingScore) {
      const newScore = new Score({
        submissionId: submission._id,
        score: 0,
        feedback: "",
      });
      await newScore.save();
    }

    submission.scores = [newScore._id];
    await submission.save();

    res.status(201).json({
      message: "Submission created successfully",
      submission,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating submission",
      error: error.message,
    });
  }
};

const updateSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { submissionText } = req.body;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Optional file update
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "submissions",
        resource_type: "auto",
        use_filename: true,
        unique_filename: false,
        flags: "attachment",
      });

      submission.submissionFile = result.secure_url.replace(
        "/upload/",
        "/upload/fl_attachment/"
      );
    }

    if (typeof submissionText === "string") {
      submission.submissionText = submissionText;
    }

    await submission.save();

    res.status(200).json({
      message: "Submission updated successfully",
      submission,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating submission",
      error: error.message,
    });
  }
};


const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("challengeId", "title")
      .populate("teamId", "name")
      .populate("scores");
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get the score of all submisiions by team
const getSubmissionScoresByTeam = async (req, res) => {
  try {
    const teamId = req.params.teamId;

    const submissions = await Submission.find({ teamId }).populate("scores");

    const allScores = submissions.flatMap((submission) =>
      submission.scores
        ? submission.scores.map((score) => Number(score.score) || 0)
        : []
    );

    const totalScore = allScores.reduce((acc, curr) => acc + curr, 0);

    await Team.findByIdAndUpdate(teamId, { scores: totalScore }, { new: true });

    res.json({ totalScore });
  } catch (error) {
    console.error("Error fetching submission scores:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get the scores of all challenges clasified by categorys that we find in chellenge model for team submission
const getSubmissionScoresByCategory = async (req, res) => {
  try {
    const teamId = req.params.teamId;

    const submissions = await Submission.find({ teamId })
      .populate("challengeId", "category")
      .populate("scores");

    const scoresByCategory = {};

    submissions.forEach((submission) => {
      const category = submission.challengeId.category;
      const scores = submission.scores || [];

      if (!scoresByCategory[category]) {
        scoresByCategory[category] = [];
      }

      scores.forEach((score) => {
        scoresByCategory[category].push(Number(score.score) || 0);
      });
    });

    res.json(scoresByCategory);
  } catch (error) {
    console.error("Error fetching submission scores by category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getSubmissionByChallengeIdAndTeamId = async (req, res) => {
  try {
    const { teamId, challengeId } = req.params;

    if (!teamId || !challengeId) {
      return res.status(400).json({ message: "teamId and challengeId are required" });
    }

    const result = await Submission.findOne({ teamId, challengeId }).populate("scores");

    if (!result) {
      return res.status(404).json({ message: "Submission not found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching submission:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const deleteSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({ message: "Invalid submissionId format" });
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Remove associated scores and calculate score impact
    const scores = await Score.find({ _id: { $in: submission.scores } });

    let totalScoreRemoved = 0;
    for (const s of scores) {
      totalScoreRemoved += s.score;
      await s.deleteOne();
    }

    // Update team totalScore
    const team = await Team.findById(submission.teamId);
    if (team) {
      team.totalScore -= totalScoreRemoved;
      await team.save();
    }

    // Update user statistics
    const challenge = await Challenge.findById(submission.challengeId);
    const category = challenge.category;

    const user = await User.findById(submission.userId);
    if (user) {
      user.statistics.challengeSolved[category] =
        (user.statistics.challengeSolved[category] || 0) - totalScoreRemoved;

      const { AI, CS, GD, PS } = user.statistics.challengeSolved;
      user.statistics.score = AI + CS + GD + PS;
      await user.save();
    }

    // Delete the submission
    await submission.deleteOne();

    // Notify clients
    const io = getIO();
    if (team) io.emit("teams:update", team);

    res.status(200).json({ message: "Submission and associated scores deleted" });

  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(500).json({ message: "Error deleting submission", error: error.message });
  }
};



module.exports = {
  getAllSubmissions,
  createSubmission,
  getSubmissionById,
  getSubmissionScoresByTeam,
  getSubmissionScoresByCategory,
  getSubmissionByTeamId,
  updateSubmission,
  getSubmissionByChallengeIdAndTeamId,
  deleteSubmission
};
