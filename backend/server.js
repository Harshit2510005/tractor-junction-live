const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Tractor = require('./models/Tractor'); 
const Dealer = require('./models/Dealer');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 1. MongoDB Connection
// Note: Harshit, dhyan dein ki aapka password aur connection string sahi ho
mongoose.connect('mongodb+srv://HK:Harshit2510@cluster0.mhompz4.mongodb.net/tractorJunction')
    .then(() => console.log("✅ Cloud MongoDB Connected!"))
    .catch(err => console.log("❌ Connection Error:", err));

// 2. Home Route
app.get('/', (req, res) => {
    res.send("<h1>🚀 Tractor Junction Backend Chalu Hai!</h1><p>Data dekhne ke liye <b>/api/tractors</b> par jayein.</p>");
});

// 3. API: Saare Tractors mangwane ke liye
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
    res.send("✅ Data Seeded Successfully with Official Links!");
  } catch (err) {
    res.status(500).send("❌ Error: " + err.message);
  }
});

// 5. Dealers API
app.get('/api/dealers', async (req, res) => {
    try {
        const dealers = await Dealer.find();
        res.json(dealers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/seed-dealers', async (req, res) => {
    try {
        const sampleDealers = [
            { brand: "MAHINDRA", name: "Kisan Tractor Agency", city: "Ahmedabad", phone: "9876543210", address: "S.G. Highway" },
            { brand: "SWARAJ", name: "Bharat Motors", city: "Jaipur", phone: "9123456789", address: "Main Market Road" }
        ];
        await Dealer.deleteMany({});
        await Dealer.insertMany(sampleDealers);
        res.send("✅ Dealers data added!");
    } catch (err) {
        res.status(500).send("❌ Error: " + err.message);
    }
});

// Server Start
// Render aur baki hosting ke liye process.env.PORT zaroori hai
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
});
