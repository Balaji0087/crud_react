import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error(err));

// Schema + Model
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  course: String,
});
const Student = mongoose.model("Student", studentSchema);

// Routes
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.post("/students", async (req, res) => {
  const newStudent = new Student(req.body);
  await newStudent.save();
  res.json(newStudent);
});

app.put("/students/:id", async (req, res) => {
  const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedStudent);
});

app.delete("/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student deleted" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
