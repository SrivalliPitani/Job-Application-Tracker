const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const FILE = "./jobs.json";

function getJobs() {
  try {
    const data = fs.readFileSync(FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

function saveJobs(jobs) {
  fs.writeFileSync(FILE, JSON.stringify(jobs, null, 2));
}

// GET ALL JOBS
app.get("/jobs", (req, res) => {
  res.json(getJobs());
});

// ADD JOB
app.post("/jobs", (req, res) => {
  const jobs = getJobs();

  const newJob = {
    id: Date.now(),
    company: req.body.company,
    role: req.body.role,
    location: req.body.location,
    priority: req.body.priority,
    notes: req.body.notes,
    status: "Applied",
    date: new Date().toLocaleDateString(),
  };

  jobs.push(newJob);
  saveJobs(jobs);

  res.json(newJob);
});

// UPDATE STATUS
app.patch("/jobs/:id", (req, res) => {
  const jobs = getJobs();

  const job = jobs.find(
    (j) => j.id === Number(req.params.id)
  );

  if (!job) {
    return res.status(404).json({
      message: "Job not found",
    });
  }

  job.status = req.body.status;

  saveJobs(jobs);

  res.json(job);
});

// DELETE JOB
app.delete("/jobs/:id", (req, res) => {
  let jobs = getJobs();

  jobs = jobs.filter(
    (j) => j.id !== Number(req.params.id)
  );

  saveJobs(jobs);

  res.json({
    message: "Deleted",
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});