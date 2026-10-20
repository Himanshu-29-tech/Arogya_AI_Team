'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    bloodGroup: '',
    allergies: '',
    chronicDiseases: '',
  });

  // Emergency contact modal
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', relation: '', phone: '' });
  const [contactSaving, setContactSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  async function fetchProfile() {
    try {
      setLoading(true);
      const res = await fetch('/api/user/profile');
      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      setProfile(data);
      setEditForm({
        name: data.name || '',
        bloodGroup: data.bloodGroup || '',
        allergies: (data.allergies || []).join(', '),
        chronicDiseases: (data.chronicDiseases || []).join(', '),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          bloodGroup: editForm.bloodGroup,
          allergies: editForm.allergies.split(',').map((s) => s.trim()).filter(Boolean),
          chronicDiseases: editForm.chronicDiseases.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to save');
      }
      const updated = await res.json();
      setProfile(updated);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddContact(e) {
    e.preventDefault();
    setContactSaving(true);
    setError('');
    try {
      const res = await fetch('/api/user/profile/emergency-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to add contact');
      }
      const updatedContacts = await res.json();
      setProfile((prev) => ({ ...prev, emergencyContacts: updatedContacts }));
      setContactForm({ name: '', relation: '', phone: '' });
      setShowContactModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setContactSaving(false);
    }
  }

  async function handleDeleteContact(contactId) {
    if (!confirm('Remove this emergency contact?')) return;
    const prev = profile.emergencyContacts;
    setProfile((p) => ({ ...p, emergencyContacts: p.emergencyContacts.filter((c) => c._id !== contactId) }));
    try {
      const res = await fetch(`/api/user/profile/emergency-contacts?contactId=${contactId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    } catch {
      setProfile((p) => ({ ...p, emergencyContacts: prev }));
      setError('Failed to remove contact.');
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-10 h-10 border-4 border-accent-green border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const initials = (profile?.name || session?.user?.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex justify-between items-center">
              <span>⚠️ {error}</span>
              <button onClick={() => setError('')} className="ml-4 font-bold text-red-400 hover:text-red-600">×</button>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm">
              ✅ {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 glass p-8 rounded-3xl relative overflow-hidden">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center text-white text-3xl font-display font-bold shadow-lg">
            {initials}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-display font-bold text-foreground">{profile?.name || 'User'}</h1>
            <p className="text-text-muted">{profile?.email || session?.user?.email}</p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
              <span className="px-3 py-1 bg-white/60 border border-border-card rounded-full text-xs font-bold text-accent-blue">
                Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'}
              </span>
              {profile?.bloodGroup && (
                <span className="px-3 py-1 bg-red-50 border border-red-100 rounded-full text-xs font-bold text-red-600">
                  Blood: {profile.bloodGroup}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button
              onClick={() => {
                setEditMode(!editMode);
                setError('');
              }}
              className="flex-1 md:flex-none px-6 py-2.5 bg-foreground text-white rounded-full font-medium hover:opacity-90 transition shadow-sm"
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Edit Form */}
        <AnimatePresence>
          {editMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSaveProfile} className="glass p-8 rounded-3xl space-y-5">
                <h2 className="text-xl font-display font-bold text-foreground">Edit Health Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-card focus:border-accent-green outline-none bg-white/70"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Blood Group</label>
                    <select
                      value={editForm.bloodGroup}
                      onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-card focus:border-accent-green outline-none bg-white/70"
                    >
                      <option value="">Select blood group</option>
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Allergies <span className="text-text-muted font-normal">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.allergies}
                    onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-card focus:border-accent-green outline-none bg-white/70"
                    placeholder="e.g. Penicillin, Peanuts, Dust"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Chronic Conditions <span className="text-text-muted font-normal">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.chronicDiseases}
                    onChange={(e) => setEditForm({ ...editForm, chronicDiseases: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-card focus:border-accent-green outline-none bg-white/70"
                    placeholder="e.g. Type 2 Diabetes, Hypertension"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-7 py-2.5 bg-accent-green text-white rounded-full font-medium hover:bg-accent-green-light transition disabled:opacity-60 flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                          className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Medical Overview */}
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-xl font-display font-bold text-foreground mb-6">Medical Overview</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Allergies</h3>
                <div className="flex flex-wrap gap-2">
                  {(profile?.allergies || []).length > 0 ? (
                    profile.allergies.map((a, i) => (
                      <span key={`allergy-${a}-${i}`} className="px-3 py-1.5 bg-orange-50 border border-orange-100 text-orange-700 rounded-lg text-sm">{a}</span>
                    ))
                  ) : (
                    <span className="text-sm text-text-muted italic">None recorded</span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Chronic Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  {(profile?.chronicDiseases || []).length > 0 ? (
                    profile.chronicDiseases.map((c, i) => (
                      <span key={`chronic-${c}-${i}`} className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-sm">{c}</span>
                    ))
                  ) : (
                    <span className="text-sm text-text-muted italic">None recorded</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="glass p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold text-foreground">Emergency Contacts</h2>
              <button
                onClick={() => setShowContactModal(true)}
                className="text-accent-blue text-sm font-bold hover:opacity-70 transition cursor-pointer"
              >
                + Add
              </button>
            </div>
            <div className="space-y-4">
              {(profile?.emergencyContacts || []).length === 0 ? (
                <p className="text-sm text-text-muted italic text-center py-4">No emergency contacts added yet.</p>
              ) : (
                profile.emergencyContacts.map((c, i) => (
                  <div key={c._id || c.id || `contact-${c.phone || i}`} className="flex items-center justify-between p-4 bg-white/50 border border-border-card rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">👤</div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{c.name}</p>
                        <p className="text-xs text-text-muted">{c.relation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-text-secondary">{c.phone}</p>
                      <button
                        onClick={() => handleDeleteContact(c._id || c.id || c.phone)}
                        className="text-gray-300 hover:text-red-400 transition text-lg cursor-pointer"
                        title="Remove contact"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Data Ownership */}
        <div className="bg-accent-green/5 border border-accent-green/20 p-8 rounded-3xl text-center">
          <div className="w-12 h-12 bg-accent-green/10 text-accent-green rounded-full flex items-center justify-center text-xl mx-auto mb-4">🔒</div>
          <h2 className="text-xl font-display font-bold text-foreground mb-2">You own your data</h2>
          <p className="text-text-muted text-sm max-w-xl mx-auto mb-6">
            Your health records are encrypted and stored securely in MongoDB Atlas. Arogya AI never shares your
            personal medical history with third parties without explicit consent.
          </p>
          <button className="px-6 py-2.5 bg-white border border-border-card text-foreground font-medium rounded-full shadow-sm hover:bg-gray-50 transition">
            Download Complete Profile Data
          </button>
        </div>
      </div>

      {/* Emergency Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowContactModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-xl"
            >
              <h2 className="text-xl font-display font-bold mb-6 text-foreground">Add Emergency Contact</h2>
              <form onSubmit={handleAddContact} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-card focus:border-accent-green outline-none"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Relation</label>
                  <input
                    required
                    type="text"
                    value={contactForm.relation}
                    onChange={(e) => setContactForm({ ...contactForm, relation: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-card focus:border-accent-green outline-none"
                    placeholder="e.g. Brother, Mother, Doctor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-card focus:border-accent-green outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowContactModal(false)}
                    className="px-5 py-2.5 rounded-xl font-medium text-text-secondary hover:bg-black/5 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={contactSaving}
                    className="px-5 py-2.5 rounded-xl font-medium bg-accent-green text-white hover:bg-accent-green-light transition disabled:opacity-60">
                    {contactSaving ? 'Adding...' : 'Add Contact'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
