import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaPhoneAlt, FaMapMarkerAlt, FaWhatsapp, FaArrowLeft, FaUserShield } from 'react-icons/fa';

// --- Base URL for your Render Backend ---
const API_BASE_URL = "https://tractor-junction-live.onrender.com/api";

// --- 1. Brand Models Page Component ---
const BrandModelsPage = () => {
  const { brandName } = useParams();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    const message = `Namaste, mujhe ${brandName} ke ${modelName} tractor mein interest hai. Details bhejein.`;
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
                <h4 className="fw-bold mb-2 text-center">{m.model}</h4>
                <div className="d-flex justify-content-between mb-3 px-2">
                  <span className="badge bg-white text-dark border p-2 rounded-pill">{m.hp} HP</span>
                  <span className="text-primary fw-bold fs-5">{m.price}</span>
                </div>
                <button onClick={() => contactOnWhatsApp(m.model)} className="btn btn-success w-100 rounded-pill py-2 fw-bold shadow-sm">
                  <FaWhatsapp className="me-2" size={20} /> WhatsApp Enquiry
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5 w-100"><h4>Models jald hi update honge.</h4></div>
        )}
      </div>
    </div>
  );
};

// --- 2. Dealers Page Component ---
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
              <span className="badge bg-primary-light text-primary mb-2" style={{width: 'fit-content'}}>{d.brand}</span>
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

// --- 3. Admin Page Component ---
const AdminPage = () => {
  const [formData, setFormData] = useState({ brand: '', model: '', hp: '', price: '', image: '🚜', logo: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}/tractors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Tractor Added!");
      window.location.href = "/"; // Add karne ke baad home par bhej do
    });
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card p-4 shadow border-0 rounded-4" style={{maxWidth: '500px', width: '100%'}}>
        <h2 className="fw-bold mb-4 text-center">Add New Tractor</h2>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-3 p-3 rounded-pill" placeholder="Brand Name" required onChange={e => setFormData({...formData, brand: e.target.value})} />
          <input className="form-control mb-3 p-3 rounded-pill" placeholder="Model Name" required onChange={e => setFormData({...formData, model: e.target.value})} />
          <input className="form-control mb-3 p-3 rounded-pill" placeholder="HP (e.g. 45 HP)" required onChange={e => setFormData({...formData, hp: e.target.value})} />
          <input className="form-control mb-3 p-3 rounded-pill" placeholder="Price (e.g. 6 Lakh*)" required onChange={e => setFormData({...formData, price: e.target.value})} />
          <input className="form-control mb-3 p-3 rounded-pill" placeholder="Image URL (Optional)" onChange={e => setFormData({...formData, image: e.target.value})} />
          <input className="form-control mb-3 p-3 rounded-pill" placeholder="Brand Logo URL" onChange={e => setFormData({...formData, logo: e.target.value})} />
          <button className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow">Save Tractor to Cloud</button>
        </form>
      </div>
    </div>
  );
};

// --- 4. Main App Component ---
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
      }).catch(() => setLoading(false));
  }, []);

  const brands = Object.keys(tractorData).map(name => ({ name, logo: tractorData[name].logo }));
  const filteredBrands = brands.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="text-center py-5 mt-5"><h3>🚜 Connecting to Cloud...</h3></div>;

  return (
    <Router>
      <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
        <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm sticky-top">
          <div className="container">
            <Link className="navbar-brand fw-bold text-primary fs-3" to="/">TRACTOR JUNCTION</Link>
            <div className="ms-auto d-flex align-items-center">
              <Link className="nav-link px-2 fw-bold text-dark" to="/">Home</Link>
              <Link className="nav-link px-2 fw-bold text-dark" to="/dealers">Dealers</Link>
              <Link className="nav-link px-2 text-danger" title="Admin" to="/admin-control-panel"><FaUserShield size={20}/></Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <>
              <header className="py-5 text-center" style={{ background: 'linear-gradient(135deg, #eef2f7 0%, #dfe9f3 100%)' }}>
                <h1 className="display-4 fw-bold">Sahi Tractor Chunein</h1>
                <div className="bg-white p-2 rounded-pill shadow-lg d-flex align-items-center mx-auto mt-4" style={{ maxWidth: '600px' }}>
                  <FaSearch className="ms-3 text-muted" />
                  <input type="text" className="form-control border-0 shadow-none px-3" placeholder="Search brands..." onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </header>
              <div className="container py-5">
                <div className="row g-4 justify-content-center">
                  {filteredBrands.map((b, i) => (
                    <div key={i} className="col-lg-3 col-md-4 col-6">
                      <Link to={`/brand/${b.name}`} className="text-decoration-none text-dark">
                        <div className="card h-100 border-0 shadow-sm text-center p-4 brand-card" style={{ borderRadius: '30px' }}>
                          <img src={b.logo} alt={b.name} style={{ maxHeight: '70px', objectFit: 'contain' }} className="mb-3 mx-auto" />
                          <h6 className="fw-bold text-uppercase">{b.name}</h6>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </>
          } />
          <Route path="/brand/:brandName" element={<BrandModelsPage />} />
          <Route path="/dealers" element={<DealersPage />} />
          <Route path="/admin-control-panel" element={<AdminPage />} />
        </Routes>
        <style>{`
          .brand-card:hover { transform: translateY(-10px); transition: 0.3s; box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; border: 1px solid #0d6efd !important; }
          .btn-success { background-color: #25d366; border: none; }
        `}</style>
      </div>
    </Router>
  );
}

export default App;
