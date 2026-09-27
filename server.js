const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

// ---- Database ----
mongoose.connect("mongodb://127.0.0.1:27017/feedbackDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ---- Schema ----
const feedbackSchema = new mongoose.Schema({
  studentName: String,
  registerNo: String,
  department: String,
  course: String,
  faculty: String,
  rating: Number,
  comments: String
});

const Feedback = mongoose.model("Feedback", feedbackSchema, "feedback");

// ---- Middleware ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ---- Routes ----

// Submit feedback
app.post("/api/feedback", async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.json({ message: "Feedback submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

// Get all feedback (with optional search/filter)
app.get("/api/feedback", async (req, res) => {
  try {
    const { registerNo, course } = req.query;
    const query = {};
    if (registerNo) query.registerNo = registerNo;
    if (course) query.course = course;

    const feedbacks = await Feedback.find(query);
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

// Average rating for a faculty
app.get("/api/feedback/average/:faculty", async (req, res) => {
  try {
    const result = await Feedback.aggregate([
      { $match: { faculty: req.params.faculty } },
      { $group: { _id: "$faculty", avgRating: { $avg: "$rating" } } }
    ]);
    res.json(result[0] || { faculty: req.params.faculty, avgRating: 0 });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate average" });
  }
});

// Delete feedback
app.delete("/api/feedback/:id", async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete feedback" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
