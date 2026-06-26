'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const MOCK_SCHEMES = [
  {
    id: 1,
    title: 'Ayushman Bharat PM-JAY',
    description: 'Provides health cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization.',
    eligibility: ['Low-income families', 'Listed in SECC 2011 database', 'No family member in govt job'],
    benefits: ['Cashless treatment at empaneled hospitals', 'Covers up to 3 days pre-hospitalization', 'Covers 15 days post-hospitalization'],
    link: 'https://pmjay.gov.in/',
    matchScore: 98,
  },
  {
    id: 2,
    title: 'Central Government Health Scheme (CGHS)',
    description: 'Comprehensive health care facilities for Central Govt. employees and pensioners.',
    eligibility: ['Central Government employees', 'Pensioners', 'Dependents'],
    benefits: ['Dispensary services', 'Hospitalization', 'Purchase of medicines'],
    link: 'https://cghs.nic.in/',
    matchScore: 45,
  },
  {
    id: 3,
    title: 'State specific Health Insurance Scheme',
    description: 'State sponsored scheme for families BPL (Below Poverty Line).',
    eligibility: ['BPL Ration card holders', 'Residents of the state'],
    benefits: ['Coverage up to 2 lakhs', 'Maternity benefits'],
    link: '#',
    matchScore: 85,
  }
];

export default function SchemesPage() {
  const [formData, setFormData] = useState({ age: '', income: '', state: '', category: '' });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate AI/API matching
    setTimeout(() => {
      // Sort by mock match score
      setResults([...MOCK_SCHEMES].sort((a,b) => b.matchScore - a.matchScore));
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-foreground">Government Health Schemes</h1>
          <p className="text-text-muted mt-2 max-w-2xl mx-auto">Find out which government health schemes you are eligible for. We match your profile against hundreds of central and state programs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-1">
            <div className="glass p-6 rounded-3xl sticky top-24">
              <h2 className="font-display font-bold text-lg mb-4">Check Eligibility</h2>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Age</label>
                  <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-border-card outline-none focus:border-accent-blue" placeholder="e.g. 45" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Annual Family Income</label>
                  <select required value={formData.income} onChange={e => setFormData({...formData, income: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-border-card outline-none focus:border-accent-blue">
                    <option value="">Select Income Bracket</option>
                    <option value="under_1l">Under ₹1 Lakh</option>
                    <option value="1l_to_3l">₹1 Lakh - ₹3 Lakhs</option>
                    <option value="3l_to_8l">₹3 Lakhs - ₹8 Lakhs</option>
                    <option value="above_8l">Above ₹8 Lakhs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">State</label>
                  <input type="text" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-border-card outline-none focus:border-accent-blue" placeholder="e.g. Maharashtra" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Occupation Category</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-border-card outline-none focus:border-accent-blue">
                    <option value="">Select Category</option>
                    <option value="unorganized">Unorganized Sector</option>
                    <option value="farmer">Farmer / Agriculture</option>
                    <option value="govt">Govt Employee</option>
                    <option value="private">Private Employee</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                </div>
                
                <button type="submit" disabled={loading} className="w-full py-3 mt-4 bg-foreground text-white rounded-xl font-medium shadow-sm hover:opacity-90 transition disabled:opacity-50 flex justify-center items-center">
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    'Find Schemes'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="md:col-span-2">
            {!results && !loading && (
               <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border-card rounded-3xl">
                 <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-2xl mb-4">📄</div>
                 <h3 className="font-display font-bold text-xl mb-2">No active search</h3>
                 <p className="text-text-muted text-sm">Fill the details on the left to discover financial health assistance schemes.</p>
               </div>
            )}

            {loading && (
              <div className="space-y-4">
                {[1,2].map(i => (
                  <div key={i} className="glass p-6 rounded-3xl animate-pulse">
                    <div className="h-6 w-1/2 bg-border-card rounded mb-4"></div>
                    <div className="h-4 w-full bg-border-card rounded mb-2"></div>
                    <div className="h-4 w-3/4 bg-border-card rounded"></div>
                  </div>
                ))}
              </div>
            )}

            {results && !loading && (
              <div className="space-y-6">
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-200 text-sm font-medium">
                  Found {results.length} schemes matching your profile.
                </div>
                
                {results.map((scheme, i) => (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={scheme.id} className="glass p-6 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full" style={{ backgroundColor: scheme.matchScore > 80 ? '#10b981' : scheme.matchScore > 50 ? '#f59e0b' : '#ef4444' }}></div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-display font-bold text-foreground pr-12">{scheme.title}</h3>
                      <div className="bg-white/80 border border-border-card px-3 py-1 rounded-full text-xs font-bold text-accent-blue shadow-sm">
                        {scheme.matchScore}% Match
                      </div>
                    </div>
                    
                    <p className="text-sm text-text-secondary mb-6">{scheme.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Eligibility Criteria</h4>
                        <ul className="space-y-1">
                          {scheme.eligibility.map((item, idx) => (
                            <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                              <span className="text-accent-green mt-0.5">✓</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Key Benefits</h4>
                        <ul className="space-y-1">
                          {scheme.benefits.map((item, idx) => (
                            <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                              <span className="text-accent-blue mt-0.5">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border-card flex gap-4">
                      <a href={scheme.link} target="_blank" rel="noreferrer" className="flex-1 text-center py-2.5 bg-accent-blue/10 text-accent-blue font-medium rounded-xl hover:bg-accent-blue hover:text-white transition">
                        Official Website
                      </a>
                      <button className="flex-1 py-2.5 bg-foreground text-white font-medium rounded-xl hover:opacity-90 transition shadow-sm">
                        Apply Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
