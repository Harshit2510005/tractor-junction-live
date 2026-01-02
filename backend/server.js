const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Tractor = require('./models/Tractor'); 
const Dealer = require('./models/Dealer');
const User = require('./models/User'); 

const app = express();

// 1. CORS Fix: Vercel aur Render ka connection jodne ke liye
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

// 2. MongoDB Connection
mongoose.connect('mongodb+srv://HK:Harshit2510@cluster0.mhompz4.mongodb.net/tractorJunction')
    .then(() => console.log("✅ Cloud MongoDB Connected!"))
    .catch(err => console.log("❌ Connection Error:", err));

// 3. Home Route
app.get('/', (req, res) => {
    res.send("<h1>🚀 Tractor Junction Backend Chalu Hai!</h1>");
});

// 4. Register API (Naya Account banane ke liye)
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email pehle se register hai!" });

    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: "Registration Safal! Ab Login karein." });
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// 5. Login API (Sign In karne ke liye)
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

// Baaki APIs (Tractors aur Dealers)
app.get('/api/tractors', async (req, res) => {
    try {
        const data = await Tractor.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/dealers', async (req, res) => {
    try {
        const dealers = await Dealer.find();
        res.json(dealers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
});
