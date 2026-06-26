'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function EmergencyPage() {
  const [countdown, setCountdown] = useState(5);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (isActive && countdown === 0) {
      // Trigger actual emergency logic here (e.g. SMS via Twilio, Call)
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isActive, countdown]);

  const cancelEmergency = () => {
    setIsActive(false);
    setCountdown(5);
  };

  return (
    <div className="min-h-screen bg-[#1a0f0f] text-white pt-20 pb-12 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center">
      {/* Red pulse background */}
      <div className="absolute inset-0 bg-red-900/20 z-0 animate-pulse" style={{ animationDuration: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center pt-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-red-500 tracking-wider">EMERGENCY MODE</h1>
          <p className="text-red-200 mt-2 text-lg">Help is just one tap away.</p>
        </div>

        {/* SOS Button */}
        {!isActive ? (
          <button 
            onClick={() => setIsActive(true)}
            className="w-64 h-64 rounded-full bg-red-600 shadow-[0_0_60px_rgba(220,38,38,0.6)] flex items-center justify-center border-8 border-red-500/30 hover:scale-105 active:scale-95 transition-transform relative group"
          >
            <div className="absolute inset-0 rounded-full border-2 border-red-400 opacity-0 group-hover:animate-ping"></div>
            <span className="text-6xl font-display font-bold text-white tracking-widest">SOS</span>
          </button>
        ) : (
          <div className="w-64 h-64 rounded-full bg-red-950 border-4 border-red-600 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.4)]">
            {countdown > 0 ? (
              <>
                <span className="text-5xl font-display font-bold text-red-500">{countdown}</span>
                <span className="text-sm text-red-300 mt-2">Alerting in...</span>
              </>
            ) : (
               <div className="flex flex-col items-center">
                 <span className="text-4xl mb-2">🚨</span>
                 <span className="text-xl font-bold text-red-500 text-center px-4">Emergency Contacts Alerted</span>
               </div>
            )}
          </div>
        )}

        {isActive && countdown > 0 && (
          <button onClick={cancelEmergency} className="mt-8 px-8 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition backdrop-blur-sm border border-white/20">
            Cancel Alert
          </button>
        )}

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-16">
          <button className="bg-red-950/50 border border-red-800/50 p-6 rounded-2xl flex items-center gap-4 hover:bg-red-900/50 transition backdrop-blur-md">
            <div className="w-14 h-14 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center text-2xl">🚑</div>
            <div className="text-left">
              <h3 className="font-bold text-lg">Call Ambulance</h3>
              <p className="text-sm text-red-300">Dial 108 immediately</p>
            </div>
          </button>
          
          <button className="bg-red-950/50 border border-red-800/50 p-6 rounded-2xl flex items-center gap-4 hover:bg-red-900/50 transition backdrop-blur-md">
            <div className="w-14 h-14 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center text-2xl">📍</div>
            <div className="text-left">
              <h3 className="font-bold text-lg">Share Live Location</h3>
              <p className="text-sm text-red-300">Send GPS to contacts</p>
            </div>
          </button>

          <div className="md:col-span-2 bg-black/40 border border-red-900/30 p-6 rounded-2xl backdrop-blur-md">
            <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2">
              <span>📖</span> Quick First Aid Guide
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['CPR Steps', 'Choking', 'Severe Bleeding', 'Heart Attack'].map(guide => (
                <button key={guide} className="bg-white/5 border border-white/10 py-3 rounded-xl text-sm hover:bg-white/10 transition text-red-100">
                  {guide}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
