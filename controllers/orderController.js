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

revenue: async (req, res) => {
  const { year1, year2 } = req.query;
  
  const year1StartDate = new Date(`${year1}-01-01`);
  const year1EndDate = new Date(`${year1}-12-31`);
  console.log(year1StartDate, year1EndDate, "Year 1 Date Range");

  const year2StartDate = new Date(`${year2}-01-01`);
  const year2EndDate = new Date(`${year2}-12-31`);
  console.log(year2StartDate, year2EndDate, "Year 2 Date Range");

  try {
    
    const year1Revenue = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: year1StartDate,
            $lte: year1EndDate,
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          totalRevenue: { $sum: '$price' },
        },
      },
      {
        $sort: { '_id.month': 1 },
      },
    ]);
    console.log(year1Revenue, "Year 1 Revenue");

  
    const year2Revenue = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: year2StartDate,
            $lte: year2EndDate,
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          totalRevenue: { $sum: '$price' },
        },
      },
      {
        $sort: { '_id.month': 1 },
      },
    ]);
    console.log(year2Revenue, "Year 2 Revenue");

    res.json({
      year1Data: year1Revenue.length > 0 ? year1Revenue : [],
      year2Data: year2Revenue.length > 0 ? year2Revenue : [],
    });
    
  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
},

weeklyRevenue:async (req, res) => {
  try {
    const startOfWeek = new Date(); 
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);

    const endOfWeek = new Date(); 
    endOfWeek.setDate(endOfWeek.getDate() - startOfWeek.getDay() + 7);

    const orderCounts = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' }, 
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id': 1 }, 
      },
    ]);

    const counts = Array(7).fill(0); 
    orderCounts.forEach(item => {
      counts[item._id - 1] = item.count; 
    });

    res.json({ orderCounts: counts });
  } catch (error) {
    console.error("Error fetching weekly orders:", error);
    res.status(500).json({ error: 'Failed to fetch weekly orders' });
  }
}

}

module.exports= orderController