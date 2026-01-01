import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaPhoneAlt, FaMapMarkerAlt, FaWhatsapp, FaArrowLeft } from 'react-icons/fa';

// --- 1. Brand Models Page Component (Brand par click karne ke baad) ---
const BrandModelsPage = () => {
  const { brandName } = useParams();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API se sirf is brand ke models fetch karna
    fetch(`http://10.82.123.182:5000/api/tractors`)
      .then(res => res.json())
      .then(data => {
        // Filter: Jo brand URL mein hai usi ke models dikhao
        const brandModels = data.filter(m => m.brand.toUpperCase() === brandName.toUpperCase());
        setModels(brandModels);
        setLoading(false);
      })
      .catch(err => console.error("Models Fetch Error:", err));
  }, [brandName]);

  const contactOnWhatsApp = (modelName) => {
    const phoneNumber = "919876543210"; // Dealer ka number yahan aayega
    const message = `Namaste, mujhe ${brandName} ke ${modelName} tractor mein interest hai. Kripya mujhe iski aur jankari dein.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (loading) return <div className="text-center py-5"><h3>Loading Models...</h3></div>;

  return (
    <div className="container py-5">
      <Link to="/" className="btn btn-outline-primary mb-4 rounded-pill px-4">
        <FaArrowLeft className="me-2" /> Back to Brands
      </Link>
      
      <div className="mb-5">
         <h2 className="fw-bold text-uppercase display-6">{brandName} Tractor Models</h2>
         <p className="text-muted">Apne pasandida model ko chunein aur dealer se sampark karein.</p>
      </div>

      <div className="row g-4">
        {models.length > 0 ? (
          models.map((m, i) => (
            <div key={i} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm p-3 rounded-4">
                <div className="bg-light rounded-4 mb-3 d-flex align-items-center justify-content-center overflow-hidden" style={{height: '220px'}}>
                   {m.image === "🚜" ? <span style={{fontSize: '80px'}}>🚜</span> : 
                    <img src={m.image} alt={m.model} style={{maxWidth: '100%', maxHeight: '180px', objectFit: 'contain'}} />}
                </div>
                <div className="px-2">
                  <h4 className="fw-bold mb-2">{m.model}</h4>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="badge bg-light text-dark border p-2">{m.hp} Category</span>
                    <span className="text-primary fw-bold fs-5">{m.price}</span>
                  </div>
                  <button 
                    onClick={() => contactOnWhatsApp(m.model)}
                    className="btn btn-success w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center"
                  >
                    <FaWhatsapp className="me-2" size={20} /> Buy on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5"><h4>Is brand ke models abhi update ho rahe hain.</h4></div>
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

  useEffect(() => {
    fetch('http://localhost:5000/api/dealers')
      .then(res => res.json())
      .then(data => setDealers(data))
      .catch(err => console.error("Dealer Fetch Error:", err));
  }, []);

  const filteredDealers = dealers.filter(d => {
    const matchBrand = selectedBrand === "All" || d.brand === selectedBrand;
    const matchCity = d.city.toLowerCase().includes(citySearch.toLowerCase());
    return matchBrand && matchCity;
  });

  const uniqueBrands = ["All", ...new Set(dealers.map(d => d.brand))];

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="display-5 fw-bold text-dark">Authorized Dealers</h2>
        <p className="text-muted">Apne shehar ke tractor showroom dhoondhein</p>
      </div>
      
      <div className="row g-3 mb-5 justify-content-center">
        <div className="col-md-4">
          <select className="form-select rounded-pill p-3 shadow-sm" onChange={(e) => setSelectedBrand(e.target.value)}>
            {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control rounded-pill p-3 shadow-sm" placeholder="Search city..." value={citySearch} onChange={(e) => setCitySearch(e.target.value)} />
        </div>
      </div>

      <div className="row g-4">
        {filteredDealers.map((d, i) => (
          <div key={i} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm p-4 dealer-card" style={{ borderRadius: '25px' }}>
              <span className="badge bg-primary-soft text-primary mb-3 py-2 px-3 rounded-pill" style={{width: 'fit-content', backgroundColor: '#e7f1ff'}}>{d.brand} Dealer</span>
              <h4 className="fw-bold mb-3">{d.name}</h4>
              <p className="text-muted mb-2 small"><FaMapMarkerAlt className="me-2"/> {d.address}, {d.city}</p>
              <div className="mt-auto pt-3 border-top">
                 <a href={`tel:${d.phone}`} className="text-decoration-none text-success fw-bold d-flex align-items-center mb-3">
                   <FaPhoneAlt className="me-2" /> {d.phone}
                 </a>
                 <button className="btn btn-primary w-100 rounded-pill py-2 fw-bold">Get Contact Details</button>
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
    fetch('http://localhost:5000/api/tractors')
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
      .catch(err => console.error("Error:", err));
  }, []);

  const brands = Object.keys(tractorData).map(name => ({ 
    name, 
    logo: tractorData[name].logo 
  }));

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-5 mt-5"><h3>Loading Tractor Junction...</h3></div>;

  return (
    <Router>
      <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
        
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm sticky-top">
          <div className="container">
            <Link className="navbar-brand fw-bold text-primary fs-3" to="/">
              TRACTOR <span className="text-dark">JUNCTION</span>
            </Link>
            <div className="ms-auto d-flex">
              <Link className="nav-link px-3 fw-medium text-dark" to="/">Home</Link>
              <Link className="nav-link px-3 fw-medium text-dark" to="/dealers">Dealers</Link>
              <a className="nav-link px-3 fw-medium text-dark" href="#">Compare</a>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <>
              {/* Hero Section */}
              <header className="py-5" style={{ background: 'linear-gradient(135deg, #eef2f7 0%, #dfe9f3 100%)', minHeight: '400px', display: 'flex', alignItems: 'center' }}>
                <div className="container text-center">
                  <h1 className="display-3 fw-bold mb-3" style={{ color: '#2c3e50' }}>Sahi Tractor Chunein</h1>
                  <p className="lead text-secondary mb-5 fs-4">India ke sabse bade tractor brands aur dealers ki jankari.</p>
                  
                  <div className="bg-white p-2 rounded-pill shadow-lg d-flex align-items-center mx-auto" style={{ maxWidth: '650px' }}>
                    <FaSearch className="ms-3 text-muted" size={20} />
                    <input 
                      type="text" 
                      className="form-control border-0 shadow-none px-3 fs-5" 
                      placeholder="Search brands or models..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-primary rounded-pill px-5 py-2 fs-5 fw-bold shadow-sm">Search</button>
                  </div>
                </div>
              </header>

              {/* Brands Grid */}
              <section className="container py-5 mt-4">
                <h2 className="fw-bold text-center mb-5 display-5">Popular Brands</h2>
                <div className="row g-4 justify-content-center">
                  {filteredBrands.map((b, i) => (
                    <div key={i} className="col-lg-3 col-md-4 col-6 mb-4">
                      <Link to={`/brand/${b.name}`} className="text-decoration-none text-dark">
                        <div className="card h-100 border-0 shadow-sm text-center p-4 brand-card" style={{ borderRadius: '35px', border: '1px solid #f0f0f0' }}>
                          <div className="mb-4 d-flex align-items-center justify-content-center" style={{ height: '100px' }}>
                            <img src={b.logo} alt={b.name} style={{ maxWidth: '100%', maxHeight: '80px', objectFit: 'contain' }} />
                          </div>
                          <h4 className="fw-bold text-uppercase mb-2 small-brand-text">{b.name}</h4>
                          <p className="text-primary fw-bold small">Explore Models →</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            </>
          } />
          
          <Route path="/brand/:brandName" element={<BrandModelsPage />} />
          <Route path="/dealers" element={<DealersPage />} />
        </Routes>

        <footer className="py-4 text-center border-top bg-white mt-5">
          <p className="text-muted mb-0 small">© 2026 TRACTOR JUNCTION - India's #1 Tractor Portal</p>
        </footer>

        <style>{`
          .brand-card, .dealer-card { transition: all 0.3s ease-in-out; }
          .brand-card:hover, .dealer-card:hover { transform: translateY(-12px); box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important; }
          .brand-card { min-height: 250px; display: flex; flex-direction: column; justify-content: space-between; }
          .btn-primary { background-color: #007bff; border: none; }
          .btn-success { background-color: #25d366; border: none; } /* WhatsApp Green */
          
          @media (max-width: 576px) {
            .small-brand-text { font-size: 0.8rem !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .brand-card { padding: 15px !important; min-height: 180px; }
          }
        `}</style>
      </div>
    </Router>
  );
}

export default App;