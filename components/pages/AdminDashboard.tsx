'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { 
  ShieldCheck, 
  Building2, 
  Truck as TruckIcon, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Activity
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { 
    transporters, 
    shippers, 
    verifyTransporter, 
    verifyShipper, 
    documents, 
    updateDocumentStatus,
    trucks
  } = useData();

  const [activeTab, setActiveTab] = useState<'transporters' | 'shippers' | 'documents'>('transporters');

  const pendingTransporters = transporters.filter(t => t.status === 'Pending');
  const pendingShippers = shippers.filter(s => s.status === 'Pending');
  const pendingDocs = documents.filter(d => d.status === 'Pending');

  return (
    <div className="h-full overflow-y-auto bg-[#FAF9F6] p-6 text-charcoal font-sans space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-300">
              System Administration
            </span>
            <span className="text-xs text-charcoal/60">Platform Ops Command</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B1320] mt-1">
            Sarathi Sampark Admin Control Center
          </h1>
          <p className="text-sm text-charcoal/70">
            Verify transporter KYC, approve shipper accounts, audit RTO compliance, and manage platform safety.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
          <Activity className="h-4 w-4 text-emerald-600 animate-pulse" />
          <span className="text-xs font-bold text-emerald-900">Platform Operational • 99.9% Uptime</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Pending Transporters</p>
            <p className="text-2xl font-extrabold text-amber-700 mt-1">{pendingTransporters.length}</p>
            <p className="text-xs text-amber-600 font-medium mt-1">Awaiting GST & RTO check</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <TruckIcon className="h-6 w-6 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Pending Shippers</p>
            <p className="text-2xl font-extrabold text-blue-700 mt-1">{pendingShippers.length}</p>
            <p className="text-xs text-blue-600 font-medium mt-1">Enterprise accounts</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Document Audit Queue</p>
            <p className="text-2xl font-extrabold text-purple-700 mt-1">{pendingDocs.length}</p>
            <p className="text-xs text-purple-600 font-medium mt-1">RC, Insurance, Permits</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Verified Fleet Units</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{trucks.length}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Active trucks on platform</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-2">
        <button
          onClick={() => setActiveTab('transporters')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'transporters'
              ? 'bg-[#0B1320] text-white shadow-sm'
              : 'text-charcoal/70 hover:bg-stone-100'
          }`}
        >
          <TruckIcon className="h-4 w-4 text-amber-400" />
          Transporter Verifications ({transporters.length})
        </button>

        <button
          onClick={() => setActiveTab('shippers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'shippers'
              ? 'bg-[#0B1320] text-white shadow-sm'
              : 'text-charcoal/70 hover:bg-stone-100'
          }`}
        >
          <Building2 className="h-4 w-4 text-blue-400" />
          Shipper Enterprise Approvals ({shippers.length})
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'documents'
              ? 'bg-[#0B1320] text-white shadow-sm'
              : 'text-charcoal/70 hover:bg-stone-100'
          }`}
        >
          <FileText className="h-4 w-4 text-purple-400" />
          Document Audit Queue ({documents.length})
        </button>
      </div>

      {activeTab === 'transporters' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-3">
          <div className="p-4 border-b border-stone-100 bg-[#FAF9F6] flex items-center justify-between">
            <h3 className="font-bold text-base text-[#0B1320]">Transporter Account Requests</h3>
            <span className="text-xs text-charcoal/60 font-medium">Verify GST & Fleet Size</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-charcoal/70 uppercase text-[11px] font-semibold">
                  <th className="p-4">ID</th>
                  <th className="p-4">Company Name</th>
                  <th className="p-4">Owner Name</th>
                  <th className="p-4">GST Number</th>
                  <th className="p-4">Fleet Count</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {transporters.map((trn) => (
                  <tr key={trn.id} className="hover:bg-stone-50 transition">
                    <td className="p-4 font-mono font-bold text-[#0B1320]">{trn.id}</td>
                    <td className="p-4 font-bold text-charcoal">{trn.companyName}</td>
                    <td className="p-4 text-charcoal/80">{trn.ownerName}</td>
                    <td className="p-4 font-mono text-charcoal">{trn.gstNumber}</td>
                    <td className="p-4 font-bold text-amber-800">{trn.truckCount} Trucks</td>
                    <td className="p-4 text-charcoal/70">{trn.city}</td>
                    <td className="p-4">
                      {trn.status === 'Verified' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          Verified
                        </span>
                      ) : trn.status === 'Pending' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                          Pending Audit
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-900 border border-rose-300">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {trn.status === 'Pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => verifyTransporter(trn.id, 'Verified')}
                            className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition flex items-center gap-1"
                          >
                            <CheckCircle className="h-3.5 w-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => verifyTransporter(trn.id, 'Rejected')}
                            className="px-3 py-1 bg-rose-700 text-white rounded-lg text-xs font-semibold hover:bg-rose-800 transition flex items-center gap-1"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'shippers' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-3">
          <div className="p-4 border-b border-stone-100 bg-[#FAF9F6] flex items-center justify-between">
            <h3 className="font-bold text-base text-[#0B1320]">Enterprise Shipper Organizations</h3>
            <span className="text-xs text-charcoal/60 font-medium">Verify Corporate Freight Creators</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-charcoal/70 uppercase text-[11px] font-semibold">
                  <th className="p-4">ID</th>
                  <th className="p-4">Shipper Enterprise</th>
                  <th className="p-4">Contact Person</th>
                  <th className="p-4">GST Registration</th>
                  <th className="p-4">Loads Posted</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {shippers.map((shp) => (
                  <tr key={shp.id} className="hover:bg-stone-50 transition">
                    <td className="p-4 font-mono font-bold text-[#0B1320]">{shp.id}</td>
                    <td className="p-4 font-bold text-charcoal">{shp.companyName}</td>
                    <td className="p-4 text-charcoal/80">{shp.contactPerson}</td>
                    <td className="p-4 font-mono text-charcoal">{shp.gstNumber}</td>
                    <td className="p-4 font-bold text-blue-800">{shp.loadsPosted} Loads</td>
                    <td className="p-4 text-charcoal/70">{shp.city}</td>
                    <td className="p-4">
                      {shp.status === 'Verified' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {shp.status === 'Pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => verifyShipper(shp.id, 'Verified')}
                            className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition"
                          >
                            Approve Shipper
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-3">
          <div className="p-4 border-b border-stone-100 bg-[#FAF9F6] flex items-center justify-between">
            <h3 className="font-bold text-base text-[#0B1320]">Document Compliance Audit Queue</h3>
            <span className="text-xs text-charcoal/60 font-medium">Verify RTO Permits & RC Books</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-charcoal/70 uppercase text-[11px] font-semibold">
                  <th className="p-4">Doc ID</th>
                  <th className="p-4">Document Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Entity</th>
                  <th className="p-4">Doc Number</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {documents.map((doc) => (
                  <tr key={doc.docId} className="hover:bg-stone-50 transition">
                    <td className="p-4 font-mono font-bold text-[#0B1320]">{doc.docId}</td>
                    <td className="p-4 font-bold text-charcoal">{doc.title}</td>
                    <td className="p-4 font-mono text-charcoal">{doc.category}</td>
                    <td className="p-4 text-charcoal/80">{doc.entity}</td>
                    <td className="p-4 font-mono text-charcoal">{doc.documentNumber}</td>
                    <td className="p-4 font-bold">{doc.status}</td>
                    <td className="p-4 text-right">
                      {doc.status === 'Pending' && (
                        <button
                          onClick={() => updateDocumentStatus(doc.docId, 'Verified')}
                          className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition"
                        >
                          Approve Document
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
