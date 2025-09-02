import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import {
  PencilSquare,
  Trash,
  PersonFill,
  TelephoneFill,
  EnvelopeFill,
  BriefcaseFill,
} from "react-bootstrap-icons";
import {
  getProviders,
  createProvider,
  updateProvider,
  deleteProvider,
} from "../services/Api";

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    password: "",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [showProviders, setShowProviders] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    const res = await getProviders();
    setProviders(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editId) {
        await updateProvider(editId, form);
        setEditId(null);
      } else {
        await createProvider(form);
      }
      setForm({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        password: "",
      });
      fetchProviders();
    } catch (err) {
      setError(err.response?.data || "Submission failed. Please try again.");
    }
  };

  const handleEdit = (provider) => {
    setEditId(provider.id);
    setForm({
      name: provider.name || "",
      email: provider.email || "",
      phone: provider.phone || "",
      specialization: provider.specialization || "",
      password: "",
    });
  };

  const handleDelete = async (id) => {
    await deleteProvider(id);
    fetchProviders();
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
        padding: "30px 15px",
      }}
    >
      <div className="container" style={{ maxWidth: "1000px" }}>
        {/* Hero Header */}
        <div className="d-flex align-items-center justify-content-center mb-4 bg-success text-white p-4 rounded shadow-lg">
          <img
            src="https://cdn-icons-png.flaticon.com/128/17104/17104793.png"
            alt="Providers Icon"
            style={{ width: "65px", marginRight: "20px" }}
          />
          <div>
            <h2 className="fw-bold m-0">Manage Providers</h2>
            <p className="mb-0">Doctors, specialists, and healthcare staff</p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-sm mb-4 border-0">
          <Card.Body>
            <Card.Title className="mb-3 fw-bold text-success">
              {editId ? "✏️ Update Provider" : "➕ Add New Provider"}
            </Card.Title>
            <Form onSubmit={handleSubmit} className="row g-3">
              <Form.Group className="col-md-6">
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="col-md-6">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="col-md-6">
                <Form.Control
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="col-md-6">
                <Form.Control
                  type="text"
                  name="specialization"
                  placeholder="Specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="col-md-12">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required={!editId}
                />
              </Form.Group>
              <div className="d-grid">
                <Button variant={editId ? "warning" : "success"} type="submit">
                  {editId ? "Update Provider" : "Add Provider"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* Toggle Providers */}
        <div className="text-center mb-3">
          <Button
            variant={showProviders ? "secondary" : "success"}
            onClick={() => setShowProviders((prev) => !prev)}
          >
            {showProviders ? "Hide Providers ▲" : "View Providers ▼"}
          </Button>
        </div>

        {/* Providers Table */}
        {showProviders && (
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="text-center mb-3">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
                  alt="Doctors Illustration"
                  style={{ width: "120px" }}
                />
                <h5 className="fw-bold mt-2 text-success">
                  Registered Providers
                </h5>
              </div>
              <Table responsive hover bordered className="align-middle">
                <thead className="table-success">
                  <tr>
                    <th>#</th>
                    <th>
                      <PersonFill /> Name
                    </th>
                    <th>
                      <EnvelopeFill /> Email
                    </th>
                    <th>
                      <TelephoneFill /> Phone
                    </th>
                    <th>
                      <BriefcaseFill /> Specialization
                    </th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {providers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No providers found.
                      </td>
                    </tr>
                  ) : (
                    providers.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td className="fw-semibold">{p.name}</td>
                        <td>{p.email}</td>
                        <td>{p.phone}</td>
                        <td>
                          <span className="badge bg-success">
                            {p.specialization}
                          </span>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-warning"
                            className="me-2"
                            onClick={() => handleEdit(p)}
                          >
                            <PencilSquare /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(p.id)}
                          >
                            <Trash /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {error && (
          <div className="text-danger mt-3 text-center fw-semibold">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Providers;
