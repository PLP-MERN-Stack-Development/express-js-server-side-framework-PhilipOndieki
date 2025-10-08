 const mongoose = require('mongoose')


// Define Schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120,index: true },
    description: { type: String, trim: true, maxlength: 1024, default: '', },
    price: { type: Number, required: true, min: 0, index: true, },
    category: { type: String, required: true, trim: true, lowercase: true,index: true, },
    inStock: { type: Boolean, default: true, index: true, },
  },{ timestamps: true });

// Creates a text index on both name and description.
productSchema.index({ name: 'text', description: 'text' });

// create the model
const Product = mongoose.model('Product', productSchema);

// Makes the model available for use in other files via require('./product')
module.exports = Product;


