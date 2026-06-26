'use client';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row items-center gap-6 glass p-8 rounded-3xl relative overflow-hidden">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center text-white text-3xl font-display font-bold shadow-lg">
            {session?.user?.name?.[0] || 'U'}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-display font-bold text-foreground">{session?.user?.name || 'User'}</h1>
            <p className="text-text-muted">{session?.user?.email || 'user@example.com'}</p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
              <span className="px-3 py-1 bg-white/60 border border-border-card rounded-full text-xs font-bold text-accent-blue">Patient ID: AR-98234</span>
              <span className="px-3 py-1 bg-red-50 border border-red-100 rounded-full text-xs font-bold text-red-600">Blood: O+</span>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button className="flex-1 md:flex-none px-6 py-2.5 bg-foreground text-white rounded-full font-medium hover:opacity-90 transition shadow-sm">Edit Profile</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Medical History */}
          <div className="glass p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-display font-bold text-foreground">Medical Overview</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Allergies</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-orange-50 border border-orange-100 text-orange-700 rounded-lg text-sm">Penicillin</span>
                  <span className="px-3 py-1.5 bg-orange-50 border border-orange-100 text-orange-700 rounded-lg text-sm">Peanuts</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Chronic Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-sm">Type 2 Diabetes</span>
                  <span className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-sm">Hypertension</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="glass p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-display font-bold text-foreground">Emergency Contacts</h2>
               <button className="text-accent-blue text-sm font-bold">+ Add</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/50 border border-border-card rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">👨‍👩‍👧</div>
                  <div>
                    <p className="font-bold text-sm text-foreground">Rahul Sharma</p>
                    <p className="text-xs text-text-muted">Brother</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-text-secondary">+91 98765 43210</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/50 border border-border-card rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">🩺</div>
                  <div>
                    <p className="font-bold text-sm text-foreground">Dr. Verma</p>
                    <p className="text-xs text-text-muted">Primary Physician</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-text-secondary">+91 80 4356 0001</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Ownership */}
        <div className="bg-accent-green/5 border border-accent-green/20 p-8 rounded-3xl text-center">
          <div className="w-12 h-12 bg-accent-green/10 text-accent-green rounded-full flex items-center justify-center text-xl mx-auto mb-4">🔒</div>
          <h2 className="text-xl font-display font-bold text-foreground mb-2">You own your data</h2>
          <p className="text-text-muted text-sm max-w-xl mx-auto mb-6">Your health records are encrypted using AES-256 and stored in secure enclaves. Arogya AI never shares your personal medical history with third parties without explicit consent.</p>
          <button className="px-6 py-2.5 bg-white border border-border-card text-foreground font-medium rounded-full shadow-sm hover:bg-gray-50 transition">
            Download Complete Profile Data
          </button>
        </div>

      </div>
    </div>
  );
}
