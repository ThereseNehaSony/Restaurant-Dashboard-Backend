const Order = require('../models/Order')


const orderController = {

 getNextOrderId : async () => {
    const lastOrder = await Order.findOne().sort({ orderId: -1 });
    return lastOrder ? lastOrder.orderId + 1 : 1000; 
  },
  
  addOrder : async (req, res) => {
    console.log("ennn");
    
    try {
    const {  customerName, productName, price, quantity, location } = req.body;

    const orderId = await orderController.getNextOrderId();

    const order = new Order({
      orderId, 
      customerName,
      product:productName,
      price,
      quantity,
      location,
    });

    await order.save();
    return res.status(201).json({ message: 'Order added successfully', order });
  } catch (error) {
    console.error('Error adding order:', error); 
    return res.status(500).json({ message: 'Failed to add order', error });
  }
},

getOrders: async(req,res)=>{
  try {
    const orders = await Order.find()
    res.json(orders)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch orders', error });
  }
},

editOrder: async (req, res) => {
  try {
    const { orderId } = req.params; 
    const { customerName, productName, price, quantity, location,status } = req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      { customerName, product: productName, price, quantity, location ,status},
      { new: true, runValidators: true } 
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ message: 'Order updated successfully', updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ message: 'Failed to update order', error });
  }
},

deleteOrder: async (req, res) => {
  try {
    const { orderId } = req.params; 
    
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }
    
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ message: 'Order deleted successfully', deletedOrder });
  } catch (error) {
    console.error('Error deleting order:', error);
    return res.status(500).json({ message: 'Failed to delete order', error });
  }
},

}

module.exports= orderController