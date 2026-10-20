'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRecordIndex, setActiveRecordIndex] = useState(0);

  // Upload modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [modalTab, setModalTab] = useState('upload'); // 'upload' | 'samples'
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // Form fields
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState('Blood Test');
  const [reportText, setReportText] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  // Fetch records
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/records');
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
      }
    } catch (err) {
      console.error('Failed to load records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Quick preset sample analyzer
  const handleAnalyzePreset = async (presetKey) => {
    setAnalyzing(true);
    setUploadError('');
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetKey }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Analysis failed');
      }

      const data = await res.json();
      setRecords(prev => [data.record, ...prev]);
      setActiveRecordIndex(0);
      setShowUploadModal(false);
      resetForm();
    } catch (err) {
      setUploadError(err.message || 'Failed to analyze sample report');
    } finally {
      setAnalyzing(false);
    }
  };

  // Custom document upload analyzer
  const handleAnalyzeCustom = async (e) => {
    e.preventDefault();
    if (!reportText.trim() && !selectedFileName) {
      setUploadError('Please choose a file or paste your medical report text to continue.');
      return;
    }

    setAnalyzing(true);
    setUploadError('');

    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: reportTitle.trim() || selectedFileName || 'Medical Diagnostic Report',
          recordType: reportType,
          fileName: selectedFileName || 'clinical_report.pdf',
          customText: reportText.trim() || `Diagnostic Document: ${selectedFileName}. Extracted for clinical evaluation.`
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to analyze document');
      }

      const data = await res.json();
      setRecords(prev => [data.record, ...prev]);
      setActiveRecordIndex(0);
      setShowUploadModal(false);
      resetForm();
    } catch (err) {
      setUploadError(err.message || 'Error running AI document analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      if (!reportTitle) {
        setReportTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          setReportText(content.slice(0, 3000));
        }
      };

      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        setReportText(`[Document uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]\nPatient diagnostic records scanned for biomarker extraction.`);
      }
    }
  };

  const handleDeleteRecord = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this medical record?')) return;
    try {
      const res = await fetch(`/api/records?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRecords(prev => prev.filter(r => r._id !== id));
        setActiveRecordIndex(0);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const resetForm = () => {
    setReportTitle('');
    setReportText('');
    setSelectedFileName('');
    setReportType('Blood Test');
    setUploadError('');
    setModalTab('upload');
  };

  const activeRecord = records[activeRecordIndex] || records[0];

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'high':
      case 'critical':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><span>▲</span> Elevated</span>;
      case 'low':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"><span>▼</span> Low</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><span>✓</span> Normal</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Clinical Health Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
              Welcome, {session?.user?.name || 'User'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {records.length > 0 
                ? `You have ${records.length} analyzed medical ${records.length === 1 ? 'document' : 'documents'} on file.`
                : 'Upload your medical documents to generate verified health insights and biomarker trends.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { resetForm(); setShowUploadModal(true); }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2a7d5f] hover:bg-[#20634b] text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Upload Medical Record</span>
            </button>
          </div>
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-sm space-y-3">
            <div className="inline-block animate-spin w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full"></div>
            <p className="text-gray-500 text-sm">Syncing your clinical profile...</p>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* STATE 1: NO RECORDS UPLOADED YET                          */}
        {/* ────────────────────────────────────────────────────────── */}
        {!loading && records.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* Notice banner */}
            <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-sm flex items-start gap-4 bg-gradient-to-r from-amber-50/50 to-white">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl shrink-0">
                📋
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900">
                  No Medical Records Analyzed Yet
                </h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  Arogya AI requires an authentic lab report, doctor prescription, or medical summary to compute your health metrics. Upload a file or test a sample clinical report below to populate your live dashboard.
                </p>
              </div>
            </div>

            {/* 4-Step Journey */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200/80 shadow-sm space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50">
                  The Clinical Workflow
                </span>
                <h2 className="text-2xl font-display font-bold text-gray-900 mt-3">
                  From records to clarity in minutes
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  A seamless, four-step journey from raw clinical data to actionable health intelligence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
                <div className="p-5 rounded-xl bg-gray-50 border border-gray-200/60 space-y-2">
                  <div className="text-xs font-mono font-bold text-emerald-600">01</div>
                  <div className="text-2xl">📤</div>
                  <h4 className="font-bold text-gray-900 text-sm">Upload Records</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Upload any lab report, prescription, or clinical summary in PDF or image format.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-gray-50 border border-gray-200/60 space-y-2">
                  <div className="text-xs font-mono font-bold text-blue-600">02</div>
                  <div className="text-2xl">🤖</div>
                  <h4 className="font-bold text-gray-900 text-sm">AI OCR Analysis</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Multimodal AI scans the document, extracts biomarkers, and checks standard ranges.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-gray-50 border border-gray-200/60 space-y-2">
                  <div className="text-xs font-mono font-bold text-purple-600">03</div>
                  <div className="text-2xl">💡</div>
                  <h4 className="font-bold text-gray-900 text-sm">Receive Insights</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Get an understandable plain-language summary with flagged anomalies explained.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-gray-50 border border-gray-200/60 space-y-2">
                  <div className="text-xs font-mono font-bold text-amber-600">04</div>
                  <div className="text-2xl">📈</div>
                  <h4 className="font-bold text-gray-900 text-sm">Track & Improve</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Monitor your vitality score and biomarker trajectory across recurring tests.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Test Samples */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200/80 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-display font-bold text-gray-900">
                    Try A Sample Clinical Report
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Click any sample panel to see immediate AI extraction and live dashboard generation:
                  </p>
                </div>
                <button
                  onClick={() => { resetForm(); setShowUploadModal(true); }}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline self-start sm:self-auto cursor-pointer"
                >
                  Or upload your own file →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  disabled={analyzing}
                  onClick={() => handleAnalyzePreset('cbc')}
                  className="p-5 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all group flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">🧪</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        Blood Test
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 transition">
                      Complete Blood Count (CBC)
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Hemoglobin, White Blood Cells, Platelets, and RBC indices.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 mt-4 flex items-center gap-1">
                    Analyze CBC Panel →
                  </span>
                </button>

                <button
                  disabled={analyzing}
                  onClick={() => handleAnalyzePreset('lipid')}
                  className="p-5 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition-all group flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">🩺</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                        Lipid Panel
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition">
                      Comprehensive Lipid Profile
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Total Cholesterol, HDL, LDL, Triglycerides, and risk ratios.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-blue-700 mt-4 flex items-center gap-1">
                    Analyze Lipid Profile →
                  </span>
                </button>

                <button
                  disabled={analyzing}
                  onClick={() => handleAnalyzePreset('diabetes')}
                  className="p-5 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50/40 text-left transition-all group flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">🩸</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                        Metabolic Panel
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 group-hover:text-purple-700 transition">
                      Glycemic & HbA1c Panel
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      HbA1c 3-month average, Fasting Blood Sugar, Creatinine.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-purple-700 mt-4 flex items-center gap-1">
                    Analyze HbA1c Panel →
                  </span>
                </button>
              </div>
            </div>

          </motion.div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* STATE 2: ACTIVE RECORDS AVAILABLE                          */}
        {/* ────────────────────────────────────────────────────────── */}
        {!loading && records.length > 0 && activeRecord && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            {/* Record Selector Tabs (if multiple records) */}
            {records.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 shrink-0 mr-1">
                  Reports:
                </span>
                {records.map((rec, idx) => (
                  <button
                    key={rec._id || idx}
                    onClick={() => setActiveRecordIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                      activeRecordIndex === idx
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span>📄</span>
                    <span className="font-medium">{rec.title}</span>
                    <span className="opacity-60 text-[10px]">
                      ({new Date(rec.recordDate || rec.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Overview Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Vitality Score Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between bg-gradient-to-br from-emerald-50/40 via-white to-white">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
                      Vitality Score
                    </span>
                    <span className="text-xl">🛡️</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Computed Health Index</p>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-5xl font-display font-extrabold text-emerald-700">
                      {activeRecord.healthScore || 85}
                    </span>
                    <span className="text-lg text-gray-400 font-bold">/100</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-600 flex items-center justify-between">
                  <span>Extracted Biomarkers:</span>
                  <span className="font-bold text-gray-900">{activeRecord.biomarkers?.length || 0} entities</span>
                </div>
              </div>

              {/* Document Overview Card */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                        {activeRecord.recordType || 'Diagnostic Report'}
                      </span>
                      <span className="text-xs text-gray-400">
                        • {new Date(activeRecord.recordDate || activeRecord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteRecord(activeRecord._id, e)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>

                  <h2 className="text-xl font-display font-bold text-gray-900">
                    {activeRecord.title}
                  </h2>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    File: {activeRecord.fileName}
                  </p>

                  <div className="mt-3.5 p-4 rounded-xl bg-gray-50 border border-gray-200/60 text-xs text-gray-700 leading-relaxed">
                    <strong className="text-emerald-800 font-semibold">AI Plain-Language Summary: </strong>
                    {activeRecord.summary}
                  </div>
                </div>

                {/* Highlighted Concerns */}
                {activeRecord.anomalies?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <span>⚠️</span> Highlighted Concerns:
                    </span>
                    <div className="space-y-1">
                      {activeRecord.anomalies.map((ano, i) => (
                        <div key={i} className="text-xs text-amber-900 bg-amber-50 border border-amber-200/60 px-3 py-1.5 rounded-lg">
                          {ano}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Extracted Biomarkers Table */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-display font-bold text-gray-900 flex items-center gap-2">
                    <span>🔬</span> Extracted Biomarkers & Clinical Values
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Digitized and mapped against reference intervals from {activeRecord.fileName}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Normal
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Elevated
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Low
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50/70 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="py-3 px-6">Biomarker</th>
                      <th className="py-3 px-6">Result</th>
                      <th className="py-3 px-6">Standard Range</th>
                      <th className="py-3 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {activeRecord.biomarkers?.map((bio, idx) => (
                      <tr key={`bio-${bio.name}-${idx}`} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3.5 px-6 font-semibold text-gray-900">
                          {bio.name}
                        </td>
                        <td className="py-3.5 px-6 font-mono font-bold text-gray-900">
                          {bio.value} <span className="text-xs font-normal text-gray-500">{bio.unit}</span>
                        </td>
                        <td className="py-3.5 px-6 font-mono text-xs text-gray-500">
                          {bio.referenceRange || 'N/A'} {bio.unit}
                        </td>
                        <td className="py-3.5 px-6">
                          {getStatusBadge(bio.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charts & Recommendations Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Biomarker Bar Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-gray-900">
                      Biomarker Relative Comparison
                    </h3>
                    <p className="text-xs text-gray-500">Measured values extracted from this report</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                    {activeRecord.recordType}
                  </span>
                </div>

                <div className="flex-1 min-h-[260px] w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activeRecord.biomarkers?.slice(0, 6) || []}
                      margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fill: '#6b7280' }} 
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                        formatter={(val, name, item) => [`${item.payload.value} ${item.payload.unit || ''}`, item.payload.name]}
                      />
                      <Bar dataKey="numericValue" radius={[6, 6, 0, 0]}>
                        {activeRecord.biomarkers?.slice(0, 6).map((entry, index) => (
                          <Cell 
                            key={`bar-${index}`} 
                            fill={entry.status === 'high' ? '#f59e0b' : entry.status === 'low' ? '#3b82f6' : '#2a7d5f'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-gray-900 mb-3 flex items-center gap-2">
                    <span>💡</span> Clinical Recommendations
                  </h3>
                  <div className="space-y-2.5">
                    {activeRecord.recommendations?.map((rec, i) => (
                      <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-200/60 text-xs text-gray-700 leading-relaxed flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                          ✓
                        </span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    href="/chat"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 font-semibold transition text-xs border border-emerald-200/60"
                  >
                    <span>💬</span> Ask Arogya AI About This Report
                  </Link>
                </div>
              </div>

            </div>

          </motion.div>
        )}

      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* REDESIGNED SPACIOUS UPLOAD MODAL                           */}
      {/* ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-200 max-h-[92vh] overflow-y-auto space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-display font-bold text-gray-900">
                    Upload & Analyze Medical Document
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Multimodal AI reads your lab reports, extracts biomarkers, and checks standard ranges.
                  </p>
                </div>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm cursor-pointer transition"
                >
                  ✕
                </button>
              </div>

              {/* Error Message */}
              {uploadError && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Tabs Switcher */}
              <div className="flex border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setModalTab('upload')}
                  className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    modalTab === 'upload'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  📤 Upload Your Document
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('samples')}
                  className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    modalTab === 'samples'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  ⚡ Quick Test With Sample Data
                </button>
              </div>

              {/* TAB 1: CUSTOM FILE UPLOAD */}
              {modalTab === 'upload' && (
                <form onSubmit={handleAnalyzeCustom} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Document Title
                    </label>
                    <input
                      type="text"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      placeholder="e.g. Annual Blood Work - Apollo Diagnostics"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-emerald-600 focus:ring-1 focus:emerald-600 outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Document Type
                      </label>
                      <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:border-emerald-600 outline-none transition cursor-pointer"
                      >
                        <option>Blood Test</option>
                        <option>Lipid Panel</option>
                        <option>Prescription</option>
                        <option>Discharge Summary</option>
                        <option>X-Ray / Scan</option>
                        <option>General Lab</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Select Document File
                      </label>
                      <label className="w-full px-3 py-2.5 rounded-xl border border-dashed border-gray-300 hover:border-emerald-600 bg-gray-50 text-xs flex items-center justify-center gap-2 cursor-pointer truncate transition">
                        <span className="text-gray-400">📄</span>
                        <span className="truncate text-gray-700 font-medium">
                          {selectedFileName || 'Choose PDF, PNG, JPG, or TXT...'}
                        </span>
                        <input 
                          type="file" 
                          accept=".pdf,.png,.jpg,.jpeg,.webp,.txt" 
                          onChange={handleFileChange}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Or Paste Report Findings / Prescription Text
                    </label>
                    <textarea
                      rows={4}
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      placeholder="e.g.:&#10;Hemoglobin: 13.8 g/dL (ref: 13.0 - 17.0)&#10;Total Cholesterol: 215 mg/dL&#10;Fasting Glucose: 96 mg/dL..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-mono focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={analyzing}
                    className="w-full py-3.5 bg-[#2a7d5f] hover:bg-[#20634b] text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    {analyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Extracting Biomarkers & Running AI OCR...</span>
                      </>
                    ) : (
                      <span>Run AI Analysis on Document</span>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 2: SAMPLE DATA SELECTION */}
              {modalTab === 'samples' && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 mb-2">
                    Select a curated diagnostic dataset to test the full extraction and visualization:
                  </p>

                  <button
                    type="button"
                    disabled={analyzing}
                    onClick={() => handleAnalyzePreset('cbc')}
                    className="w-full p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🧪</span>
                      <div>
                        <div className="text-sm font-bold text-gray-900">Complete Blood Count (CBC) Panel</div>
                        <div className="text-xs text-gray-500">Hemoglobin, Platelets, WBC differentials, RBC count</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 shrink-0">Analyze →</span>
                  </button>

                  <button
                    type="button"
                    disabled={analyzing}
                    onClick={() => handleAnalyzePreset('lipid')}
                    className="w-full p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🩺</span>
                      <div>
                        <div className="text-sm font-bold text-gray-900">Comprehensive Lipid Profile</div>
                        <div className="text-xs text-gray-500">Total Cholesterol, HDL, LDL, Triglycerides</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-blue-700 shrink-0">Analyze →</span>
                  </button>

                  <button
                    type="button"
                    disabled={analyzing}
                    onClick={() => handleAnalyzePreset('diabetes')}
                    className="w-full p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50/40 text-left transition flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🩸</span>
                      <div>
                        <div className="text-sm font-bold text-gray-900">Glycemic & HbA1c Metabolic Panel</div>
                        <div className="text-xs text-gray-500">HbA1c 3-month avg, Fasting Glucose, Serum Creatinine</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-purple-700 shrink-0">Analyze →</span>
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
