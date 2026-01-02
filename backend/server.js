const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Models Import
const Tractor = require('./models/Tractor'); 
const Dealer = require('./models/Dealer');
const User = require('./models/User'); 

const app = express();

// --- 1. Middlewares ---
// CORS ko correctly configure karein taaki Vercel se request aa sake
app.use(cors({
    origin: "*", // Sabhi domains ko allow karein (Testing ke liye)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// --- 2. MongoDB Connection ---
mongoose.connect('mongodb+srv://HK:Harshit2510@cluster0.mhompz4.mongodb.net/tractorJunction')
    .then(() => console.log("✅ Cloud MongoDB Connected!"))
    .catch(err => console.log("❌ Connection Error:", err));

// --- 3. Routes ---

// Home Route
app.get('/', (req, res) => {
    res.send("<h1>🚀 Tractor Junction Backend Chalu Hai!</h1>");
});

// API: Saare Tractors mangwane ke liye
app.get('/api/tractors', async (req, res) => {
    try {
        const data = await Tractor.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. API: Seed Data (Brands aur Official Links)
app.get('/api/seed', async (req, res) => {
  try {
    await Tractor.deleteMany({}); // Purana sara data delete karein
    const seedData = [
      { brand: "MAHINDRA", logo: "/image/mahindra-1673872647.webp", website: "https://www.mahindratractor.com/" },
      { brand: "VST", logo: "/image/vst-logo-present-scaled.webp", website: "https://vsttractors.com/" },
      { brand: "JOHN DEERE", logo: "/image/john-deere-1579511882.webp", website: "https://www.deere.co.in/en/tractors/" },
      { brand: "MASSEY-FERGUSON", logo: "/image/massey-ferguson-1579512590.webp", website: "https://masseyfergusonindia.com/massey-ferguson/" },
      { brand: "SWARAJ", logo: "/image/swaraj.png", website: "https://www.swarajtractors.com/" },
      { brand: "SONALIKA", logo: "/image/sonalika-1725262747.webp", website: "https://www.sonalika.com/" },
      { brand: "EICHER", logo: "/image/Eicher.png", website: "https://eichertractors.in/eichertractors/" },
      { brand: "KUBOTA", logo: "/image/Kubota-Symbol.png", website: "https://www.kubota.com/products/tractor/index.html" },
      { brand: "NEW-HOLLAND", logo: "/image/New-Holland.png", website: "https://agriculture.newholland.com/en/india/products/agricultural-tractors" },
      { brand: "POWETRAC", logo: "/image/powertrac-1579511958-2.webp", website: "https://powertrac.escortskubota.com/" },
      { brand: "PREET", logo: "/image/PREET.png", website: "https://www.preet.co/PREET-agricultural-tractors.php" },
      { brand: "SOLIS TRACTORS", logo: "/image/Solish.webp", website: "https://solis-yanmar.com/" },
      { brand: "INDO-FARM", logo: "/image/indo-farm.webp", website: "https://www.indofarm.in/tractor/" },
      { brand: "KARTAR", logo: "/image/kartar 1975.webp", website: "https://kartartractors.com/" }
    ];
    await Tractor.insertMany(seedData);
    res.send("✅ Data Seeded Successfully with Working Logos!");
  } catch (err) {
    res.status(500).send("❌ Error: " + err.message);
  }
});

// Dealers API
app.get('/api/dealers', async (req, res) => {
    try {
        const dealers = await Dealer.find();
        res.json(dealers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- 4. Auth APIs (Login & Register) ---

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Sabhi fields bharna zaroori hai!" });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Account pehle se bana hai!" });

    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: "Registration Safal! Ab Sign In karein." });
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    
    if (!user) return res.status(400).json({ message: "Email ya Password galat hai!" });

    res.json({ message: "Login Safal!", user: { email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// --- 5. Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
});
