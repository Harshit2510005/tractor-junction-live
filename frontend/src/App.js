import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaPhoneAlt, FaMapMarkerAlt, FaBars } from 'react-icons/fa';

const API_BASE_URL = "https://tractor-junction-live.onrender.com/api";

// --- Smart Auth Page (Mobile Responsive) ---
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    alert(`${isLogin ? 'Login' : 'Register'} process shuru ho gaya: ${email}`);
  };

  return (
    <div className="container py-4 py-md-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4 shadow-sm border-0 rounded-4 w-100" style={{ maxWidth: '400px' }}>
        <h2 className="fw-bold mb-4 text-center fs-3">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <form onSubmit={handleAuth}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email Address</label>
            <input type="email" className="form-control rounded-pill p-2 shadow-none" placeholder="name@example.com" required onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Password</label>
            <input type="password" className="form-control rounded-pill p-2 shadow-none" required onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary w-100 rounded-pill py-2 fw-bold mb-3 shadow-sm mt-2">
            {isLogin ? 'Login' : 'Sign Up Now'}
          </button>
        </form>
        <p className="text-center small text-muted mb-0">
          {isLogin ? "Naye user hain?" : "Pehle se account hai?"} 
          <span 
            className="text-primary fw-bold ms-1" 
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register Karein' : 'Login Karein'}
          </span>
        </p>
      </div>
    </div>
  );
};

// --- Dealers Page (Mobile Friendly Grid) ---
const DealersPage = () => {
  const [dealers, setDealers] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE_URL}/dealers`).then(res => res.json()).then(data => setDealers(data));
  }, []);
  return (
    <div className="container py-4">
      <h2 className="text-center fw-bold mb-4 fs-3">Authorized Dealers</h2>
      <div className="row g-3">
        {dealers.map((d, i) => (
          <div key={i} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm p-3 rounded-4">
              <h5 className="fw-bold mb-1">{d.name}</h5>
              <p className="text-muted small mb-2"><FaMapMarkerAlt className="text-primary me-1" /> {d.city}</p>
              <a href={`tel:${d.phone}`} className="btn btn-light btn-sm rounded-pill text-success fw-bold w-100 mt-2 border">
                <FaPhoneAlt className="me-2" /> Call Dealer
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [tractorData, setTractorData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/tractors`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
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
      <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
        
        {/* Mobile Friendly Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white py-2 shadow-sm sticky-top border-bottom">
          <div className="container">
            <Link className="navbar-brand fw-bold text-primary fs-4" to="/">TRACTOR <span className="text-dark">JUNCTION</span></Link>
            
            <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <FaBars className="text-dark" />
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <div className="navbar-nav ms-auto align-items-center py-3 py-lg-0">
                <Link className="nav-link px-3 fw-bold text-dark" to="/">Home</Link>
                <Link className="nav-link px-3 fw-bold text-dark mb-2 mb-lg-0" to="/dealers">Dealers</Link>
                <Link className="btn btn-primary rounded-pill px-4 fw-bold btn-sm shadow-sm w-100 w-lg-auto" to="/auth">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="container py-4">
              <h2 className="fw-bold text-center mb-4 fs-3">Explore Brands</h2>
              <div className="row g-3 justify-content-center">
                {Object.keys(tractorData).map((brand, i) => (
                  <div key={i} className="col-6 col-md-4 col-lg-3">
                    <a href={tractorData[brand].url} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark">
                      <div className="card h-100 border-0 shadow-sm text-center p-3 brand-card rounded-4">
                        <div className="d-flex align-items-center justify-content-center mb-2" style={{ height: '60px' }}>
                           <img src={tractorData[brand].logo} alt={brand} style={{ maxWidth: '100%', maxHeight: '50px', objectFit: 'contain' }} />
                        </div>
                        <h6 className="fw-bold text-uppercase small mb-1">{brand}</h6>
                        <span className="text-primary x-small fw-bold">Visit Site →</span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          } />
          <Route path="/dealers" element={<DealersPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>

        <style>{`
          .brand-card:active { transform: scale(0.95); transition: 0.2s; }
          .x-small { font-size: 0.7rem; }
          @media (min-width: 992px) {
            .brand-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; border: 1px solid #0d6efd !important; }
          }
        `}</style>
      </div>
    </Router>
  );
}

export default App;
