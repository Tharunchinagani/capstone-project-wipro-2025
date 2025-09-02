import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

const NavigationBar = () => {
  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? "fw-semibold text-success bg-light rounded px-3 py-2 d-flex align-items-center"
      : "text-white px-3 py-2 d-flex align-items-center";

  return (
    <Navbar bg="success" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand
          as={NavLink}
          to="/"
          end
          className="me-5 fw-bold fs-4 text-white text-decoration-none d-flex align-items-center"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/2965/2965567.png"
            alt="Logo"
            style={{ width: "24px", height: "24px", marginRight: "8px" }}
          />
          Health & Wellness
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav>
            <Nav.Link
              as={NavLink}
              to="/patients"
              end
              className={getNavLinkClass}
              style={{ gap: "6px" }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/1995/1995520.png"
                alt="Patients"
                style={{ width: "16px", height: "16px" }}
              />
              Patients
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/providers"
              end
              className={getNavLinkClass}
              style={{ gap: "6px" }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/7960/7960597.png"
                alt="Providers"
                style={{ width: "16px", height: "16px" }}
              />
              Providers
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/appointments"
              className={getNavLinkClass}
              style={{ gap: "6px" }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/684/684908.png"
                alt="Appointments"
                style={{ width: "16px", height: "16px" }}
              />
              Appointments
            </Nav.Link>

            <NavDropdown
              title={
                <div className="d-flex align-items-center" style={{ gap: "6px" }}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
                    alt="Services"
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span>Services & Enrollments</span>
                </div>
              }
              id="services-enrollments-dropdown"
              className="mx-2"
            >
              <NavDropdown.Item
                as={NavLink}
                to="/wellness"
                className="d-flex align-items-center"
                style={{ gap: "4px" }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/190/190411.png"
                  alt="Wellness"
                  style={{ width: "14px", height: "14px" }}
                />
                <span>Wellness Services</span>
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/enrollments"
                className="d-flex align-items-center"
                style={{ gap: "4px" }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3176/3176068.png"
                  alt="Enrollments"
                  style={{ width: "14px", height: "14px" }}
                />
                <span>Enrollments</span>
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              as={NavLink}
              to="/payments"
              className={getNavLinkClass}
              style={{ gap: "6px" }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/1170/1170576.png"
                alt="Payments"
                style={{ width: "16px", height: "16px" }}
              />
              Payments
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            <Nav.Link
              as={NavLink}
              to="/login"
              className={getNavLinkClass}
              style={{ gap: "6px" }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/1828/1828527.png"
                alt="Login"
                style={{ width: "16px", height: "16px" }}
              />
              Login
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/register"
              className={getNavLinkClass}
              style={{ gap: "6px" }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/992/992651.png"
                alt="Register"
                style={{ width: "16px", height: "16px" }}
              />
              Register
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
