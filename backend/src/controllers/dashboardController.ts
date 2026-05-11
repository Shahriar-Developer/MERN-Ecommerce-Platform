import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';

export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalOrders, totalUsers, totalProducts, revenueAgg, recentOrders, ordersByStatus, lowStockProducts, topProducts] = await Promise.all([
      Order.countDocuments(), User.countDocuments({ role: 'user' }), Product.countDocuments({ isActive: true }),
      Order.aggregate([{ $match: { orderStatus: { $nin: ['cancelled', 'returned'] } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(10),
      Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
      Product.find({ stock: { $lte: 5 }, isActive: true }).select('name stock images').limit(10),
      Order.aggregate([{ $unwind: '$items' }, { $group: { _id: '$items.product', name: { $first: '$items.name' }, totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }, { $sort: { totalSold: -1 } }, { $limit: 5 }]),
    ]);
    const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Order.aggregate([{ $match: { createdAt: { $gte: sixMonthsAgo }, orderStatus: { $nin: ['cancelled', 'returned'] } } }, { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } }, { $sort: { '_id.year': 1, '_id.month': 1 } }]);
    res.json({ success: true, stats: { totalOrders, totalUsers, totalProducts, totalRevenue: revenueAgg[0]?.total || 0 }, recentOrders, ordersByStatus, monthlyRevenue, lowStockProducts, topProducts });
  } catch (error) { res.status(500).json({ success: false, message: (error as Error).message }); }
};

export const getPreOrderStatus = async (_req: Request, res: Response): Promise<void> => {
  try {
    // সব pre-order products
    const preOrderProducts = await Product.find({ isPreOrder: true, isActive: true })
      .select('name slug stock reservedQuantity')
      .sort({ reservedQuantity: -1 });
    
    const preOrderData = await Promise.all(preOrderProducts.map(async (product) => {
      // এই প্রোডাক্টের pre-order order গুলি
      const preOrders = await Order.find({ 
        'items.product': product._id, 
        'items.isPreOrder': true,
        orderStatus: { $nin: ['delivered', 'cancelled'] }
      }).select('items quantity orderNumber');
      
      const totalReserved = preOrders.reduce((sum, order) => {
        const item = order.items.find(i => i.product.toString() === product._id.toString());
        return sum + (item?.quantity || 0);
      }, 0);
      
      return {
        productId: product._id,
        productName: product.name,
        slug: product.slug,
        currentStock: product.stock,
        reservedQuantity: product.reservedQuantity,
        totalReserved,
        shortage: Math.max(0, totalReserved - product.stock),
        canDeliver: product.stock >= totalReserved,
        preOrderCount: preOrders.length,
        status: product.stock >= totalReserved ? 'ready' : 'pending'
      };
    }));
    
    res.json({ 
      success: true, 
      preOrderProducts: preOrderData,
      summary: {
        totalPreOrderProducts: preOrderData.length,
        readyForDelivery: preOrderData.filter(p => p.canDeliver).length,
        waitingForStock: preOrderData.filter(p => !p.canDeliver).length,
        totalShortage: preOrderData.reduce((sum, p) => sum + p.shortage, 0)
      }
    });
  } catch (error) { res.status(500).json({ success: false, message: (error as Error).message }); }
};
