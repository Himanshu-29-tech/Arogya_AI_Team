'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RemindersPage() {
  const [medicines, setMedicines] = useState([
    { id: '1', name: 'Metformin', dosage: '500mg', schedule: { morning: true, night: true }, startDate: '2025-08-01', endDate: '2025-11-01', active: true },
    { id: '2', name: 'Atorvastatin', dosage: '20mg', schedule: { night: true }, startDate: '2025-08-01', endDate: '2025-11-01', active: true },
    { id: '3', name: 'Vitamin D3', dosage: '1000 IU', schedule: { morning: true }, startDate: '2025-08-10', endDate: '2025-09-10', active: true },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', dosage: '', morning: false, afternoon: false, night: false, startDate: '', endDate: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    const newMed = {
      id: Date.now().toString(),
      name: formData.name,
      dosage: formData.dosage,
      schedule: { morning: formData.morning, afternoon: formData.afternoon, night: formData.night },
      startDate: formData.startDate,
      endDate: formData.endDate,
      active: true
    };
    setMedicines([...medicines, newMed]);
    setShowAddModal(false);
    setFormData({ name: '', dosage: '', morning: false, afternoon: false, night: false, startDate: '', endDate: '' });
  };

  const toggleActive = (id) => {
    setMedicines(medicines.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Medicine Reminders</h1>
            <p className="text-text-muted mt-1">Never miss a dose. Track your daily adherence.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2.5 bg-accent-green text-white rounded-full font-medium hover:bg-accent-green-light transition shadow-sm"
          >
            + Add Medicine
          </button>
        </div>

        {/* Today's Schedule */}
        <div className="glass p-8 rounded-3xl mb-8">
          <h2 className="text-xl font-display font-bold text-foreground mb-6">Today's Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['morning', 'afternoon', 'night'].map(time => {
               const timeMeds = medicines.filter(m => m.active && m.schedule[time]);
               const timeEmoji = time === 'morning' ? '🌅' : time === 'afternoon' ? '☀️' : '🌙';
               return (
                 <div key={time} className="bg-white/50 border border-border-card rounded-2xl p-5">
                   <h3 className="font-bold text-foreground capitalize mb-4 flex items-center gap-2">
                     {timeEmoji} {time}
                   </h3>
                   {timeMeds.length === 0 ? (
                     <p className="text-sm text-text-muted italic">No medicines scheduled.</p>
                   ) : (
                     <ul className="space-y-3">
                       {timeMeds.map(m => (
                         <li key={m.id} className="flex items-center justify-between">
                           <div>
                             <p className="font-medium text-sm text-foreground">{m.name}</p>
                             <p className="text-xs text-text-muted">{m.dosage}</p>
                           </div>
                           <input type="checkbox" className="w-5 h-5 rounded border-border-card text-accent-green focus:ring-accent-green" />
                         </li>
                       ))}
                     </ul>
                   )}
                 </div>
               );
            })}
          </div>
        </div>

        {/* All Medicines */}
        <div className="glass p-8 rounded-3xl">
          <h2 className="text-xl font-display font-bold text-foreground mb-6">All Prescriptions</h2>
          <div className="space-y-4">
            {medicines.map(m => (
              <div key={m.id} className="bg-white/50 border border-border-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${m.active ? 'bg-accent-blue/10 text-accent-blue' : 'bg-gray-100 text-gray-400'}`}>
                    💊
                  </div>
                  <div>
                    <h3 className={`font-bold ${m.active ? 'text-foreground' : 'text-text-muted line-through'}`}>{m.name}</h3>
                    <p className="text-sm text-text-muted">{m.dosage}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex gap-2 text-xs font-medium">
                    <span className={`px-2 py-1 rounded ${m.schedule.morning ? 'bg-orange-50 text-orange-600' : 'text-gray-300'}`}>Morning</span>
                    <span className={`px-2 py-1 rounded ${m.schedule.afternoon ? 'bg-yellow-50 text-yellow-600' : 'text-gray-300'}`}>Afternoon</span>
                    <span className={`px-2 py-1 rounded ${m.schedule.night ? 'bg-indigo-50 text-indigo-600' : 'text-gray-300'}`}>Night</span>
                  </div>
                  <div className="text-xs text-text-muted text-right min-w-[100px]">
                    <p>{new Date(m.startDate).toLocaleDateString()} to</p>
                    <p>{new Date(m.endDate).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => toggleActive(m.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${m.active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                  >
                    {m.active ? 'Pause' : 'Resume'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Twilio Stub */}
        <div className="mt-8 text-center bg-green-50/50 border border-green-100 rounded-2xl p-6">
           <h3 className="font-bold text-green-800 mb-2 flex items-center justify-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              WhatsApp Reminders
           </h3>
           <p className="text-sm text-green-700 max-w-lg mx-auto">Twilio WhatsApp integration is ready to be enabled. Add your Twilio credentials to `.env.local` to receive automated messages when it's time to take your medication.</p>
        </div>

      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Add Medicine</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Medicine Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-border-card focus:border-accent-green outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Dosage (e.g., 500mg, 1 tablet)</label>
                <input required type="text" value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-border-card focus:border-accent-green outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Schedule</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.morning} onChange={e => setFormData({...formData, morning: e.target.checked})} className="w-4 h-4 text-accent-green rounded border-border-card focus:ring-accent-green" /> Morning
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.afternoon} onChange={e => setFormData({...formData, afternoon: e.target.checked})} className="w-4 h-4 text-accent-green rounded border-border-card focus:ring-accent-green" /> Afternoon
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.night} onChange={e => setFormData({...formData, night: e.target.checked})} className="w-4 h-4 text-accent-green rounded border-border-card focus:ring-accent-green" /> Night
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Start Date</label>
                  <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-border-card outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">End Date</label>
                  <input required type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-border-card outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-text-secondary hover:bg-black/5 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-medium bg-accent-green text-white hover:bg-accent-green-light transition">Save Medicine</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
