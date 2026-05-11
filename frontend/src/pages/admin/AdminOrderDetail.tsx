import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiTruck, FiX } from 'react-icons/fi';
import API from '../../utils/api';
import toast from 'react-hot-toast';

const statusFlow = ['pending','confirmed','processing','shipped','delivered'];
const statusColors = { pending:'warning', confirmed:'info', processing:'primary', shipped:'info', delivered:'success', cancelled:'danger' };

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then(({ data }) => { setOrder(data.order); setNewStatus(data.order.orderStatus); })
      .catch(() => navigate('/admin/orders'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleUpdateStatus = async () => {
    if (newStatus === order.orderStatus) return toast.error('Please select a different status');
    setUpdating(true);
    try {
      const { data } = await API.put(`/orders/${id}/status`, { status: newStatus, note, trackingNumber });
      setOrder(data.order);
      toast.success(`Order status updated to "${newStatus}"`);
      setNote('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Update failed';
      const stockAlert = err.response?.data?.alert;
      
      // Pre-order stock issue alert
      if (err.response?.data?.details) {
        const details = err.response.data.details;
        let alertText = 'স্টক অপর্যাপ্ত!\n\n';
        details.forEach((item: any) => {
          alertText += `${item.product}:\n  প্রয়োজন: ${item.required}টি\n  আছে: ${item.available}টি\n  ঘাটতি: ${item.shortage}টি\n\n`;
        });
        toast.error(alertText, { duration: 5000, style: { whiteSpace: 'pre-wrap' } });
      } else {
        toast.error(errorMessage);
      }
    }
    finally { setUpdating(false); }
  };

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;
  if (!order) return null;

  const currentStep = statusFlow.indexOf(order.orderStatus);

  return (
    <div>
      <button className="btn btn-outline btn-sm" style={{ marginBottom:20 }} onClick={() => navigate('/admin/orders')}>
        <FiArrowLeft /> Back to Orders
      </button>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700 }}>Order #{order.orderNumber}</h1>
          <p style={{ color:'var(--gray-500)', fontSize:13 }}>{new Date(order.createdAt).toLocaleString('en-BD')}</p>
        </div>
        <span className={`badge badge-${statusColors[order.orderStatus]||'primary'}`} style={{ fontSize:15, padding:'8px 20px', textTransform:'capitalize' }}>
          {order.orderStatus}
        </span>
      </div>

      {/* Progress bar */}
      {order.orderStatus !== 'cancelled' && (
        <div className="card card-body" style={{ marginBottom:20 }}>
          <h4 style={{ marginBottom:20 }}>Order Progress</h4>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative' }}>
            <div style={{ position:'absolute', top:18, left:'10%', right:'10%', height:3, background:'var(--gray-200)', zIndex:0 }}>
              <div style={{ width: `${Math.max(0, currentStep / (statusFlow.length-1)) * 100}%`, height:'100%', background:'var(--primary)', transition:'width 0.5s' }} />
            </div>
            {statusFlow.map((s, i) => (
              <div key={s} style={{ textAlign:'center', zIndex:1, flex:1 }}>
                <div style={{
                  width:38, height:38, borderRadius:'50%', margin:'0 auto 8px',
                  background: i <= currentStep ? 'var(--primary)' : 'white',
                  border: `3px solid ${i <= currentStep ? 'var(--primary)' : 'var(--gray-200)'}`,
                  display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:14
                }}>
                  {i < currentStep ? <FiCheck /> : i === currentStep ? '●' : i+1}
                </div>
                <span style={{ fontSize:12, fontWeight:i<=currentStep?600:400, color: i<=currentStep?'var(--primary)':'var(--gray-400)', textTransform:'capitalize' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-2" style={{ marginBottom:20 }}>
        {/* PRE-ORDER INFO & STOCK VALIDATION */}
        {(order.isPreOrder || order.items?.some(i => i.isPreOrder)) && (
          <div className="card card-body" style={{ gridColumn:'1 / -1', background:'linear-gradient(135deg,#fff3e0 0%,#ffe8b6 100%)', border:'2px solid #ff9800' }}>
            <h3 style={{ marginBottom:12, color:'#e65100', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:20 }}>📅</span> Pre-Order Stock Management
            </h3>
            <div style={{ background:'white', padding:12, borderRadius:8, marginBottom:12 }}>
              <p style={{ fontWeight:600, marginBottom:8, color:'#333' }}>📋 Status Change Requirements:</p>
              <ul style={{ marginLeft:20, fontSize:13, lineHeight:'1.6', color:'#555' }}>
                <li><strong>To "confirmed":</strong> ✓ Order will be confirmed (Stock check: Warning only)</li>
                <li><strong>To "processing":</strong> ✓ Preparing for shipment (Stock check: Warning only)</li>
                <li><strong>To "shipped":</strong> ⚠️ <strong style={{color:'#dc3545'}}>REQUIRES Stock Available</strong> - Will block if insufficient</li>
                <li><strong>To "delivered":</strong> ⚠️ <strong style={{color:'#dc3545'}}>REQUIRES Stock Available</strong> - Will block if insufficient</li>
              </ul>
            </div>
            <div style={{ background:'#ffebee', padding:12, borderRadius:8, border:'1px solid #ffcdd2' }}>
              <p style={{ color:'#c2185b', fontWeight:600, marginBottom:8 }}>📦 Pre-Order Items Requiring Stock:</p>
              {order.items?.filter(i => i.isPreOrder).map((item, i) => (
                <div key={i} style={{ fontSize:13, marginBottom:6, color:'#555', display:'flex', justifyContent:'space-between' }}>
                  <strong>• {item.name}</strong> - <span>Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Update Status */}
        {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
          <div className="card card-body">
            <h3 style={{ marginBottom:16 }}>Update Order Status</h3>
            <div className="form-group">
              <label className="form-label">New Status</label>
              <select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                {statusFlow.map(s => <option key={s} value={s} style={{ textTransform:'capitalize' }}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            {newStatus === 'shipped' && (
              <div className="form-group">
                <label className="form-label">Tracking Number</label>
                <input className="form-control" placeholder="e.g. SZ123456BD" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Note (optional)</label>
              <textarea className="form-control" rows={2} placeholder="Internal note..." value={note} onChange={e => setNote(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={handleUpdateStatus} disabled={updating}>
              {updating ? 'Updating...' : <><FiCheck /> Update Status</>}
            </button>
            {newStatus === 'confirmed' && (
              <p style={{ fontSize:12, color:'var(--primary)', marginTop:8 }}>
                ✓ Customer will receive a confirmation email.
              </p>
            )}
            {newStatus === 'processing' && (
              <p style={{ fontSize:12, color:'var(--primary)', marginTop:8 }}>
                Customer will receive an approval email automatically.
              </p>
            )}
            {newStatus === 'shipped' && (
              <p style={{ fontSize:12, color:'var(--primary)', marginTop:8 }}>
                Customer will receive a shipping notification email with tracking.
              </p>
            )}
            {newStatus === 'delivered' && (
              <p style={{ fontSize:12, color:'var(--primary)', marginTop:8 }}>
                ✓ Customer will receive a delivery confirmation email.
              </p>
            )}
            {newStatus === 'cancelled' && (
              <p style={{ fontSize:12, color:'#dc3545', marginTop:8 }}>
                ⚠️ Customer will be notified and refund will be initiated.
              </p>
            )}
          </div>
        )}

        {/* Customer & Shipping */}
        <div className="card card-body">
          <h3 style={{ marginBottom:16 }}>Customer & Shipping Info</h3>
          <div style={{ marginBottom:12 }}>
            <p style={{ fontWeight:600 }}>{order.user?.name}</p>
            <p style={{ fontSize:13, color:'var(--gray-500)' }}>{order.user?.email}</p>
            <p style={{ fontSize:13, color:'var(--gray-500)' }}>{order.user?.phone}</p>
          </div>
          <hr style={{ borderColor:'var(--gray-100)', margin:'12px 0' }} />
          <p style={{ fontSize:13, fontWeight:600 }}>Shipping Address:</p>
          <p style={{ fontSize:13, color:'var(--gray-600)', marginTop:4 }}>
            {order.shippingAddress.name}<br />
            {order.shippingAddress.phone}<br />
            {order.shippingAddress.street}, {order.shippingAddress.city}<br />
            {order.shippingAddress.state && `${order.shippingAddress.state}, `}{order.shippingAddress.country}
          </p>
          {order.note && (
            <>
              <hr style={{ borderColor:'var(--gray-100)', margin:'12px 0' }} />
              <p style={{ fontSize:13 }}><strong>Customer Note:</strong> {order.note}</p>
            </>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="card card-body" style={{ marginBottom:20 }}>
        <h3 style={{ marginBottom:16 }}>Ordered Items</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th>Type</th></tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <img src={item.image||'https://via.placeholder.com/50'} alt={item.name} style={{ width:50, height:50, objectFit:'cover', borderRadius:8 }} />
                    <div>
                      <p style={{ fontWeight:600, fontSize:14 }}>{item.name}</p>
                      {item.size && <p style={{ fontSize:12, color:'var(--gray-500)' }}>Size: {item.size}</p>}
                      {item.color && <p style={{ fontSize:12, color:'var(--gray-500)' }}>Color: {item.color}</p>}
                    </div>
                  </td>
                  <td>BDT{item.price.toLocaleString()}</td>
                  <td>{item.quantity}</td>
                  <td style={{ fontWeight:700 }}>BDT{(item.price*item.quantity).toLocaleString()}</td>
                  <td>{item.isPreOrder ? <span className="badge badge-primary">Pre-Order</span> : <span className="badge badge-success">Regular</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ borderTop:'2px solid var(--gray-100)', marginTop:16, paddingTop:16 }}>
          {[
            { label:'Subtotal', val:`BDT${order.itemsPrice.toLocaleString()}` },
            { label:'Shipping', val: order.shippingPrice===0 ? 'FREE' : `BDT${order.shippingPrice}` },
            order.discountAmount>0 && { label:'Discount', val:`-BDT${order.discountAmount.toLocaleString()}` },
          ].filter(Boolean).map((row,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:14, marginBottom:8, color:'var(--gray-600)' }}>
              <span>{row.label}</span><span>{row.val}</span>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:18, paddingTop:8, borderTop:'1px solid var(--gray-100)' }}>
            <span>Total</span><span>BDT{order.totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Status History */}
      {order.statusHistory?.length > 0 && (
        <div className="card card-body">
          <h3 style={{ marginBottom:16 }}>Status History</h3>
          {[...order.statusHistory].reverse().map((h, i) => (
            <div key={i} style={{ display:'flex', gap:16, padding:'10px 0', borderBottom:'1px solid var(--gray-100)' }}>
              <span className={`badge badge-${statusColors[h.status]||'primary'}`} style={{ textTransform:'capitalize', flexShrink:0 }}>{h.status}</span>
              <span style={{ fontSize:13, color:'var(--gray-600)', flex:1 }}>{h.note}</span>
              <span style={{ fontSize:12, color:'var(--gray-400)', flexShrink:0 }}>{new Date(h.updatedAt).toLocaleString('en-BD')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrderDetail;
