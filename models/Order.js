const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  product: 
    {
      type: String,
      required: true,
    },
  quantity: 
    {
      type: String,
      required: true,
    },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Delivered'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  orderId: {
     type: Number,
     unique: true },
  location: 
  {
    type: String,
    required: true,
  },
});

 const Order = mongoose.model('Order', orderSchema);
 module.exports = Order;