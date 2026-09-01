'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Upload, 
  Search, 
  Filter, 
  CheckCircle, 
  FileCode, 
  Download, 
  X
} from 'lucide-react';
import { DigitalDocument } from '@/lib/localData';

const Documents: React.FC = () => {
  const { documents, addDocument, updateDocumentStatus } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [newDocForm, setNewDocForm] = useState({
    title: '',
    category: 'RC' as DigitalDocument['category'],
    entity: 'TRK-101 (KA-01-MJ-2034)',
    documentNumber: '',
    fileSize: '1.5 MB'
  });

  const categories = ['All', 'RC', 'Insurance', 'PUC', 'Driving License', 'GST Certificate', 'Invoice', 'E-Way Bill', 'Permit'];
  const statuses = ['All', 'Verified', 'Pending', 'Expiring Soon', 'Expired'];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesStat = selectedStatus === 'All' || doc.status === selectedStatus;

    return matchesSearch && matchesCat && matchesStat;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDocument({
      title: newDocForm.title || `${newDocForm.category} Document`,
      category: newDocForm.category,
      entity: newDocForm.entity,
      documentNumber: newDocForm.documentNumber || `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
      fileSize: newDocForm.fileSize
    });
    setShowUploadModal(false);
  };

  const getStatusBadge = (status: DigitalDocument['status']) => {
    switch (status) {
      case 'Verified':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><ShieldCheck className="h-3.5 w-3.5" /> Verified</span>;
      case 'Pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><Clock className="h-3.5 w-3.5" /> Pending Verification</span>;
      case 'Expiring Soon':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200"><AlertTriangle className="h-3.5 w-3.5" /> Expiring Soon</span>;
      case 'Expired':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"><AlertTriangle className="h-3.5 w-3.5" /> Expired</span>;
    }
  };

  const verifiedCount = documents.filter(d => d.status === 'Verified').length;
  const pendingCount = documents.filter(d => d.status === 'Pending').length;
  const expiringCount = documents.filter(d => d.status === 'Expiring Soon' || d.status === 'Expired').length;

  return (
    <div className="h-full overflow-y-auto bg-[#FAF9F6] p-6 text-charcoal font-sans space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B1320]">
            Digital Compliance & Documents
          </h1>
          <p className="text-sm text-charcoal/70">
            Paperless digital repository for RC, Insurance, PUC, Driving Licenses, and E-Way Bills.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-[#0B1320] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition shadow-md"
        >
          <Upload className="h-4 w-4 text-amber-400" />
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Verified Compliance</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{verifiedCount}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Legally active documents</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Pending Review</p>
            <p className="text-2xl font-extrabold text-amber-700 mt-1">{pendingCount}</p>
            <p className="text-xs text-amber-600 font-medium mt-1">Awaiting RTO verification</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Action Required</p>
            <p className="text-2xl font-extrabold text-rose-700 mt-1">{expiringCount}</p>
            <p className="text-xs text-rose-600 font-medium mt-1">Expiring or expired documents</p>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
            <AlertTriangle className="h-6 w-6 text-rose-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-charcoal/40" />
            <input
              type="text"
              placeholder="Search by Document Title, Entity, Document #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1320]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-charcoal/70">
            <Filter className="h-3.5 w-3.5 text-charcoal/50" />
            <span>Category:</span>
          </div>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedCategory === cat
                  ? 'bg-[#0B1320] text-white'
                  : 'bg-[#FAF9F6] border border-stone-200 text-charcoal hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-charcoal/70">
            <span>Status:</span>
          </div>
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedStatus === st
                  ? 'bg-amber-800 text-white'
                  : 'bg-[#FAF9F6] border border-stone-200 text-charcoal hover:bg-stone-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-stone-200 text-charcoal/70 uppercase text-[11px] font-semibold tracking-wider">
                <th className="p-4">Document Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Associated Entity</th>
                <th className="p-4">Document No.</th>
                <th className="p-4">Upload Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.docId} className="hover:bg-stone-50/80 transition">
                  <td className="p-4 font-bold text-[#0B1320] flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-700 shrink-0" />
                    <div>
                      <p>{doc.title}</p>
                      <p className="text-[10px] text-charcoal/40 font-mono font-normal">{doc.fileSize}</p>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-charcoal">
                    <span className="px-2 py-0.5 rounded bg-stone-100 font-mono text-[11px]">
                      {doc.category}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-charcoal">
                    {doc.entity}
                  </td>
                  <td className="p-4 font-mono text-charcoal/80">
                    {doc.documentNumber}
                  </td>
                  <td className="p-4 text-charcoal/70">
                    {doc.uploadDate}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(doc.status)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {doc.status === 'Pending' && (
                        <button
                          onClick={() => updateDocumentStatus(doc.docId, 'Verified')}
                          className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-[11px] font-semibold hover:bg-emerald-800 transition"
                        >
                          Verify
                        </button>
                      )}
                      <button 
                        onClick={() => alert(`Downloading ${doc.title}...`)}
                        className="p-1.5 text-charcoal/60 hover:text-charcoal hover:bg-stone-100 rounded-lg"
                        title="Download Document"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDocs.length === 0 && (
          <div className="p-12 text-center text-charcoal/60 space-y-2">
            <FileCode className="h-10 w-10 text-stone-300 mx-auto" />
            <p className="font-semibold text-base">No documents found matching filters</p>
            <p className="text-xs text-charcoal/50">Upload new certificates or clear filters.</p>
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-stone-200 shadow-2xl overflow-hidden">
            <div className="p-5 bg-[#0B1320] text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Upload Compliance Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-white/70 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Document Category</label>
                <select
                  value={newDocForm.category}
                  onChange={(e) => setNewDocForm({ ...newDocForm, category: e.target.value as any })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  <option value="RC">RC (Registration Certificate)</option>
                  <option value="Insurance">Commercial Vehicle Insurance</option>
                  <option value="PUC">PUC (Pollution Certificate)</option>
                  <option value="Driving License">Driver License</option>
                  <option value="GST Certificate">GST Certificate</option>
                  <option value="Invoice">Freight Invoice</option>
                  <option value="E-Way Bill">E-Way Bill</option>
                  <option value="Permit">National Goods Permit</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Commercial Fitness Certificate 2026"
                  value={newDocForm.title}
                  onChange={(e) => setNewDocForm({ ...newDocForm, title: e.target.value })}
                  required
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Associated Vehicle / Driver</label>
                <input
                  type="text"
                  placeholder="e.g. TRK-101 (KA-01-MJ-2034)"
                  value={newDocForm.entity}
                  onChange={(e) => setNewDocForm({ ...newDocForm, entity: e.target.value })}
                  required
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Document Number</label>
                <input
                  type="text"
                  placeholder="e.g. RC-KA01MJ2034-2026"
                  value={newDocForm.documentNumber}
                  onChange={(e) => setNewDocForm({ ...newDocForm, documentNumber: e.target.value })}
                  required
                  className="w-full p-2.5 border border-stone-300 rounded-xl font-mono"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-stone-300 rounded-xl text-center bg-stone-50 space-y-2 cursor-pointer hover:bg-stone-100">
                <Upload className="h-6 w-6 text-amber-700 mx-auto" />
                <p className="font-semibold text-charcoal">Click or drag PDF / JPG file here</p>
                <p className="text-[10px] text-charcoal/50">Max file size 10 MB. Encrypted RTO storage.</p>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B1320] text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  Upload & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
