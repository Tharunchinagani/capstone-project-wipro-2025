import React from "react";
import { Link } from "react-router-dom";
import { Carousel, Container, Row, Col, Card, Button } from "react-bootstrap";

// Hero Data
const heroData = [
  {
    title: "Book Your Appointments Online",
    description: "Schedule visits with doctors anytime, anywhere.",
    image: "https://img.icons8.com/fluency/96/ffffff/appointment-reminders.png",
  },
  {
    title: "Manage Patient Records",
    description: "Easily track patient history, prescriptions, and treatments.",
    image: "https://img.icons8.com/fluency/96/ffffff/patient-history.png",
  },
  {
    title: "Explore Wellness Programs",
    description: "Access wellness services for holistic health care.",
    image: "https://img.icons8.com/fluency/96/ffffff/spa.png",
  },
];

// Unique images for feature cards
const featureImages = {
  appointment:
    "https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=600",
  patients:
    "https://cdn-icons-png.flaticon.com/512/4320/4320357.png", 
  providers:
    "https://images.pexels.com/photos/7680745/pexels-photo-7680745.jpeg?auto=compress&cs=tinysrgb&w=600",
  wellness:
    "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600",
  enrollments:
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", 
  payments:
    "https://cdn-icons-png.flaticon.com/512/633/633611.png", 
};

const Welcome = () => {
  return (
    <div className="bg-light" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Custom Header */}
      <header
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "15px 20px",
          textAlign: "center",
          fontSize: "1.4rem",
          fontWeight: "bold",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
        }}
      >
        🏥 SAI HEALTHCARE Hospital
      </header>

      {/* Hero Carousel */}
      <Carousel fade className="mb-5">
        {heroData.map((slide, index) => (
          <Carousel.Item key={index} interval={5000}>
            <div
              className="d-flex flex-column align-items-center justify-content-center text-center"
              style={{
                height: "70vh",
                background: `linear-gradient(rgba(0,128,0,0.6), rgba(0,200,0,0.6)), 
                             url('https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1200') center/cover`,
                color: "white",
              }}
            >
              <img
                src={slide.image}
                alt=""
                style={{
                  width: "100px",
                  marginBottom: "20px",
                  filter: "drop-shadow(2px 2px 3px black)",
                }}
              />
              <h2 className="fw-bold">{slide.title}</h2>
              <p className="lead">{slide.description}</p>
              <Button
                as={Link}
                to="/appointments"
                variant="success"
                className="mt-3 px-4 py-2"
              >
                Get Started
              </Button>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Feature Section */}
      <Container className="pb-5">
        <h2 className="text-center mb-5 fw-bold text-success">Our Features</h2>
        <Row className="g-4">
          {/* Book Appointment */}
          <Col md={4}>
            <Card className="shadow border-0 h-100 text-center hover-card">
              <Card.Img
                variant="top"
                src={featureImages.appointment}
                style={{
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <Card.Body>
                <Card.Title className="fw-bold">Book Appointment</Card.Title>
                <Card.Text>
                  Schedule visits with doctors quickly and securely.
                </Card.Text>
                <Button as={Link} to="/appointments" variant="success">
                  Get Started
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Patients */}
          <Col md={4}>
            <Card className="shadow border-0 h-100 text-center hover-card">
              <Card.Img
                variant="top"
                src={featureImages.patients}
                style={{
                  height: "180px",
                  objectFit: "contain",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              />
              <Card.Body>
                <Card.Title className="fw-bold">Patients</Card.Title>
                <Card.Text>
                  Manage patient records, prescriptions, and history.
                </Card.Text>
                <Button as={Link} to="/patients" variant="success">
                  Manage
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Providers */}
          <Col md={4}>
            <Card className="shadow border-0 h-100 text-center hover-card">
              <Card.Img
                variant="top"
                src={featureImages.providers}
                style={{
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <Card.Body>
                <Card.Title className="fw-bold">Providers</Card.Title>
                <Card.Text>
                  Doctors and wellness providers at your fingertips.
                </Card.Text>
                <Button as={Link} to="/providers" variant="success">
                  View
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Second Row */}
        <Row className="g-4 mt-4">
          {/* Wellness */}
          <Col md={4}>
            <Card className="shadow border-0 h-100 text-center hover-card">
              <Card.Img
                variant="top"
                src={featureImages.wellness}
                style={{
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <Card.Body>
                <Card.Title className="fw-bold">Wellness Services</Card.Title>
                <Card.Text>
                  Explore yoga, meditation, and health programs.
                </Card.Text>
                <Button as={Link} to="/wellness" variant="success">
                  Explore
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Enrollments */}
          <Col md={4}>
            <Card className="shadow border-0 h-100 text-center hover-card">
              <Card.Img
                variant="top"
                src={featureImages.enrollments}
                style={{
                  height: "180px",
                  objectFit: "contain",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              />
              <Card.Body>
                <Card.Title className="fw-bold">Enrollments</Card.Title>
                <Card.Text>
                  Join wellness and healthcare programs easily.
                </Card.Text>
                <Button as={Link} to="/enrollments" variant="success">
                  Enroll
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Payments */}
          <Col md={4}>
            <Card className="shadow border-0 h-100 text-center hover-card">
              <Card.Img
                variant="top"
                src={featureImages.payments}
                style={{
                  height: "180px",
                  objectFit: "contain",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              />
              <Card.Body>
                <Card.Title className="fw-bold">Payments</Card.Title>
                <Card.Text>
                  Securely manage transactions for services and bookings.
                </Card.Text>
                <Button as={Link} to="/payments" variant="success">
                  Pay Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "20px",
          marginTop: "50px",
          textAlign: "center",
        }}
      >
        <h5>🏥 SAI HEALTHCARE Hospital</h5>
        <p>
          123-44 Whitefield, Banglore, India <br />
          📞 +91 98765 43210 | ✉️ info@SAIHEALTHCARE.com
        </p>
        <p className="mb-0">© 2025 SAI HEALTHCARE Hospital. All rights reserved.</p>
      </footer>

      <style>{`
        .hover-card:hover {
          transform: translateY(-8px);
          transition: all 0.3s ease-in-out;
          box-shadow: 0 8px 20px rgba(0,128,0,0.4);
        }
      `}</style>
    </div>
  );
};

export default Welcome;
