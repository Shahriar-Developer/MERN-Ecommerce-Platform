import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiX, FiMoreVertical } from 'react-icons/fi';
import { Order } from '../../types';
import API from '../../utils/api';
import toast from 'react-hot-toast';
const statusColors: Record<string,string> = { pending:'warning',confirmed:'info',processing:'primary',shipped:'info',delivered:'success',cancelled:'danger' };
const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string|null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState<string|null>(null);
  const [cancelReason, setCancelReason] = useState('');
  
  useEffect(() => { 
    API.get('/orders/my-orders').then(({data})=>setOrders(data.orders)).catch(()=>{}).finally(()=>setLoading(false)); 
  }, []);
  
  const handleCancelOrder = async (orderId: string) => {
    if (!cancelReason.trim()) { toast.error('Please provide a reason'); return; }
    setCancellingId(orderId);
    try { 
      const {data} = await API.put(`/orders/${orderId}/cancel`, {reason: cancelReason}); 
      setOrders(orders.map(o => o._id === orderId ? data.order : o)); 
      toast.success('Order cancelled'); 
      setShowCancelDialog(null); 
      setCancelReason(''); 
    }
    catch (err:unknown) { 
      toast.error((err as {response?:{data?:{message?:string}}}).response?.data?.message||'Failed to cancel'); 
    }
    finally { setCancellingId(null); }
  };
  
  if (loading) return <div className="page-loader"><div className="spinner"/></div>;
  return (
    <div style={{padding:'40px 0 60px'}}><div className="container">
      <h1 style={{marginBottom:28}}>My Orders</h1>
      {orders.length===0 ? (
        <div className="empty-state"><div style={{fontSize:64}}></div><h3>No orders yet</h3><p>You haven't placed any orders yet</p><Link to="/products" className="btn btn-primary mt-2">Start Shopping</Link></div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {orders.map(o=>(
            <div key={o._id} className="card card-body" style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
              <div><p style={{fontWeight:700,fontSize:16}}>#{o.orderNumber}</p><p style={{fontSize:13,color:'var(--gray-500)'}}>{new Date(o.createdAt).toLocaleDateString('en-BD')} • {o.items.length} item(s)</p></div>
              <span className={`badge badge-${statusColors[o.orderStatus]||'primary'}`} style={{textTransform:'capitalize'}}>{o.orderStatus}</span>
              <div style={{fontWeight:700,fontSize:17}}>BDT{o.totalPrice.toLocaleString()}</div>
              <div style={{display:'flex',gap:8}}>
                <Link to={`/orders/${o._id}`} className="btn btn-outline btn-sm"><FiEye /> Details</Link>
                {['pending','confirmed'].includes(o.orderStatus) && (
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => setShowCancelDialog(o._id)}
                    disabled={cancellingId === o._id}
                  >
                    <FiX /> Cancel
                  </button>
                )}
              </div>
              
              {showCancelDialog === o._id && (
                <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
                  <div style={{background:'white',borderRadius:12,padding:32,maxWidth:400,width:'90%',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
                    <h2 style={{fontSize:20,fontWeight:700,marginBottom:16}}>Cancel Order #{o.orderNumber}?</h2>
                    <p style={{color:'#666',marginBottom:20}}>Please provide a reason:</p>
                    <textarea
                      value={cancelReason}
                      onChange={(e)=>setCancelReason(e.target.value)}
                      placeholder="e.g., Changed my mind, Found better price..."
                      style={{width:'100%',padding:12,border:'2px solid #e0e0e0',borderRadius:8,fontSize:14,fontFamily:'inherit',marginBottom:20,minHeight:100,resize:'vertical'}}
                    />
                    <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
                      <button className="btn btn-outline btn-sm" onClick={()=>{setShowCancelDialog(null);setCancelReason('');}}>Close</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancelOrder(o._id)} disabled={cancellingId === o._id || !cancelReason.trim()}>
                        {cancellingId === o._id ? 'Cancelling...' : 'Confirm Cancel'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div></div>
  );
};
export default OrdersPage;
