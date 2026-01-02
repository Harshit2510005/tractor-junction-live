const mongoose = require('mongoose');

const tractorSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  logo: { type: String, required: true },
  website: { type: String }, 
  model: { type: String },   
  hp: { type: String },      
  price: { type: String },   
  image: { type: String, default: "🚜" }
});

module.exports = mongoose.model('Tractor', tractorSchema);
