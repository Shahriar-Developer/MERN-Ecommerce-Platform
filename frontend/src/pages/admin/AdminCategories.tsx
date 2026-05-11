import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { Category } from '../../types';

// Initial form state
const emptyForm = { 
  name: '', 
  description: '', 
  parent: '', 
  discount: 0 as number, // Force number type
  isActive: true 
};

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try { 
      const { data } = await API.get('/categories'); 
      setCategories(data.categories); 
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleEdit = (cat: Category) => {
    setEditId(cat._id);
    setForm({ 
      name: cat.name, 
      description: cat.description || '', 
      parent: cat.parent?._id || '', 
      discount: Number(cat.discount) || 0, // Ensure it's a number
      isActive: cat.isActive 
    });
    setShowForm(true);
  };

  const set = (field: string, val: any) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setSaving(true);
    try {
      // Data pathanor age cleaning
      const payload = {
        ...form,
        parent: form.parent === "" ? null : form.parent,
        discount: Number(form.discount) || 0 // String-ke Number-e convert kora hoyeche
      };

      if (editId) { 
        await API.put(`/categories/${editId}`, payload); 
        toast.success('Category updated!'); 
      } else { 
        await API.post('/categories', payload); 
        toast.success('Category created!'); 
      }
      
      setShowForm(false); 
      setEditId(null); 
      setForm(emptyForm); 
      fetch();
    } catch (err: any) { 
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save category'); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await API.delete(`/categories/${id}`);
      toast.success('Deleted!');
      fetch();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:700 }}>Categories</h1>
        <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}>
          <FiPlus /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="card card-body" style={{ marginBottom:24 }}>
          <h3>{editId ? 'Edit' : 'Create'} Category</h3>
          <form onSubmit={handleSubmit} style={{ marginTop:16 }}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Discount % (Numbers only)</label>
                <input 
                  className="form-control" 
                  type="number" 
                  value={form.discount} 
                  onChange={e => set('discount', Number(e.target.value))} // Type Fix ekhane
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Parent Category</label>
              <select className="form-control" value={form.parent} onChange={e => set('parent', e.target.value)}>
                <option value="">None (Top Level)</option>
                {categories.filter(c => c._id !== editId).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:10 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}><FiSave /> {saving ? 'Saving...' : 'Save'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}><FiX /> Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Parent</th>
              <th>Discount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c._id}>
                <td><strong>{c.name}</strong></td>
                <td>{c.parent?.name || '—'}</td>
                <td>{c.discount}%</td>
                <td>
                  <button className="btn btn-sm btn-outline" onClick={() => handleEdit(c)}><FiEdit2 /></button>
                  <button className="btn btn-sm btn-danger" style={{ marginLeft:8 }} onClick={() => handleDelete(c._id, c.name)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;