const mongoose = require('mongoose');

const tractorSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    hp: String,
    price: String,
    logo: String,  // Image ka path
    image: String  // Tractor photo ka path
});

module.exports = mongoose.model('Tractor', tractorSchema);