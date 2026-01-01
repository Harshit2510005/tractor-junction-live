const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Tractor = require('./models/Tractor'); 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 1. MongoDB Connection
mongoose.connect('mongodb+srv://HK:Harshit2510@cluster0.mhompz4.mongodb.net/tractorJunction')
    .then(() => console.log("✅ Cloud MongoDB Connected!"))
    .catch(err => console.log("❌ Connection Error:", err));

// 2. Home Route (Testing ke liye)
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

// 4. API: Naya Tractor manually add karne ke liye
app.post('/api/add-tractor', async (req, res) => {
    try {
        const newTractor = new Tractor(req.body);
        await newTractor.save();
        res.status(201).json({ message: "Tractor Added Successfully!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 5. API: Database mein shuruati data (Seed) bharne ke liye
app.get('/api/seed', async (req, res) => {
    try {
        const fullTractorData = [
            // MAHINDRA
            { brand: "MAHINDRA", model: "Arjun 555 DI", hp: "50 HP", price: "7.60 Lakh*", logo: "/image/mahindra-1673872647.webp", image: "https://www.mahindratractor.com/assets/images/arjun-555.png" },
            { brand: "MAHINDRA", model: "Jivo 225 DI", hp: "20 HP", price: "4.30 Lakh*", logo: "/image/mahindra-1673872647.webp", image: "https://www.mahindratractor.com/assets/images/jivo.png" },
            { brand: "MAHINDRA", model: "Yuvo 575 DI", hp: "45 HP", price: "7.10 Lakh*", logo: "/image/mahindra-1673872647.webp", image: "https://www.mahindratractor.com/assets/images/yuvo.png" },
            
            // JOHN DEERE
            { brand: "JOHN DEERE", model: "5310 GearPro", hp: "55 HP", price: "9.20 Lakh*", logo: "/image/john-deere-1579511882.webp", image: "🚜" },
            { brand: "JOHN DEERE", model: "5050 D", hp: "50 HP", price: "8.10 Lakh*", logo: "/image/john-deere-1579511882.webp", image: "🚜" },
            
            // MASSEY-FERGUSON
            { brand: "MASSEY-FERGUSON", model: "380 Super DI", hp: "40 HP", price: "6.20 Lakh*", logo: "/image/massey-ferguson-1579512590.webp", image: "🚜" },
            
            // SWARAJ
            { brand: "SWARAJ", model: "855 FE", hp: "52 HP", price: "7.90 Lakh*", logo: "/image/swaraj.png", image: "🚜" },
            { brand: "SWARAJ", model: "744 XT", hp: "48 HP", price: "7.20 Lakh*", logo: "/image/swaraj.png", image: "🚜" },
            
            // SONALIKA
            { brand: "SONALIKA", model: "Tiger DI 65", hp: "65 HP", price: "10.5 Lakh*", logo: "/image/sonalika-1725262747.webp", image: "🚜" },
            
            // EICHER
            { brand: "EICHER", model: "380 Super DI", hp: "40 HP", price: "6.20 Lakh*", logo: "/image/Eicher.png", image: "🚜" },
            
            // VST
            { brand: "VST", model: "380 Super DI", hp: "40 HP", price: "6.20 Lakh*", logo: "/image/VST-logo-present-scaled.webp", image: "🚜" },
            
            // KUBOTA
            { brand: "KUBOTA", model: "380 Super DI", hp: "40 HP", price: "6.20 Lakh*", logo: "/image/Kubota-Symbol.png", image: "🚜" },
            
            // NEW-HOLLAND
            { brand: "NEW-HOLLAND", model: "380 Super DI", hp: "40 HP", price: "6.20 Lakh*", logo: "/image/New-Holland.png", image: "🚜" },
            
            // POWETRAC
            { brand: "POWETRAC", model: "380 Super DI", hp: "40 HP", price: "6.20 Lakh*", logo: "/image/powertrac-1579511958-2.webp", image: "🚜" },
            
            // PREET
            { brand: "PREET", model: "380 Super DI", hp: "40 HP", price: "6.20 Lakh*", logo: "/image/PREET.png", image: "🚜" },
            
            // SOLIS
            { brand: "SOLIS TRACTORS", model: "380 Super DI", hp: "40 HP", price: "6.20 Lakh*", logo: "/image/Solish.webp", image: "🚜" },
            
            // HINDUSTAN & OTHERS
            { brand: "HINDUSTAN", model: "380 Super DI", hp: "40 HP", price: "6.20 Lakh*", logo: "/image/hindustan.png", image: "🚜" },
            { brand: "INDO-FARM", model: "380 Super DI", hp: "40 HP", price: "6.20 Lakh*", logo: "/image/indo-farm.webp", image: "🚜" },
            { brand: "KARTAR", model: "380 Super DI", hp: "40 HP", price: "6.20 Lakh*", logo: "/image/kartar 1975.webp", image: "🚜" },
            { brand: "DEUTZ FAHR", model: "380 Super DI", hp: "40 HP", price: "6.20 Lakh*", logo: "/image/Deutz fahr.png", image: "🚜" }
        ];

        await Tractor.deleteMany({}); // Purana data saaf
        await Tractor.insertMany(fullTractorData); // Naya sara data ek sath insert
        res.send("✅ Tractor Junction ka sara data MongoDB mein load ho gaya hai!");
    } catch (error) {
        res.status(500).send("❌ Data load karne mein galti: " + error.message);
    }
});
const Dealer = require('./models/Dealer');

// 1. Saare dealers lane ke liye
app.get('/api/dealers', async (req, res) => {
    try {
        const dealers = await Dealer.find();
        res.json(dealers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Dealer ka sample data bharne ke liye (Seed)
app.get('/api/seed-dealers', async (req, res) => {
    const sampleDealers = [
        { brand: "MAHINDRA", name: "Kisan Tractor Agency", city: "Ahmedabad", state: "Gujarat", phone: "9876543210", address: "S.G. Highway, Near Petrol Pump" },
        { brand: "SWARAJ", name: "Bharat Motors", city: "Jaipur", state: "Rajasthan", phone: "9123456789", address: "Main Market Road" },
        { brand: "JOHN DEERE", name: "Green Field Dealers", city: "Ludhiana", state: "Punjab", phone: "9988776655", address: "GT Road" }
    ];
    await Dealer.deleteMany({});
    await Dealer.insertMany(sampleDealers);
    res.send("✅ Dealers data added!");
});
app.get('/api/tractors/:brandName', async (req, res) => {
    try {
        const models = await Tractor.find({ brand: req.params.brandName.toUpperCase() });
        res.json(models);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Server Start
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on: http://localhost:${PORT}`);
});