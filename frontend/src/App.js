import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaPhoneAlt, FaMapMarkerAlt, FaUserCircle } from 'react-icons/fa';

// --- Base URL for your Render Backend ---
const API_BASE_URL = "https://tractor-junction-live.onrender.com/api";

// --- 1. Dealers Page Component ---
const DealersPage = () => {
  const [dealers, setDealers] = useState([]);
  const [citySearch, setCitySearch] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/dealers`)
      .then(res => res.json())
      .then(data => setDealers(data))
      .catch(err => console.error("Dealer Fetch Error:", err));
  }, []);

  const filtered = dealers.filter(d => d.city.toLowerCase().includes(citySearch.toLowerCase()));

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-5">Authorized Dealers</h2>
      <input type="text" className="form-control rounded-pill p-3 mb-5 shadow-sm border-0" placeholder="Search by city..." onChange={(e) => setCitySearch(e.target.value)} />
      <div className="row g-4">
        {filtered.map((d, i) => (
          <div key={i} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm p-4 rounded-4">
              <span className="badge bg-primary-light text-primary mb-2" style={{width: 'fit-content', backgroundColor: '#e7f1ff'}}>{d.brand}</span>
              <h4 className="fw-bold">{d.name}</h4>
              <p className="text-muted small"><FaMapMarkerAlt /> {d.address}, {d.city}</p>
              <a href={`tel:${d.phone}`} className="text-success fw-bold text-decoration-none"><FaPhoneAlt /> {d.phone}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 2. Auth Pages (Placeholders) ---
const LoginPage = () => <div className="container py-5 text-center"><h2>Login Page Coming Soon</h2></div>;
const RegisterPage = () => <div className="container py-5 text-center"><h2>Registration Page Coming Soon</h2></div>;

// --- 3. Main App Component ---
function App() {
  const [tractorData, setTractorData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/tractors`)
      .then(res => res.json())
      .then(data => {
        // Grouping by brand to get logo and website
        const grouped = data.reduce((acc, curr) => {
          if (!acc[curr.brand]) {
            acc[curr.brand] = { 
              logo: curr.logo, 
              // Agar aapne server.js mein website field dali hai toh wo uthayega
              website: curr.website || `https://www.google.com/search?q=${curr.brand}+tractors+official+website` 
            };
          }
          return acc;
        }, {});
        setTractorData(grouped);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const brands = Object.keys(tractorData).map(name => ({ 
    name, 
    logo: tractorData[name].logo,
    website: tractorData[name].website
  }));

  const filteredBrands = brands.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="text-center py-5 mt-5"><h3>🚜 Connecting to Cloud...</h3></div>;

  return (
    <Router>
      <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
        
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm sticky-top">
          <div className="container">
            <Link className="navbar-brand fw-bold text-primary fs-3" to="/">TRACTOR JUNCTION</Link>
            
            <div className="ms-auto d-flex align-items-center">
              <Link className="nav-link px-2 fw-bold text-dark d-none d-md-block" to="/">Home</Link>
              <Link className="nav-link px-2 fw-bold text-dark me-3" to="/dealers">Dealers</Link>
              
              {/* Login & Register Buttons */}
              <Link className="btn btn-outline-primary rounded-pill px-3 fw-bold me-2 btn-sm" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary rounded-pill px-3 fw-bold btn-sm" to="/register">
                Register
              </Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <>
              {/* Hero Section */}
              <header className="py-5 text-center" style={{ background: 'linear-gradient(135deg, #eef2f7 0%, #dfe9f3 100%)' }}>
                <h1 className="display-4 fw-bold">Sahi Tractor Chunein</h1>
                <p className="text-muted">Brand par click karein aur unki official website visit karein.</p>
                <div className="bg-white p-2 rounded-pill shadow-lg d-flex align-items-center mx-auto mt-4" style={{ maxWidth: '600px' }}>
                  <FaSearch className="ms-3 text-muted" />
                  <input type="text" className="form-control border-0 shadow-none px-3" placeholder="Search brands..." onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </header>

              {/* Brands Grid */}
              <div className="container py-5">
                <div className="row g-4 justify-content-center">
                  {filteredBrands.map((b, i) => (
                    <div key={i} className="col-lg-3 col-md-4 col-6">
                      {/* Brand card clicking now opens the official website in a new tab */}
                      <a href={b.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark">
                        <div className="card h-100 border-0 shadow-sm text-center p-4 brand-card" style={{ borderRadius: '30px' }}>
                          <div className="mb-3 d-flex align-items-center justify-content-center" style={{ height: '80px' }}>
                            <img src={b.logo} alt={b.name} style={{ maxWidth: '100%', maxHeight: '70px', objectFit: 'contain' }} />
                          </div>
                          <h6 className="fw-bold text-uppercase mb-1">{b.name}</h6>
                          <p className="text-primary small mb-0 fw-bold">Visit Website →</p>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </>
          } />
          <Route path="/dealers" element={<DealersPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>

        <footer className="py-5 text-center border-top bg-white mt-5">
          <div className="container">
            <h4 className="fw-bold text-primary mb-3">TRACTOR JUNCTION</h4>
            <p className="text-muted mb-0">© 2026 Tractor Junction - Sabhi Haq Surakshit Hain.</p>
          </div>
        </footer>

        <style>{`
          .brand-card { transition: all 0.3s ease; border: 1px solid transparent !important; }
          .brand-card:hover { 
            transform: translateY(-10px); 
            box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; 
            border: 1px solid #0d6efd !important; 
          }
          .nav-link:hover { color: #0d6efd !important; }
        `}</style>
      </div>
    </Router>
  );
}

export default App;
