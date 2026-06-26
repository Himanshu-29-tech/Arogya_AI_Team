'use client';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const mockHeartData = [
  { day: 'Mon', bpm: 72 }, { day: 'Tue', bpm: 75 }, { day: 'Wed', bpm: 71 },
  { day: 'Thu', bpm: 74 }, { day: 'Fri', bpm: 78 }, { day: 'Sat', bpm: 72 }, { day: 'Sun', bpm: 70 }
];

const mockSleepData = [
  { day: 'Mon', hours: 7.5 }, { day: 'Tue', hours: 6.8 }, { day: 'Wed', hours: 8.1 },
  { day: 'Thu', hours: 7.0 }, { day: 'Fri', hours: 6.5 }, { day: 'Sat', hours: 9.0 }, { day: 'Sun', hours: 8.5 }
];

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Hello, {session?.user?.name?.split(' ')[0] || 'User'} 👋
            </h1>
            <p className="text-text-muted mt-1">Here is your daily health intelligence summary.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-border-card shadow-sm flex items-center gap-4">
            <div className="text-sm font-medium text-text-secondary">Overall Health Score</div>
            <div className="text-3xl font-display font-bold text-accent-green">86<span className="text-lg text-text-muted">/100</span></div>
          </div>
        </div>

        {/* Top Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center text-xl mb-4">❤️</div>
            <p className="text-sm text-text-muted mb-1">Heart Rate</p>
            <h3 className="text-2xl font-bold font-display text-foreground">72 <span className="text-sm font-normal text-text-muted">bpm</span></h3>
            <p className="text-xs text-green-500 mt-2">↓ 2% from last week</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl mb-4">💧</div>
            <p className="text-sm text-text-muted mb-1">Hydration</p>
            <h3 className="text-2xl font-bold font-display text-foreground">1.8 <span className="text-sm font-normal text-text-muted">L</span></h3>
            <p className="text-xs text-red-500 mt-2">↑ Need 0.7L more today</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center text-xl mb-4">💤</div>
            <p className="text-sm text-text-muted mb-1">Sleep Avg</p>
            <h3 className="text-2xl font-bold font-display text-foreground">7.6 <span className="text-sm font-normal text-text-muted">hrs</span></h3>
            <p className="text-xs text-green-500 mt-2">↑ 5% from last week</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6 rounded-3xl relative overflow-hidden group bg-gradient-to-br from-accent-green/10 to-transparent border-accent-green/20">
            <div className="w-10 h-10 rounded-xl bg-white/50 text-accent-green flex items-center justify-center text-xl mb-4">💊</div>
            <p className="text-sm text-accent-green font-medium mb-1">Today's Meds</p>
            <h3 className="text-2xl font-bold font-display text-foreground">2 <span className="text-sm font-normal text-text-muted">remaining</span></h3>
            <p className="text-xs text-text-secondary mt-2">Next: 08:00 PM</p>
          </motion.div>
        </div>

        {/* Charts & Lists Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 glass p-6 rounded-3xl flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-lg text-foreground">Heart Rate Trends</h3>
              <select className="bg-white/50 border border-border-card text-sm rounded-lg px-3 py-1 outline-none">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            <div className="flex-1 min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockHeartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    itemStyle={{ color: '#2a7d5f', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="bpm" stroke="#2a7d5f" strokeWidth={3} dot={{ r: 4, fill: '#2a7d5f', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Appointments / Reminders */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass p-6 rounded-3xl flex flex-col gap-6">
            <div>
              <h3 className="font-display font-bold text-lg text-foreground mb-4">Upcoming Schedule</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/40 border border-border-card hover:bg-white/60 transition">
                  <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-accent-blue">AUG</span>
                    <span className="text-sm font-bold text-accent-blue">14</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Dr. Sharma (Cardio)</h4>
                    <p className="text-xs text-text-muted">10:00 AM • Apollo Spectra</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/40 border border-border-card hover:bg-white/60 transition">
                  <div className="w-12 h-12 rounded-xl bg-accent-green/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-accent-green">AUG</span>
                    <span className="text-sm font-bold text-accent-green">16</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Complete Blood Count</h4>
                    <p className="text-xs text-text-muted">08:00 AM • Lab Collection</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-border-card"></div>

            <div className="flex-1">
               <h3 className="font-display font-bold text-lg text-foreground mb-4">Sleep Analysis</h3>
               <div className="h-[120px] w-full mt-2">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockSleepData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#78716c' }} />
                      <YAxis hide />
                      <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                      <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 4, 4]} />
                    </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
