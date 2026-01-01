const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
    brand: { type: String, required: true }, // Kis brand ka dealer hai
    name: { type: String, required: true },  // Agency ka naam
    city: String,
    state: String,
    phone: String,
    address: String
});

module.exports = mongoose.model('Dealer', dealerSchema);