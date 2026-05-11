import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiX, FiCheckCircle, FiClock } from 'react-icons/fi';
import { Order } from '../../types';
import API from '../../utils/api';
import toast from 'react-hot-toast';
const statusColors: Record<string,string> = { pending:'warning',confirmed:'info',processing:'primary',shipped:'info',delivered:'success',cancelled:'danger' };
const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{id:string}>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order|null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);
  
  useEffect(() => { 
    const fetchOrder = () => API.get(`/orders/${id}`).then(({data})=>{setOrder(data.order); setLoading(false);}).catch(()=>navigate('/orders'));
    fetchOrder();
    // Real-time polling every 5 seconds
    const interval = setInterval(fetchOrder, 5000);
    setPollInterval(interval);
    return () => clearInterval(interval);
  }, [id,navigate]);
  
  const handleCancelClick = () => setShowCancelDialog(true);
  
  const handleCancel = async () => {
    if (!cancelReason.trim()) { toast.error('Please provide a reason'); return; }
    setCancelling(true);
    try { 
      const {data} = await API.put(`/orders/${id}/cancel`, {reason: cancelReason}); 
      setOrder(data.order); 
      toast.success('Order cancelled'); 
      setShowCancelDialog(false); 
      setCancelReason(''); 
    }
    catch (err:unknown) { 
      toast.error((err as {response?:{data?:{message?:string}}}).response?.data?.message||'Failed'); 
    }
    finally { setCancelling(false); }
  };
  if (loading) return <div className="page-loader"><div className="spinner"/></div>;
  if (!order) return null;
  return (
    <div style={{padding:'40px 0 60px'}}><div className="container" style={{maxWidth:800}}>
      <button className="btn btn-outline btn-sm" style={{marginBottom:24}} onClick={()=>navigate('/orders')}><FiArrowLeft/> Back</button>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
        <div><h1 style={{fontSize:24,fontWeight:700}}>Order #{order.orderNumber}</h1><p style={{color:'var(--gray-500)',fontSize:13}}>{new Date(order.createdAt).toLocaleString('en-BD')}</p></div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <span className={`badge badge-${statusColors[order.orderStatus]||'primary'}`} style={{fontSize:14,padding:'6px 16px',textTransform:'capitalize'}}>{order.orderStatus}</span>
          {['pending','confirmed'].includes(order.orderStatus)&&<button className="btn btn-danger btn-sm" onClick={handleCancelClick} disabled={cancelling}><FiX/> {cancelling?'Cancelling...':'Cancel Order'}</button>}
        </div>
      </div>
      
      {/* ORDER STATUS TRACKER */}
      <div className="card card-body" style={{marginBottom:20,background:order.orderStatus==='cancelled'?'linear-gradient(135deg,#fdf4f4 0%,#ffe8e8 100%)':'linear-gradient(135deg,#f0fdf4 0%,#e8f5e9 100%)',border:order.orderStatus==='cancelled'?'1px solid #ffccd5':'1px solid #c8e6c9'}}>
        <h3 style={{marginBottom:20,color:order.orderStatus==='cancelled'?'#c2185b':'#1b5e20'}}>Order Timeline</h3>
        <div style={{display:'flex',justifyContent:'space-between',position:'relative',paddingBottom:30}}>
          <div style={{position:'absolute',top:24,left:0,right:0,height:2,background:order.orderStatus==='cancelled'?'#ffccd5':'#c8e6c9'}}/>
          {statusSteps.map((step,idx)=>{
            const currentStatusIdx = statusSteps.indexOf(order.orderStatus);
            const isCompleted = currentStatusIdx > idx;
            const isCurrent = order.orderStatus === step;
            return (
              <div key={step} style={{display:'flex',flexDirection:'column',alignItems:'center',flex:1,position:'relative',zIndex:1,opacity:order.orderStatus==='cancelled' && order.orderStatus !== step?0.4:1}}>
                <div style={{width:48,height:48,borderRadius:'50%',background:isCompleted?'#2e7d32':isCurrent?'#ff6b6b':'#e0e0e0',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,marginBottom:8,boxShadow:isCurrent?'0 4px 12px rgba(255,107,107,0.3)':'0 2px 8px rgba(0,0,0,0.1)'}}>
                  {isCompleted?<FiCheckCircle/>:<FiClock/>}
                </div>
                <p style={{fontSize:13,fontWeight:600,textTransform:'capitalize',color:isCompleted?'#1b5e20':isCurrent?'#c2185b':'#666'}}>{step}</p>
              </div>
            );
          })}
        </div>
        {order.orderStatus === 'cancelled' && (
          <div style={{marginTop:20,padding:16,background:'#ffebee',borderRadius:8,border:'2px solid #ffccd5',textAlign:'center'}}>
            <p style={{fontWeight:700,color:'#c2185b',marginBottom:4}}>❌ Order Cancelled</p>
            <p style={{fontSize:13,color:'#d32f2f'}}>{order.cancelReason || 'No reason provided'}</p>
            {order.cancelledAt && <p style={{fontSize:12,color:'#666',marginTop:8}}>Cancelled on: {new Date(order.cancelledAt).toLocaleString('en-BD')}</p>}
          </div>
        )}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div style={{marginTop:20,paddingTop:20,borderTop:'1px solid #c8e6c9'}}>
            <p style={{fontSize:13,fontWeight:600,marginBottom:12,color:'#1b5e20'}}>Status Updates:</p>
            {order.statusHistory.map((history,idx)=>(
              <div key={idx} style={{fontSize:13,marginBottom:8,color:'#555'}}>
                <span style={{fontWeight:600,color:'#1b5e20',textTransform:'capitalize'}}>{history.status}</span> - {new Date(history.updatedAt).toLocaleString('en-BD')} {history.note && <span style={{color:'#666'}}>({history.note})</span>}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* CANCEL DIALOG */}
      {showCancelDialog && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'white',borderRadius:12,padding:32,maxWidth:400,width:'90%',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
            <h2 style={{fontSize:20,fontWeight:700,marginBottom:16}}>Cancel Order?</h2>
            <p style={{color:'#666',marginBottom:20}}>Please provide a reason for cancellation:</p>
            <textarea
              value={cancelReason}
              onChange={(e)=>setCancelReason(e.target.value)}
              placeholder="e.g., Changed my mind, Found better price, Don't need it anymore..."
              style={{width:'100%',padding:12,border:'2px solid #e0e0e0',borderRadius:8,fontSize:14,fontFamily:'inherit',marginBottom:20,minHeight:100,resize:'vertical'}}
            />
            <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
              <button className="btn btn-outline btn-sm" onClick={()=>{setShowCancelDialog(false);setCancelReason('');}}>Close</button>
              <button className="btn btn-danger btn-sm" onClick={handleCancel} disabled={cancelling || !cancelReason.trim()}>
                {cancelling?'Cancelling...':'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="card card-body" style={{marginBottom:20}}>
        <h3 style={{marginBottom:16}}>Items</h3>
        {order.items.map((item,i)=>(
          <div key={i} style={{display:'flex',gap:16,alignItems:'center',padding:'12px 0',borderBottom:'1px solid var(--gray-100)'}}>
            <img src={item.image||'https://placehold.co/70'} alt={item.name} style={{width:70,height:70,objectFit:'cover',borderRadius:8}}/>
            <div style={{flex:1}}><p style={{fontWeight:600}}>{item.name}</p>{item.size&&<p style={{fontSize:13,color:'var(--gray-500)'}}>Size: {item.size}</p>}<p style={{fontSize:13,color:'var(--gray-500)'}}>Qty: {item.quantity}</p></div>
            <p style={{fontWeight:700}}>BDT{(item.price*item.quantity).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-2">
        <div className="card card-body">
          <h4 style={{marginBottom:12}}>Shipping Address</h4>
          <p style={{fontWeight:600}}>{order.shippingAddress.name}</p>
          <p style={{fontSize:14,color:'var(--gray-600)'}}>{order.shippingAddress.phone}</p>
          <p style={{fontSize:14,color:'var(--gray-600)'}}>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
        </div>
        <div className="card card-body">
          <h4 style={{marginBottom:12}}>Payment</h4>
          <p style={{fontSize:14}}>Method: <strong>{order.paymentMethod}</strong></p>
          <hr style={{margin:'12px 0',borderColor:'var(--gray-100)'}}/>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:14,marginBottom:6}}><span>Subtotal</span><span>BDT{order.itemsPrice.toLocaleString()}</span></div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:14,marginBottom:6}}><span>Shipping</span><span>{order.shippingPrice===0?'FREE':`BDT${order.shippingPrice}`}</span></div>
          <div style={{display:'flex',justifyContent:'space-between',fontWeight:700,fontSize:17,paddingTop:8,borderTop:'2px solid var(--gray-100)'}}><span>Total</span><span>BDT{order.totalPrice.toLocaleString()}</span></div>
        </div>
      </div>
    </div></div>
  );
};
export default OrderDetailPage;
