import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage } from 'react-icons/fi';
import { Order } from '../../types';
import API from '../../utils/api';
const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{id:string}>();
  const [order, setOrder] = useState<Order|null>(null);
  useEffect(() => { API.get(`/orders/${id}`).then(({data})=>setOrder(data.order)).catch(()=>{}); }, [id]);
  
  const hasPreOrder = order?.items.some(item => item.isPreOrder);
  
  return (
    <div style={{textAlign:'center',padding:'80px 20px',maxWidth:600,margin:'0 auto'}}>
      <FiCheckCircle style={{fontSize:80,color:'var(--success)',marginBottom:20}} />
      <h1 style={{fontSize:32,marginBottom:12}}>{hasPreOrder ? '📅 Pre-Order Confirmed!' : 'Order Placed Successfully!'}</h1>
      <p style={{color:'var(--gray-500)',fontSize:17,marginBottom:8}}>Thank you! A confirmation email has been sent to you.</p>
      {order && <p style={{color:'var(--primary)',fontWeight:600,fontSize:18,marginBottom:32}}>Order #{order.orderNumber}</p>}
      
      {hasPreOrder && (
        <div style={{background:'linear-gradient(135deg,#f0fdf4 0%,#e8f5e9 100%)',border:'2px solid #4caf50',borderRadius:12,padding:20,marginBottom:32,textAlign:'left'}}>
          <p style={{fontWeight:700,color:'#2e7d32',marginBottom:8,fontSize:16}}>✓ Pre-Order Confirmation Details</p>
          <ul style={{marginLeft:20,fontSize:14,color:'#333',lineHeight:'1.8'}}>
            <li>Your pre-order has been received and confirmed</li>
            <li>We will notify you by email and SMS when the item is in stock</li>
            <li>Expected delivery: Within 2-3 weeks</li>
            <li>No charge until the item ships (for COD orders)</li>
            <li>You can track your order status anytime below</li>
          </ul>
        </div>
      )}
      
      <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
        <Link to="/orders" className="btn btn-primary btn-lg"><FiPackage /> Track Order</Link>
        <Link to="/products" className="btn btn-outline btn-lg">Continue Shopping</Link>
      </div>
    </div>
  );
};
export default OrderSuccessPage;
