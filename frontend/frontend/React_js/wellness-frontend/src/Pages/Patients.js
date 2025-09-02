import React, { useState, useEffect } from "react";
import {
  registerPatient,
  loginPatient,
  getPatientById,
  updatePatientProfile,
  getHealthRecords,
  updateHealthRecords
} from "../services/Api";
import 'bootstrap/dist/css/bootstrap.min.css';
import myImage from '../images/doctor.jpg';

const styles = {
  root: {
    minHeight: "100vh",
    background: "#a4caff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  cardSplit: {
    display: "flex",
    width: "900px",
    borderRadius: "28px",
    background: "#fff",
    boxShadow: "0 16px 40px rgba(80,138,255,0.13)",
    overflow: "hidden",
  },
  sideLeft: {
    width: "45%",
    background: "linear-gradient(135deg, #a6ffe5 0%, #c3eafe 90%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2.5rem 1.5rem",
    position: "relative",
    color: "#222e35",
  },
  helloText: {
    fontWeight: "700",
    fontSize: "2rem",
    marginBottom: "0.8rem",
    letterSpacing: "0.01em",
  },
  leftSubtext: {
    fontSize: "1rem",
    fontWeight: "500",
    marginBottom: "2rem",
    textAlign: "center",
    maxWidth: "230px",
  },
  doctorIllustration: {
    width: "140px",
    height: "200px",
    objectFit: "contain",
    marginTop: "1.5rem",
    userSelect: "none",
  },
  sideRight: {
    width: "55%",
    padding: "3rem 3rem",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  },
  logoText: {
    fontWeight: "700",
    color: "#18c4a5",
    fontSize: "1.6rem",
    marginRight: "8px",
  },
  hospitalText: {
    fontWeight: "600",
    fontSize: "1.3rem",
    color: "#666",
  },
  tabContainer: {
    display: "flex",
    marginBottom: "2rem",
  },
  tab: (active) => ({
    flex: 1,
    padding: "12px 0",
    cursor: "pointer",
    fontWeight: active ? "700" : "500",
    color: active ? "#18c4a5" : "#666",
    borderBottom: active ? "3px solid #18c4a5" : "3px solid transparent",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    fontSize: "1.2rem",
    userSelect: "none",
  }),
  input: {
    width: "100%",
    borderRadius: "9px",
    border: "1.5px solid #d0e2fb",
    backgroundColor: "#f6fafc",
    padding: "12px 14px",
    fontSize: "1rem",
    fontWeight: "500",
    marginBottom: "1.2rem",
    outline: "none",
    transition: "border-color 0.3s ease",
    color: "#2c3e50",
  },
  inputFocus: {
    borderColor: "#18c4a5",
    boxShadow: "0 0 8px rgba(24, 196, 165, 0.45)",
  },
  textarea: {
    width: "100%",
    height: "130px",
    resize: "vertical",
    borderRadius: "9px",
    border: "1.5px solid #d0e2fb",
    backgroundColor: "#f6fafc",
    padding: "12px 14px",
    fontSize: "1rem",
    fontWeight: "500",
    marginBottom: "1.6rem",
    outline: "none",
    transition: "border-color 0.3s ease",
    color: "#2c3e50"
  },
  button: {
    width: "100%",
    borderRadius: "10px",
    border: "none",
    padding: "14px 0",
    fontWeight: "700",
    fontSize: "1.2rem",
    background: "linear-gradient(90deg, #18c4a5 0%, #0a8f82 100%)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(24, 196, 165, 0.6)",
    transition: "background 0.3s ease",
  },
  buttonHover: {
    background: "linear-gradient(90deg, #0a8f82 0%, #067665 100%)",
  },
  alertMessage: {
    marginBottom: "1rem",
    fontWeight: "600",
    color: "#e74c3c",
    fontSize: "0.9rem",
    textAlign: "center",
  },
  passwordRow: {
    position: "relative",
  },
  showPasswordBtn: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    fontSize: "1.2rem",
    cursor: "pointer",
    color: "#666",
  },
};

const LoginIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    fill="none"
    stroke="#18c4a5"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M15 12H3M12 15l3-3-3-3" />
  </svg>
);

const Patients = () => {
  const [activeTab, setActiveTab] = useState("register"); // register or login
  const [patientId, setPatientId] = useState(null);
  const [token, setToken] = useState("");
  const [patient, setPatient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    password: ""
  });
  const [healthRecords, setHealthRecords] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [focusedTextarea, setFocusedTextarea] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Fetch patient after login to load profile and records
  const fetchPatient = async () => {
    if (!patientId || !token) return;
    try {
      const response = await getPatientById(patientId, token);
      setPatient(response.data);
      const recordsRes = await getHealthRecords(patientId, token);
      setHealthRecords(recordsRes.data.records);
    } catch (error) {
      setErrorMessage("Failed to fetch patient data.");
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [patientId, token]);

  // Register patient
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      const response = await registerPatient(patient);
      setPatientId(response.data.id);
      setActiveTab("login");
      alert("Registered successfully! Please login.");
      setPatient(prev => ({ ...prev, password: "" })); // Clear password
    } catch {
      setErrorMessage("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Login patient
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      const response = await loginPatient({
        email: patient.email,
        password: patient.password
      });
      setToken(response.data.token);
      // Here, you must also set patientId from response for frontend to fetch profile
      // Assuming response.data.patientId exists (adjust if backend differs)
      if (response.data.patientId) {
        setPatientId(response.data.patientId);
      }
      alert("Login successful!");
    } catch {
      setErrorMessage("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const handleUpdateProfile = async () => {
    setErrorMessage("");
    setLoading(true);
    try {
      const response = await updatePatientProfile(patientId, patient, token);
      setPatient(response.data);
      alert("Profile updated!");
    } catch {
      setErrorMessage("Profile update failed.");
    } finally {
      setLoading(false);
    }
  };

  // Update health records
  const handleUpdateHealthRecords = async () => {
    setErrorMessage("");
    setLoading(true);
    try {
      const response = await updateHealthRecords(patientId, healthRecords, token);
      setHealthRecords(response.data.healthRecords);
      alert("Health records updated!");
    } catch {
      setErrorMessage("Failed to update health records.");
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (name) =>
    focusedInput === name
      ? { ...styles.input, ...styles.inputFocus }
      : styles.input;

  return (
    <div style={styles.root}>
      <div style={styles.cardSplit}>
        <div style={styles.sideLeft}>
          <div style={styles.helloText}>
            HELLO<span style={{ color: "#18c4a5" }}>!</span>
          </div>
          <div style={styles.leftSubtext}>
            Please enter your details to continue
          </div>
          <img src={myImage} alt="Doctor Illustration" style={{ maxWidth: "50%", height: "auto" }} />
        </div>
        <div style={styles.sideRight}>
          <div style={styles.logoRow}>
            <span style={styles.logoText}>SAI HEALTHCARE</span>
            <span style={styles.hospitalText}>Hospital</span>
          </div>

          {/* Tabs */}
          <div style={styles.tabContainer}>
            <div
              style={styles.tab(activeTab === "register")}
              onClick={() => setActiveTab("register")}
            >
              Register
            </div>
            <div
              style={styles.tab(activeTab === "login")}
              onClick={() => setActiveTab("login")}
            >
              Login <LoginIcon />
            </div>
          </div>

          {errorMessage && <div style={styles.alertMessage}>{errorMessage}</div>}

          {activeTab === "register" && (
            <form onSubmit={handleRegister} style={{ width: "100%" }} autoComplete="off">
              <input
                style={getInputStyle("registerName")}
                placeholder="Name"
                value={patient.name}
                onChange={e => setPatient({ ...patient, name: e.target.value })}
                onFocus={() => setFocusedInput("registerName")}
                onBlur={() => setFocusedInput(null)}
                disabled={loading}
                required
              />
              <input
                type="email"
                style={getInputStyle("registerEmail")}
                placeholder="Email"
                value={patient.email}
                onChange={e => setPatient({ ...patient, email: e.target.value })}
                onFocus={() => setFocusedInput("registerEmail")}
                onBlur={() => setFocusedInput(null)}
                disabled={loading}
                required
              />
              <div style={styles.passwordRow}>
                <input
                  style={getInputStyle("registerPassword")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={patient.password}
                  onChange={e => setPatient({ ...patient, password: e.target.value })}
                  onFocus={() => setFocusedInput("registerPassword")}
                  onBlur={() => setFocusedInput(null)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={styles.showPasswordBtn}
                  onClick={() => setShowPassword(prev => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={hoveredButton === "register"
                  ? { ...styles.button, ...styles.buttonHover }
                  : styles.button}
                onMouseEnter={() => setHoveredButton("register")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          )}

          {activeTab === "login" && (
            <form onSubmit={handleLogin} style={{ width: "100%" }} autoComplete="off">
              <input
                type="email"
                style={getInputStyle("loginEmail")}
                placeholder="Email"
                value={patient.email}
                onChange={e => setPatient({ ...patient, email: e.target.value })}
                onFocus={() => setFocusedInput("loginEmail")}
                onBlur={() => setFocusedInput(null)}
                disabled={loading}
                required
              />
              <div style={styles.passwordRow}>
                <input
                  style={getInputStyle("loginPassword")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={patient.password}
                  onChange={e => setPatient({ ...patient, password: e.target.value })}
                  onFocus={() => setFocusedInput("loginPassword")}
                  onBlur={() => setFocusedInput(null)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={styles.showPasswordBtn}
                  onClick={() => setShowPassword(prev => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={hoveredButton === "login"
                  ? { ...styles.button, ...styles.buttonHover }
                  : styles.button}
                onMouseEnter={() => setHoveredButton("login")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* Profile section */}
          {token && patientId && (
            <>
              <div style={{ marginTop: "3rem" }}>
                <h3 style={{ fontWeight: "700", fontSize: "1.5rem", color: "#2c3e50", marginBottom: "1rem", borderBottom: "2px solid #18c4a5", paddingBottom: "0.5rem" }}>
                  Profile
                </h3>
                <input
                  style={getInputStyle("profileName")}
                  placeholder="Name"
                  value={patient.name}
                  onChange={e => setPatient({ ...patient, name: e.target.value })}
                  onFocus={() => setFocusedInput("profileName")}
                  onBlur={() => setFocusedInput(null)}
                  disabled={loading}
                />
                <input
                  style={getInputStyle("profilePhone")}
                  placeholder="Phone"
                  value={patient.phone}
                  onChange={e => setPatient({ ...patient, phone: e.target.value })}
                  onFocus={() => setFocusedInput("profilePhone")}
                  onBlur={() => setFocusedInput(null)}
                  disabled={loading}
                />
                <input
                  style={getInputStyle("profileAddress")}
                  placeholder="Address"
                  value={patient.address}
                  onChange={e => setPatient({ ...patient, address: e.target.value })}
                  onFocus={() => setFocusedInput("profileAddress")}
                  onBlur={() => setFocusedInput(null)}
                  disabled={loading}
                />
                <input
                  style={getInputStyle("profileDob")}
                  type="date"
                  placeholder="DOB"
                  value={patient.dob || ""}
                  onChange={e => setPatient({ ...patient, dob: e.target.value })}
                  onFocus={() => setFocusedInput("profileDob")}
                  onBlur={() => setFocusedInput(null)}
                  disabled={loading}
                />
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  style={hoveredButton === "updateProfile"
                    ? { ...styles.button, ...styles.buttonHover }
                    : styles.button}
                  onMouseEnter={() => setHoveredButton("updateProfile")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  Update Profile
                </button>
              </div>

              {/* Health Records section */}
              <div style={{ marginTop: "3rem" }}>
                <h3 style={{ fontWeight: "700", fontSize: "1.5rem", color: "#2c3e50", marginBottom: "1rem", borderBottom: "2px solid #18c4a5", paddingBottom: "0.5rem" }}>
                  Health Records
                </h3>
                <textarea
                  style={focusedTextarea
                    ? { ...styles.textarea, ...styles.inputFocus }
                    : styles.textarea}
                  value={healthRecords}
                  onChange={e => setHealthRecords(e.target.value)}
                  onFocus={() => setFocusedTextarea(true)}
                  onBlur={() => setFocusedTextarea(false)}
                  rows={6}
                  disabled={loading}
                />
                <button
                  onClick={handleUpdateHealthRecords}
                  disabled={loading}
                  style={hoveredButton === "updateHealth"
                    ? { ...styles.button, ...styles.buttonHover }
                    : styles.button}
                  onMouseEnter={() => setHoveredButton("updateHealth")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  Update Health Records
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients;
