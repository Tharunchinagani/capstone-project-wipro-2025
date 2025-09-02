import React, { useEffect, useState } from "react";
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
  getAllPatients,
  getAppointments,
  getWellnessServices,
} from "../services/Api";
import { Modal, Button, Form, Row, Col, Card, Badge } from "react-bootstrap";
import { Dropdown, ButtonGroup } from "react-bootstrap";

const PaymentsCRUD = () => {
  const [payments, setPayments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    id: null,
    patientId: "",
    appointmentId: "",
    serviceId: "",
    paymentStatus: "PENDING",
    paymentDate: "",
    transactionId: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchDropdownData();
    fetchPayments();
  }, []);

  async function fetchDropdownData() {
    try {
      const [patientsData, appointmentsData, servicesData] = await Promise.all([
        getAllPatients(),
        getAppointments(),
        getWellnessServices(),
      ]);
      setPatients(patientsData.data);
      setAppointments(appointmentsData.data);
      setServices(servicesData.data);
    } catch {
      setError("⚠️ Failed to fetch dropdown data");
    }
  }

  async function fetchPayments() {
    setLoadingPayments(true);
    try {
      const res = await getPayments();
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("⚠️ Failed to fetch payments");
    } finally {
      setLoadingPayments(false);
    }
  }

  function clearForm() {
    setForm({
      id: null,
      patientId: "",
      appointmentId: "",
      serviceId: "",
      paymentStatus: "PENDING",
      paymentDate: "",
      transactionId: "",
      amount: "",
    });
    setError("");
    setSuccess("");
  }

  function generateTransactionId() {
    return `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? (value === "" ? "" : parseFloat(value)) : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.patientId || !form.appointmentId || !form.serviceId || !form.amount) {
      setError("⚠️ Please fill all required fields");
      return;
    }
    if (form.amount <= 0) {
      setError("⚠️ Amount must be positive");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      patientId: Number(form.patientId),
      appointmentId: Number(form.appointmentId),
      serviceId: Number(form.serviceId),
      paymentStatus: form.paymentStatus,
      paymentDate: form.paymentDate ? new Date(form.paymentDate) : new Date(),
      transactionId: form.id ? form.transactionId : generateTransactionId(),
      amount: Number(form.amount),
    };

    try {
      if (form.id) {
        await updatePayment(form.id, payload);
        setSuccess("✅ Payment updated successfully!");
      } else {
        await createPayment(payload);
        setSuccess("✅ Payment added successfully!");
      }
      clearForm();
      fetchPayments();
    } catch {
      setError("❌ Failed to save payment");
    }
    setLoading(false);
  }

  function handleEdit(payment) {
    setForm({
      id: payment.id,
      patientId: payment.patient?.id || payment.patientId || "",
      appointmentId: payment.appointment?.id || payment.appointmentId || "",
      serviceId: payment.service?.id || payment.serviceId || "",
      paymentStatus: payment.paymentStatus || "PENDING",
      paymentDate: payment.paymentDate ? payment.paymentDate.substring(0, 16) : "",
      transactionId: payment.transactionId,
      amount: payment.amount,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    setLoading(true);
    try {
      await deletePayment(id);
      if (form.id === id) clearForm();
      setSuccess("🗑️ Payment deleted");
      fetchPayments();
    } catch {
      setError("❌ Failed to delete payment");
    }
    setLoading(false);
  }

  function handleView(payment) {
    setSelectedPayment(payment);
    setShowModal(true);
  }

  return (
    <div className="container py-4">
      {/* Add / Edit Form */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Header className="bg-gradient bg-primary text-white fw-bold fs-5 rounded-top">
          {form.id ? "✏️ Edit Payment" : "➕ Add Payment"}
        </Card.Header>
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Patient</Form.Label>
                  <Form.Select
                    name="patientId"
                    value={form.patientId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Appointment</Form.Label>
                  <Form.Select
                    name="appointmentId"
                    value={form.appointmentId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Appointment</option>
                    {appointments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.appointmentDate}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Service</Form.Label>
                  <Form.Select
                    name="serviceId"
                    value={form.serviceId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Service</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Status</Form.Label>
                  <Form.Select
                    name="paymentStatus"
                    value={form.paymentStatus}
                    onChange={handleChange}
                  >
                    <option value="PENDING">⏳ PENDING</option>
                    <option value="SUCCESS">✅ SUCCESS</option>
                    <option value="FAILED">❌ FAILED</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Payment Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="paymentDate"
                    value={form.paymentDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex gap-2 mt-3">
              <Button type="submit" variant="success" disabled={loading}>
                {form.id ? "💾 Update Payment" : "➕ Add Payment"}
              </Button>
              <Button variant="outline-secondary" onClick={clearForm}>
                Clear
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Payments Table */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-gradient bg-secondary text-white fw-bold fs-5 rounded-top">
          📋 Payment Records
        </Card.Header>
        <Card.Body>
          {loadingPayments ? (
            <p>Loading payments...</p>
          ) : payments.length === 0 ? (
            <p className="text-muted fst-italic">No payment records found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Appointment</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, idx) => (
                    <tr key={payment.id}>
                      <td>{idx + 1}</td>
                      <td>{payment.patient?.name || payment.patientId}</td>
                      <td>{payment.appointment?.appointmentDate || payment.appointmentId}</td>
                      <td>{payment.service?.name || payment.serviceId}</td>
                      <td>
                        <Badge
                          bg={
                            payment.paymentStatus === "SUCCESS"
                              ? "success"
                              : payment.paymentStatus === "FAILED"
                              ? "danger"
                              : "warning"
                          }
                          text={payment.paymentStatus === "PENDING" ? "dark" : "light"}
                        >
                          {payment.paymentStatus}
                        </Badge>
                      </td>
                      <td>
                        {payment.paymentDate
                          ? new Date(payment.paymentDate).toLocaleString()
                          : "-"}
                      </td>
                      <td>{payment.transactionId}</td>
                      <td className="fw-bold text-success">
                        ₹ {payment.amount?.toFixed(2)}
                      </td>
                      <td className="text-center">
                        <Dropdown as={ButtonGroup}>
                          <Button size="sm" variant="outline-secondary">
                            Actions
                          </Button>
                          <Dropdown.Toggle
                            split
                            variant="outline-secondary"
                            id={`dropdown-${payment.id}`}
                          />
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleView(payment)}>
                              👁️ View
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleEdit(payment)}>
                              ✏️ Edit
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleDelete(payment.id)}
                              className="text-danger"
                            >
                              🗑️ Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* View Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="md">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>💳 Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment ? (
            <div className="p-2">
              <p><strong>ID:</strong> {selectedPayment.id}</p>
              <p><strong>Patient:</strong> {selectedPayment.patient?.name}</p>
              <p><strong>Appointment:</strong> {selectedPayment.appointment?.appointmentDate}</p>
              <p><strong>Service:</strong> {selectedPayment.service?.name}</p>
              <p><strong>Status:</strong> {selectedPayment.paymentStatus}</p>
              <p><strong>Date:</strong> {new Date(selectedPayment.paymentDate).toLocaleString()}</p>
              <p><strong>Transaction ID:</strong> {selectedPayment.transactionId}</p>
              <p><strong>Amount:</strong> ₹ {selectedPayment.amount?.toFixed(2)}</p>
            </div>
          ) : (
            <p>No data available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PaymentsCRUD;
