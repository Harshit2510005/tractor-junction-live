import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaPhoneAlt, FaMapMarkerAlt, FaWhatsapp, FaArrowLeft } from 'react-icons/fa';

// --- Base URL for your Render Backend ---
const API_BASE_URL = "https://tractor-junction-live.onrender.com/api";

// --- 1. Brand Models Page Component ---
const BrandModelsPage = () => {
  const { brandName } = useParams();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API se tractors fetch karke filter karna
    fetch(`${API_BASE_URL}/tractors`)
      .then(res => res.json())
      .then(data => {
        const brandModels = data.filter(m => m.brand.toUpperCase() === brandName.toUpperCase());
        setModels(brandModels);
        setLoading(false);
      })
      .catch(err => {
        console.error("Models Fetch Error:", err);
        setLoading(false);
      });
  }, [brandName]);

  const contactOnWhatsApp = (modelName) => {
    const phoneNumber = "919876543210"; 
    const message = `Namaste, mujhe ${brandName} ke ${modelName} tractor mein interest hai. Kripya details bhejein.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) return <div className="text-center py-5 mt-5"><h3>🚜 Loading {brandName} Models...</h3></div>;

  return (
    <div className="container py-5">
      <Link to="/" className="btn btn-outline-primary mb-4 rounded-pill px-4 shadow-sm">
        <FaArrowLeft className="me-2" /> Back to Brands
      </Link>
      
      <div className="mb-5">
         <h2 className="fw-bold text-uppercase display-6">{brandName} Models</h2>
         <p className="text-muted">Apne pasandida model ki jankari aur WhatsApp inquiry karein.</p>
      </div>

      <div className="row g-4">
        {models.length > 0 ? (
          models.map((m, i) => (
            <div key={i} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm p-3 rounded-4">
                <div className="bg-light rounded-4 mb-3 d-flex align-items-center justify-content-center" style={{height: '220px'}}>
                   {m.image === "🚜" ? <span style={{fontSize: '80px'}}>🚜</span> : 
                    <img src={m.image} alt={m.model} style={{maxWidth: '100%', maxHeight: '180px', objectFit: 'contain'}} />}
                </div>
                <div className="px-2">
                  <h4 className="fw-bold mb-2">{m.model}</h4>
                  <div className="d-flex justify-content-between mb-3 align-items-center">
                    <span className="badge bg-white text-dark border px-3 py-2 rounded-pill">{m.hp} HP</span>
                    <span className="text-primary fw-bold fs-5">{m.price}</span>
                  </div>
                  <button onClick={() => contactOnWhatsApp(m.model)} className="btn btn-success w-100 rounded-pill py-2 fw-bold shadow-sm">
                    <FaWhatsapp className="me-2" size={20} /> Buy on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5 w-100">
            <h4 className="text-muted">Is brand ke models abhi update ho rahe hain.</h4>
            <Link to="/" className="btn btn-primary mt-3 rounded-pill">Explore Other Brands</Link>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 2. Dealers Page Component ---
const DealersPage = () => {
  const [dealers, setDealers] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [citySearch, setCitySearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/dealers`)
      .then(res => res.json())
      .then(data => {
        setDealers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dealer Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  const filteredDealers = dealers.filter(d => {
    const matchBrand = selectedBrand === "All" || d.brand === selectedBrand;
    const matchCity = d.city.toLowerCase().includes(citySearch.toLowerCase());
    return matchBrand && matchCity;
  });

  const uniqueBrands = ["All", ...new Set(dealers.map(d => d.brand))];

  if (loading) return <div className="text-center py-5 mt-5"><h3>🔍 Finding Dealers...</h3></div>;

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="display-5 fw-bold text-dark">Authorized Dealers</h2>
        <p className="text-muted">Apne shehar mein tractor showroom talash karein</p>
      </div>
      
      <div className="row g-3 mb-5 justify-content-center">
        <div className="col-md-4">
          <select className="form-select rounded-pill p-3 shadow-sm border-0" onChange={(e) => setSelectedBrand(e.target.value)}>
            {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control rounded-pill p-3 shadow-sm border-0" placeholder="Search by city (e.g. Pune)..." value={citySearch} onChange={(e) => setCitySearch(e.target.value)} />
        </div>
      </div>

      <div className="row g-4">
        {filteredDealers.map((d, i) => (
          <div key={i} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm p-4 dealer-card" style={{ borderRadius: '25px' }}>
              <span className="badge mb-3 py-2 px-3 rounded-pill" style={{width: 'fit-content', backgroundColor: '#e7f1ff', color: '#0d6efd'}}>{d.brand} Dealer</span>
              <h4 className="fw-bold mb-3">{d.name}</h4>
              <p className="text-muted mb-2 small"><FaMapMarkerAlt className="me-2 text-primary"/> {d.address}, {d.city}</p>
              <div className="mt-auto pt-3 border-top">
                 <a href={`tel:${d.phone}`} className="text-decoration-none text-success fw-bold d-flex align-items-center mb-3">
                   <FaPhoneAlt className="me-2" /> {d.phone}
                 </a>
                 <button className="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm">View Location</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 3. Main App Component ---
function App() {
  const [tractorData, setTractorData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/tractors`)
      .then(res => res.json())
      .then(data => {
        const grouped = data.reduce((acc, curr) => {
          if (!acc[curr.brand]) acc[curr.brand] = { logo: curr.logo, models: [] };
          acc[curr.brand].models.push(curr);
          return acc;
        }, {});
        setTractorData(grouped);
        setLoading(false);
      })
      .catch(err => {
        console.error("Main Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  const brands = Object.keys(tractorData).map(name => ({ 
    name, 
    logo: tractorData[name].logo 
  }));

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-5 mt-5"><h3>🚜 Welcome to Tractor Junction...</h3></div>;

  return (
    <Router>
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
        
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm sticky-top border-bottom">
          <div className="container">
            <Link className="navbar-brand fw-bold text-primary fs-3" to="/">
              TRACTOR <span className="text-dark">JUNCTION</span>
            </Link>
            <div className="ms-auto d-flex align-items-center">
              <Link className="nav-link px-3 fw-bold text-dark" to="/">Home</Link>
              <Link className="nav-link px-3 fw-bold text-dark" to="/dealers">Dealers</Link>
              <button className="btn btn-primary rounded-pill px-4 ms-2 d-none d-md-block fw-bold shadow-sm">Compare</button>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <>
              {/* Hero Section */}
              <header className="py-5" style={{ background: 'linear-gradient(135deg, #eef2f7 0%, #dfe9f3 100%)', minHeight: '380px', display: 'flex', alignItems: 'center' }}>
                <div className="container text-center">
                  <h1 className="display-4 fw-bold mb-3" style={{ color: '#2c3e50' }}>Sahi Tractor Chunein</h1>
                  <p className="lead text-secondary mb-5">India ke sabse bade tractor portal par brands aur dealers ki jankari.</p>
                  
                  <div className="bg-white p-2 rounded-pill shadow-lg d-flex align-items-center mx-auto" style={{ maxWidth: '600px' }}>
                    <FaSearch className="ms-3 text-muted" size={18} />
                    <input 
                      type="text" 
                      className="form-control border-0 shadow-none px-3" 
                      placeholder="Search brands like Mahindra, John Deere..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm">Search</button>
                  </div>
                </div>
              </header>

              {/* Brands Grid */}
              <section className="container py-5 mt-2">
                <h2 className="fw-bold text-center mb-5">Popular Brands</h2>
                <div className="row g-4 justify-content-center">
                  {filteredBrands.length > 0 ? (
                    filteredBrands.map((b, i) => (
                      <div key={i} className="col-lg-3 col-md-4 col-6 mb-3">
                        <Link to={`/brand/${b.name}`} className="text-decoration-none text-dark">
                          <div className="card h-100 border-0 shadow-sm text-center p-4 brand-card" style={{ borderRadius: '30px' }}>
                            <div className="mb-3 d-flex align-items-center justify-content-center" style={{ height: '80px' }}>
                              <img src={b.logo} alt={b.name} style={{ maxWidth: '100%', maxHeight: '70px', objectFit: 'contain' }} />
                            </div>
                            <h5 className="fw-bold text-uppercase mb-1 small-brand-text">{b.name}</h5>
                            <p className="text-primary small fw-bold">View Models →</p>
                          </div>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-5"><h4>No brands found. Try another name.</h4></div>
                  )}
                </div>
              </section>
            </>
          } />
          
          <Route path="/brand/:brandName" element={<BrandModelsPage />} />
          <Route path="/dealers" element={<DealersPage />} />
        </Routes>

        <footer className="py-5 text-center border-top bg-white mt-5">
          <div className="container">
            <h4 className="fw-bold text-primary mb-3">TRACTOR JUNCTION</h4>
            <p className="text-muted mb-0">© 2026 Tractor Junction - Sabhi Haq Surakshit Hain.</p>
          </div>
        </footer>

        <style>{`
          .brand-card, .dealer-card { transition: all 0.3s cubic-bezier(.25,.8,.25,1); border: 1px solid transparent !important; }
          .brand-card:hover, .dealer-card:hover { 
            transform: translateY(-10px); 
            box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important; 
            border: 1px solid #0d6efd !important;
          }
          .btn-success { background-color: #25d366; border: none; }
          .btn-success:hover { background-color: #128c7e; }
          
          @media (max-width: 576px) {
            .small-brand-text { font-size: 0.85rem !important; }
            .brand-card { padding: 15px !important; min-height: 180px; }
            .display-4 { font-size: 2rem !important; }
          }
        `}</style>
      </div>
    </Router>
  );
}

export default App;