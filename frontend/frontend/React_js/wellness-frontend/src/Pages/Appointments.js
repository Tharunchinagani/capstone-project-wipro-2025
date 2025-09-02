import React, { useEffect, useState } from "react";
import {
  getAllPatients,
  getProviders,
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} from "../services/Api";
import { Form, Button, Table, Card, Alert, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AppointmentBooking = () => {
  const [patients, setPatients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    id: null,
    patient_id: "",
    provider_id: "",
    appointment_date: "",
    notes: "",
    status: "PENDING",
  });
  const [loading, setLoading] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAppointments, setShowAppointments] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, providersRes] = await Promise.all([
          getAllPatients(),
          getProviders(),
        ]);
        setPatients(patientsRes.data);
        setProviders(providersRes.data);
      } catch {
        setError("Failed to load dropdown data.");
      }
    };
    fetchData();
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    setError(null);
    try {
      const response = await getAppointments();
      setAppointments(response.data);
    } catch {
      setError("Failed to fetch appointments.");
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setForm({
      id: null,
      patient_id: "",
      provider_id: "",
      appointment_date: "",
      notes: "",
      status: "PENDING",
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      appointmentDate: form.appointment_date,
      notes: form.notes,
      status: form.status,
      patient: { id: Number(form.patient_id) },
      provider: { id: Number(form.provider_id) },
    };

    try {
      if (form.id) {
        await updateAppointment(form.id, payload);
        setSuccess("Appointment updated successfully.");
      } else {
        await createAppointment(payload);
        setSuccess("Appointment booked successfully.");
      }
      clearForm();
      fetchAppointments();
    } catch {
      setError("Failed to save appointment.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (appt) => {
    setForm({
      id: appt.id,
      patient_id: appt.patient?.id || "",
      provider_id: appt.provider?.id || "",
      appointment_date: appt.appointmentDate
        ? appt.appointmentDate.slice(0, 16)
        : "",
      notes: appt.notes || "",
      status: appt.status || "PENDING",
    });
    setShowAppointments(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?"))
      return;
    setLoading(true);
    try {
      await deleteAppointment(id);
      setSuccess("Deleted successfully.");
      if (form.id === id) clearForm();
      fetchAppointments();
    } catch {
      setError("Failed to delete appointment.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setLoading(true);
    try {
      await updateAppointment(id, { status });
      setSuccess("Status updated.");
      setAppointments((appointments) =>
        appointments.map((appt) =>
          appt.id === id ? { ...appt, status } : appt
        )
      );
    } catch {
      setError("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-vector/abstract-medical-wallpaper-template-design_53876-61804.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-center mb-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2966/2966481.png"
                  alt="Appointment Icon"
                  style={{ width: "70px", marginRight: "15px" }}
                />
                <h3 className="text-success fw-bold m-0">
                  {form.id ? "Edit Appointment" : "Book Appointment"}
                </h3>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Select Patient
                  </Form.Label>
                  <Form.Select
                    name="patient_id"
                    value={form.patient_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Patient --</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.email})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Select Provider
                  </Form.Label>
                  <Form.Select
                    name="provider_id"
                    value={form.provider_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Provider --</option>
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.specialization})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Appointment Date & Time
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="appointment_date"
                    value={form.appointment_date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    variant="success"
                    disabled={loading}
                    className="fw-bold px-4"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        {form.id ? "Updating..." : "Booking..."}
                      </>
                    ) : form.id ? (
                      "Update Appointment"
                    ) : (
                      "Book Appointment"
                    )}
                  </Button>

                  {form.id && (
                    <Button variant="secondary" onClick={clearForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <Button
              variant={showAppointments ? "secondary" : "primary"}
              onClick={() => setShowAppointments((prev) => !prev)}
              className="fw-bold"
            >
              {showAppointments ? "Hide Appointments" : "View Appointments"}
            </Button>
          </div>

          {showAppointments && (
            <Card className="shadow-lg border-0 rounded-4 mt-4">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2942/2942789.png"
                    alt="List Icon"
                    style={{ width: "50px", marginRight: "10px" }}
                  />
                  <h4 className="text-success fw-bold mb-0">
                    Appointments List
                  </h4>
                </div>

                {loadingAppointments ? (
                  <p>Loading appointments...</p>
                ) : appointments.length === 0 ? (
                  <p>No appointments available.</p>
                ) : (
                  <Table striped bordered hover responsive>
                    <thead className="table-success">
                      <tr>
                        <th>Patient</th>
                        <th>Provider</th>
                        <th>Date & Time</th>
                        <th>Notes</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt) => (
                        <tr key={appt.id}>
                          <td>{appt.patient?.name || "Unknown"}</td>
                          <td>{appt.provider?.name || "Unknown"}</td>
                          <td>
                            {new Date(appt.appointmentDate).toLocaleString()}
                          </td>
                          <td>{appt.notes || "-"}</td>
                          <td>
                            <Form.Select
                              value={appt.status}
                              onChange={(e) =>
                                handleStatusChange(appt.id, e.target.value)
                              }
                              disabled={loading}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="CONFIRMED">Confirmed</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="CANCELLED">Cancelled</option>
                            </Form.Select>
                          </td>
                          <td className="d-flex gap-2">
                            <Button
                              size="sm"
                              variant="warning"
                              onClick={() => handleEdit(appt)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(appt.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
