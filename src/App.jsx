import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL; // example: "https://your-backend.onrender.com/students"

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: "", age: "", course: "" });
  const [editId, setEditId] = useState(null);

  // fetch students
  const fetchStudents = async () => {
    try {
      const res = await axios.get(API);
      console.log("API Response:", res.data.students);
      // backend returns { students: [...] }
      setStudents(res.data.students);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // add or update student
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, formData);
        setEditId(null);
      } else {
        await axios.post(API, formData);
      }
      setFormData({ name: "", age: "", course: "" });
      fetchStudents();
    } catch (err) {
      console.error("Error saving student:", err);
    }
  };

  // edit student
  const handleEdit = (student) => {
    setFormData({ name: student.name, age: student.age, course: student.course });
    setEditId(student._id);
  };

  // delete student
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light vw-100">
      <div
        className="container text-center rounded shadow-lg p-4 bg-white"
        style={{ maxWidth: "800px" }}
      >
        <h2 className="text-center mb-4">Student CRUD (React + Express + MongoDB)</h2>

        {/* Form */}
        <div className="card p-4 shadow-sm mb-4">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-4">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                name="age"
                className="form-control"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                name="course"
                className="form-control"
                placeholder="Course"
                value={formData.course}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-2 d-grid">
              <button
                type="submit"
                className={`btn ${editId ? "btn-warning" : "btn-primary"}`}
              >
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle text-center shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Course</th>
                <th style={{ width: "180px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(students) && students.length > 0 ? (
                students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.age}</td>
                    <td>{student.course}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
