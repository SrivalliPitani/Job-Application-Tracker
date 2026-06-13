import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");

  const fetchJobs = async () => {
    const res = await fetch("http://localhost:5000/jobs");
    const data = await res.json();
    setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const addJob = async () => {
  if (!company || !role) {
    alert("Please enter Company and Role");
    return;
  }

  await fetch("http://localhost:5000/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      company,
      role,
      location,
      priority,
      notes,
    }),
  });

  setCompany("");
  setRole("");
  setLocation("");
  setPriority("Medium");
  setNotes("");

  fetchJobs();
};

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/jobs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    fetchJobs();
  };

  const deleteJob = async (id) => {
    await fetch(`http://localhost:5000/jobs/${id}`, {
      method: "DELETE",
    });

    fetchJobs();
  };

  const statuses = ["Applied", "Interview", "Rejected"];

  const filteredJobs = jobs.filter(
    (job) =>
      job.company?.toLowerCase().includes(search.toLowerCase()) ||
      job.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>🚀 Job Application Tracker</h1>

      <div className="stats">
        <div className="stat-card">
          <h2>{jobs.length}</h2>
          <p>Total Applications</p>
        </div>

        <div className="stat-card">
          <h2>
            {jobs.filter((j) => j.status === "Interview").length}
          </h2>
          <p>Interviews</p>
        </div>

        <div className="stat-card">
          <h2>
            {jobs.filter((j) => j.status === "Rejected").length}
          </h2>
          <p>Rejected</p>
        </div>
      </div>

      <input
        className="search"
        placeholder="🔍 Search company or role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="form">
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button onClick={addJob}>Add Job</button>
      </div>

      <div className="board">
        {statuses.map((status) => (
          <div key={status} className="column">
            <h2>{status}</h2>

            {filteredJobs
              .filter((job) => job.status === status)
              .map((job) => (
                <div className="card" key={job.id}>
                 <h3>{job.company}</h3>

<p>
  <strong>Role:</strong> {job.role}
</p>

<p>
  📍 {job.location || "Not Specified"}
</p>

<p>
  📅 {job.date || "N/A"}
</p>

<span className={`priority ${job.priority}`}>
  {job.priority}
</span>

<p>{job.notes}</p>
                  <select
                    value={job.status}
                    onChange={(e) =>
                      updateStatus(job.id, e.target.value)
                    }
                  >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Rejected</option>
                  </select>

                  <button
                    className="delete-btn"
                    onClick={() => deleteJob(job.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;