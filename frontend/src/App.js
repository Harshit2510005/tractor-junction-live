import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// Zaroori components import karein
import { Navbar, Nav, Container } from 'react-bootstrap';

const API_BASE_URL = "https://tractor-junction-live.onrender.com/api";

function App() {
  const [tractorData, setTractorData] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false); // Menu control ke liye

  useEffect(() => {
    fetch(`${API_BASE_URL}/tractors`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const grouped = data.reduce((acc, curr) => {
            if (!acc[curr.brand]) {
              acc[curr.brand] = { 
                logo: curr.logo, 
                url: curr.website || `https://www.google.com/search?q=${curr.brand}+tractors` 
              };
            }
            return acc;
          }, {});
          setTractorData(grouped);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5 mt-5"><h3>🚜 Loading...</h3></div>;

  return (
    <Router>
      <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
        
        {/* Naya Smart Navbar jo click par band hoga */}
        <Navbar 
          expanded={expanded} 
          expand="lg" 
          bg="white" 
          className="py-2 shadow-sm sticky-top border-bottom"
        >
          <Container>
            <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-4" onClick={() => setExpanded(false)}>
              TRACTOR JUNCTION
            </Navbar.Brand>
            
            {/* Purana FaBars hata kar default Toggle lagaya */}
            <Navbar.Toggle 
              aria-controls="basic-navbar-nav" 
              onClick={() => setExpanded(expanded ? false : "expanded")} 
            />
            
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto align-items-center text-center py-3 py-lg-0">
                <Nav.Link as={Link} to="/" className="px-3 fw-bold text-dark" onClick={() => setExpanded(false)}>Home</Nav.Link>
                <Nav.Link as={Link} to="/dealers" className="px-3 fw-bold text-dark mb-2 mb-lg-0" onClick={() => setExpanded(false)}>Dealers</Nav.Link>
                <Nav.Link as={Link} to="/auth" className="p-0" onClick={() => setExpanded(false)}>
                  <button className="btn btn-primary rounded-pill px-4 fw-bold btn-sm shadow-sm">Sign In</button>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/" element={
            <div className="container py-4">
              <div className="row g-3 justify-content-center">
                {Object.keys(tractorData).map((brand, i) => (
                  <div key={i} className="col-6 col-md-4 col-lg-3">
                    <a href={tractorData[brand].url} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark">
                      <div className="card h-100 border-0 shadow-sm text-center p-3 brand-card rounded-4">
                        <img src={tractorData[brand].logo} alt={brand} style={{ maxHeight: '50px', objectFit: 'contain' }} className="mb-2 mx-auto" />
                        <h6 className="fw-bold text-uppercase small">{brand}</h6>
                        <span className="text-primary x-small fw-bold">Visit Site →</span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          } />
          <Route path="/dealers" element={<div className="text-center py-5">Dealers Page</div>} />
          <Route path="/auth" element={<div className="text-center py-5">Auth Page</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
