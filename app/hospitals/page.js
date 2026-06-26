'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MOCK_HOSPITALS = [
  { id: 1, name: 'Apollo Spectra Hospital', type: 'Private', distance: '1.2 km', rating: 4.5, open: true, phone: '+91 80 4356 0000', lat: 12.9716, lng: 77.5946, emergency: true, hours: '24x7' },
  { id: 2, name: 'Fortis La Femme', type: 'Private', distance: '2.5 km', rating: 4.8, open: true, phone: '+91 80 2345 6789', lat: 12.9800, lng: 77.6000, emergency: false, hours: '08:00 - 22:00' },
  { id: 3, name: 'General Government Hospital', type: 'Government', distance: '3.8 km', rating: 3.9, open: true, phone: '104', lat: 12.9650, lng: 77.5800, emergency: true, hours: '24x7' },
  { id: 4, name: 'Sanjeevani Clinic', type: 'Clinic', distance: '0.8 km', rating: 4.2, open: false, phone: '+91 98765 43210', lat: 12.9750, lng: 77.5900, emergency: false, hours: '09:00 - 18:00' },
  { id: 5, name: 'Apollo Pharmacy', type: 'Pharmacy', distance: '0.4 km', rating: 4.6, open: true, phone: '1860 500 0101', lat: 12.9720, lng: 77.5930, emergency: false, hours: '24x7' },
];

export default function HospitalsPage() {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [filter, setFilter] = useState('All');
  const [hospitals, setHospitals] = useState(MOCK_HOSPITALS);
  const [loading, setLoading] = useState(false);

  const requestLocation = () => {
    setLoading(true);
    // Simulate browser permission and fetching location
    setTimeout(() => {
      setLocationEnabled(true);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (filter === 'All') {
      setHospitals(MOCK_HOSPITALS);
    } else if (filter === 'Emergency') {
      setHospitals(MOCK_HOSPITALS.filter(h => h.emergency));
    } else {
      setHospitals(MOCK_HOSPITALS.filter(h => h.type === filter));
    }
  }, [filter]);

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-140px)]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 shrink-0">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Nearby Hospitals & Clinics</h1>
            <p className="text-text-muted mt-1">Find the right care, right when you need it.</p>
          </div>
          
          <div className="flex gap-2 bg-white/50 p-1 rounded-full border border-border-card backdrop-blur-md">
            {['All', 'Emergency', 'Government', 'Private', 'Clinic', 'Pharmacy'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === f 
                    ? 'bg-foreground text-white shadow-sm' 
                    : 'text-text-secondary hover:text-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          {/* List View */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {!locationEnabled && !loading ? (
              <div className="glass p-8 flex flex-col items-center justify-center text-center h-full rounded-2xl">
                <div className="w-16 h-16 bg-accent-blue/10 rounded-full flex items-center justify-center text-accent-blue text-2xl mb-4">
                  📍
                </div>
                <h3 className="font-display font-bold text-lg mb-2">Location Required</h3>
                <p className="text-sm text-text-muted mb-6">Please allow location access to find healthcare facilities near you.</p>
                <button 
                  onClick={requestLocation}
                  className="px-6 py-3 bg-accent-blue text-white rounded-full font-medium shadow-sm hover:-translate-y-0.5 transition"
                >
                  Enable Location
                </button>
              </div>
            ) : loading ? (
              <div className="flex flex-col gap-4">
                {[1,2,3].map(i => (
                  <div key={i} className="glass p-5 rounded-2xl animate-pulse">
                    <div className="w-2/3 h-5 bg-border-card rounded mb-3"></div>
                    <div className="w-1/3 h-4 bg-border-card rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="w-1/2 h-8 bg-border-card rounded"></div>
                      <div className="w-1/2 h-8 bg-border-card rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4 pb-4">
                {hospitals.map((hospital, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={hospital.id} 
                    className="glass p-5 rounded-2xl relative overflow-hidden group hover:border-accent-blue/30 transition-colors cursor-pointer"
                  >
                    {hospital.emergency && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                        EMERGENCY 24x7
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-2 pr-12">
                      <h3 className="font-display font-bold text-lg text-foreground leading-tight">{hospital.name}</h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mb-4 font-medium">
                      <span className="flex items-center gap-1">
                        <span className="text-accent-blue">📍</span> {hospital.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        ⭐ {hospital.rating}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full border ${hospital.open ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                        {hospital.open ? 'Open Now' : 'Closed'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full border border-border-card bg-black/5">
                        {hospital.type}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-accent-blue/10 text-accent-blue font-medium text-sm rounded-xl hover:bg-accent-blue hover:text-white transition-colors flex items-center justify-center gap-2">
                        Navigate
                      </button>
                      <button className="flex-1 py-2 border border-border-card text-foreground font-medium text-sm rounded-xl hover:bg-black/5 transition-colors flex items-center justify-center gap-2">
                        Call {hospital.phone.split(' ')[0]}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Map View (Mock) */}
          <div className="w-full lg:w-2/3 h-[400px] lg:h-full rounded-3xl overflow-hidden border border-border-card relative shadow-sm bg-[#e5e3df]">
             {/* Mock map background pattern */}
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
             
             {!locationEnabled ? (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-text-muted font-medium bg-white px-4 py-2 rounded-full shadow-sm">Map will appear after location access</span>
                </div>
             ) : (
                <>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-accent-blue rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Mock pins */}
                  {hospitals.map((h, i) => (
                    <div 
                      key={h.id}
                      className="absolute z-0 group cursor-pointer"
                      style={{ 
                        top: `${30 + (i * 15)}%`, 
                        left: `${20 + (i * 18)}%` 
                      }}
                    >
                      <div className={`w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-xs ${h.emergency ? 'bg-red-500' : 'bg-accent-green'}`}>
                        🏥
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-foreground text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {h.name}
                      </div>
                    </div>
                  ))}
                  
                  <div className="absolute bottom-6 right-6 bg-white p-3 rounded-2xl shadow-md border border-border-card text-xs text-text-muted">
                    <p className="font-medium text-foreground mb-1">Mock Google Maps Integration</p>
                    <p>API Key needed for real map tiles.</p>
                  </div>
                </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
