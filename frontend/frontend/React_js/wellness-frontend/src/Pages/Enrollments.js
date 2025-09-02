import React, { useEffect, useState } from "react";
import {
  getEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  getAllPatients,
  getWellnessServices,
} from "../services/Api";

const pageWrapper = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)", // green gradient
  padding: "2rem",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const containerStyle = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "2rem",
  background: "rgba(255, 255, 255, 0.9)",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
};

const headingStyle = {
  fontSize: "2.2rem",
  fontWeight: "700",
  marginBottom: "1.5rem",
  color: "#2e7d32", // dark green
  textAlign: "center",
};

const formStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "1.5rem",
  marginBottom: "2rem",
};

const labelStyle = {
  display: "flex",
  flexDirection: "column",
  fontWeight: "600",
  fontSize: "1rem",
  color: "#1b5e20",
};

const inputStyle = {
  marginTop: "6px",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1.5px solid #81c784",
  fontSize: "1rem",
  fontWeight: "500",
  color: "#1a334f",
  background: "rgba(255,255,255,0.95)",
  outline: "none",
};

const buttonRow = {
  gridColumn: "1 / -1",
  display: "flex",
  gap: "12px",
  justifyContent: "flex-end",
};

const buttonStyle = {
  padding: "12px 24px",
  borderRadius: "12px",
  fontWeight: "600",
  fontSize: "1rem",
  backgroundImage: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 6px 20px rgba(46, 125, 50, 0.4)",
  transition: "all 0.3s ease",
};

const cancelBtnStyle = {
  ...buttonStyle,
  backgroundImage: "linear-gradient(135deg, #757575 0%, #424242 100%)",
};

const tableWrapper = {
  background: "#fff",
  padding: "1.5rem",
  borderRadius: "16px",
  boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.95rem",
};

const thStyle = {
  backgroundColor: "#2e7d32",
  color: "#fff",
  padding: "12px 15px",
  textAlign: "left",
  fontWeight: "600",
};

const tdStyle = {
  padding: "12px 15px",
  borderBottom: "1px solid #ddd",
};

const editBtn = {
  padding: "6px 14px",
  borderRadius: "8px",
  fontWeight: "600",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#43a047",
  color: "#fff",
  marginRight: "8px",
};

const deleteBtn = {
  padding: "6px 14px",
  borderRadius: "8px",
  fontWeight: "600",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#d32f2f",
  color: "#fff",
};

const messageStyle = (color) => ({
  color,
  marginBottom: "1rem",
  fontWeight: "600",
  textAlign: "center",
});

const EnrollmentsCRUD = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    id: null,
    patientId: "",
    serviceId: "",
    startDate: "",
    endDate: "",
    progress: 0,
  });

  const [loading, setLoading] = useState(false);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrRes, patRes, serRes] = await Promise.all([
          getEnrollments(),
          getAllPatients(),
          getWellnessServices(),
        ]);
        setEnrollments(enrRes.data);
        setPatients(patRes.data);
        setServices(serRes.data);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoadingEnrollments(false);
      }
    };
    fetchData();
  }, []);

  const clearForm = () => {
    setForm({
      id: null,
      patientId: "",
      serviceId: "",
      startDate: "",
      endDate: "",
      progress: 0,
    });
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "progress" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        patientId: Number(form.patientId),
        serviceId: Number(form.serviceId),
        startDate: form.startDate,
        endDate: form.endDate,
        progress: form.progress,
      };

      if (form.id) {
        await updateEnrollment(form.id, payload);
        setSuccess("Enrollment updated successfully!");
      } else {
        await createEnrollment(payload);
        setSuccess("Enrollment created successfully!");
      }

      clearForm();

      const res = await getEnrollments();
      setEnrollments(res.data);
    } catch (err) {
      setError("Failed to save enrollment.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (enroll) => {
    setForm({
      id: enroll.id,
      patientId: enroll.patientId || "",
      serviceId: enroll.serviceId || "",
      startDate: enroll.startDate || "",
      endDate: enroll.endDate || "",
      progress: enroll.progress || 0,
    });
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this enrollment?")) return;
    setLoading(true);
    try {
      await deleteEnrollment(id);
      setSuccess("Enrollment deleted.");
      if (form.id === id) clearForm();
      const res = await getEnrollments();
      setEnrollments(res.data);
    } catch (err) {
      setError("Failed to delete enrollment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={containerStyle}>
        <h2 style={headingStyle}>
          {form.id ? "Edit Enrollment" : "New Enrollment"}
        </h2>
        {(error || success) && (
          <div
            style={messageStyle(error ? "#d32f2f" : "#2e7d32")}
          >
            {error || success}
          </div>
        )}

        <form style={formStyle} onSubmit={handleSubmit}>
          <label style={labelStyle}>
            Patient:
            <select
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.email})
                </option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            Wellness Service:
            <select
              name="serviceId"
              value={form.serviceId}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            Start Date:
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            End Date:
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Progress (%):
            <input
              type="number"
              name="progress"
              min="0"
              max="100"
              value={form.progress}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>

          <div style={buttonRow}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                ...(loading
                  ? { cursor: "not-allowed", opacity: 0.6 }
                  : {}),
              }}
            >
              {loading
                ? form.id
                  ? "Updating..."
                  : "Creating..."
                : form.id
                ? "Update Enrollment"
                : "Create Enrollment"}
            </button>
            {form.id && (
              <button
                type="button"
                onClick={clearForm}
                style={cancelBtnStyle}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <h3 style={{ marginBottom: "1rem", color: "#1b5e20" }}>
          Enrollments List
        </h3>
        {loadingEnrollments ? (
          <p>Loading enrollments...</p>
        ) : enrollments.length === 0 ? (
          <p>No enrollments found.</p>
        ) : (
          <div style={tableWrapper}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Patient</th>
                  <th style={thStyle}>Service</th>
                  <th style={thStyle}>Start Date</th>
                  <th style={thStyle}>End Date</th>
                  <th style={thStyle}>Progress</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enroll) => (
                  <tr key={enroll.id}>
                    <td style={tdStyle}>{enroll.id}</td>
                    <td style={tdStyle}>
                      {enroll.patient?.name || "Unknown"}
                    </td>
                    <td style={tdStyle}>
                      {enroll.service?.name || "Unknown"}
                    </td>
                    <td style={tdStyle}>{enroll.startDate}</td>
                    <td style={tdStyle}>{enroll.endDate}</td>
                    <td style={tdStyle}>{enroll.progress} %</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleEdit(enroll)}
                        disabled={loading}
                        style={editBtn}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(enroll.id)}
                        disabled={loading}
                        style={deleteBtn}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentsCRUD;
