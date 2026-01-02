const mongoose = require('mongoose');

const tractorSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  logo: { type: String, required: true },
  website: { type: String }, // Official website ke liye
  model: { type: String },   // Ab ye required nahi hai
  hp: { type: String },      // Ab ye required nahi hai
  price: { type: String },   // Ab ye required nahi hai
  image: { type: String, default: "🚜" }
});

module.exports = mongoose.model('Tractor', tractorSchema);
