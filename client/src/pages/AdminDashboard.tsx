import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  Truck as TruckIcon, 
  Package, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Search, 
  AlertTriangle,
  Activity,
  Layers,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2
} from 'lucide-react';
import api from '../utils/api';

const AdminDashboard: React.FC = () => {
  const { 
    transporters, 
    shippers, 
    verifyTransporter, 
    verifyShipper, 
    documents, 
    updateDocumentStatus,
    trucks,
    loads
  } = useData();

  const [activeTab, setActiveTab] = useState<'transporters' | 'shippers' | 'documents' | 'contact'>('transporters');
  const [searchTerm, setSearchTerm] = useState('');

  // Contact Inquiries State
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [loadingContact, setLoadingContact] = useState(false);

  useEffect(() => {
    fetchContactMessages();
  }, []);

  const fetchContactMessages = async () => {
    setLoadingContact(true);
    try {
      const data = await api.contact.getAll();
      setContactMessages(data);
    } catch (err) {
      console.error('Failed to fetch contact inquiries:', err);
    } finally {
      setLoadingContact(false);
    }
  };

  const pendingTransporters = transporters.filter(t => t.status === 'Pending');
  const pendingShippers = shippers.filter(s => s.status === 'Pending');
  const pendingDocs = documents.filter(d => d.status === 'Pending');

  return (
    <div className="h-full overflow-y-auto bg-[#FAF9F6] p-6 text-charcoal font-sans space-y-6">
      
      {/* Header */}
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
            Verify transporter KYC, approve shipper accounts, audit RTO compliance, and view customer website inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
          <Activity className="h-4 w-4 text-emerald-600 animate-pulse" />
          <span className="text-xs font-bold text-emerald-900">Platform Operational • MySQL Database Active</span>
        </div>
      </div>

      {/* Admin KPI Cards */}
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
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Website Inquiries</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{contactMessages.length}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Stored in MySQL DB</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <Mail className="h-6 w-6 text-emerald-600" />
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

      {/* Tabs Bar */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('transporters')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'documents'
              ? 'bg-[#0B1320] text-white shadow-sm'
              : 'text-charcoal/70 hover:bg-stone-100'
          }`}
        >
          <FileText className="h-4 w-4 text-purple-400" />
          Document Audit Queue ({documents.length})
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-[#0B1320] text-white shadow-sm'
              : 'text-charcoal/70 hover:bg-stone-100'
          }`}
        >
          <Mail className="h-4 w-4 text-emerald-400" />
          Website Customer Inquiries ({contactMessages.length})
        </button>
      </div>

      {/* Tab 1: TRANSPORTERS */}
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
                            className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => verifyTransporter(trn.id, 'Rejected')}
                            className="px-3 py-1 bg-stone-200 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-100 transition flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
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

      {/* Tab 2: SHIPPERS */}
      {activeTab === 'shippers' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-3">
          <div className="p-4 border-b border-stone-100 bg-[#FAF9F6] flex items-center justify-between">
            <h3 className="font-bold text-base text-[#0B1320]">Enterprise Shipper Registration Requests</h3>
            <span className="text-xs text-charcoal/60 font-medium">Verify Freight Escrow Accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-charcoal/70 uppercase text-[11px] font-semibold">
                  <th className="p-4">ID</th>
                  <th className="p-4">Company Name</th>
                  <th className="p-4">Contact Person</th>
                  <th className="p-4">GST Number</th>
                  <th className="p-4">Loads Posted</th>
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
                    <td className="p-4">
                      {shp.status === 'Verified' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                          Pending Audit
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {shp.status === 'Pending' && (
                        <button
                          onClick={() => verifyShipper(shp.id, 'Verified')}
                          className="px-3 py-1 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition flex items-center gap-1 cursor-pointer ml-auto"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Approve Shipper
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

      {/* Tab 3: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-3">
          <div className="p-4 border-b border-stone-100 bg-[#FAF9F6] flex items-center justify-between">
            <h3 className="font-bold text-base text-[#0B1320]">Digital Compliance Documents Queue</h3>
            <span className="text-xs text-charcoal/60 font-medium">Verify RTO, RC & Insurance Uploads</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-charcoal/70 uppercase text-[11px] font-semibold">
                  <th className="p-4">Doc ID</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Vehicle / Driver</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {documents.map((doc) => (
                  <tr key={doc.docId} className="hover:bg-stone-50 transition">
                    <td className="p-4 font-mono font-bold text-[#0B1320]">{doc.docId}</td>
                    <td className="p-4 font-bold text-charcoal">{doc.title}</td>
                    <td className="p-4 text-charcoal/80">{doc.category}</td>
                    <td className="p-4 font-bold text-stone-800">{doc.entity}</td>
                    <td className="p-4">
                      {doc.status === 'Verified' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-900 border border-purple-300">
                          Pending Audit
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {doc.status !== 'Verified' && (
                        <button
                          onClick={() => updateDocumentStatus(doc.docId, 'Verified')}
                          className="px-3 py-1 bg-purple-700 text-white rounded-lg text-xs font-semibold hover:bg-purple-800 transition flex items-center gap-1 cursor-pointer ml-auto"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Mark Verified
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

      {/* Tab 4: WEBSITE CUSTOMER INQUIRIES & CONTACT MESSAGES */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-3">
          <div className="p-4 border-b border-stone-100 bg-[#FAF9F6] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#0B1320]">Website Customer Inquiries & Contact Submissions</h3>
              <p className="text-xs text-charcoal/60 mt-0.5">Queries submitted by users on the homepage contact form (Persisted in MySQL table <code className="font-mono text-amber-800">contact_messages</code>)</p>
            </div>
            <button 
              onClick={fetchContactMessages}
              className="px-3 py-1.5 bg-stone-100 border border-stone-300 text-charcoal font-bold rounded-xl text-xs hover:bg-stone-200 cursor-pointer"
            >
              Refresh Submissions
            </button>
          </div>

          {loadingContact ? (
            <div className="p-8 text-center text-xs text-charcoal/60 font-semibold">
              Loading customer inquiries from MySQL...
            </div>
          ) : contactMessages.length === 0 ? (
            <div className="p-8 text-center text-xs text-charcoal/60 font-semibold">
              No customer website inquiries received yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-charcoal/70 uppercase text-[11px] font-semibold">
                    <th className="p-4">Date</th>
                    <th className="p-4">Sender Name</th>
                    <th className="p-4">Contact Email & Phone</th>
                    <th className="p-4">Company</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Full Query Message</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {contactMessages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-stone-50 transition">
                      <td className="p-4 text-charcoal/60 font-mono text-[11px]">
                        {msg.created_at ? new Date(msg.created_at).toLocaleString() : 'Just now'}
                      </td>
                      <td className="p-4 font-bold text-[#0B1320]">{msg.name}</td>
                      <td className="p-4 text-charcoal">
                        <p className="font-bold text-amber-800">{msg.email}</p>
                        <p className="text-[11px] text-charcoal/60">{msg.mobile || 'No mobile'}</p>
                      </td>
                      <td className="p-4 font-semibold text-stone-700">{msg.company || 'Individual'}</td>
                      <td className="p-4 font-bold text-[#0B1320]">{msg.subject}</td>
                      <td className="p-4 max-w-xs text-charcoal/80 leading-relaxed bg-stone-50/80 rounded-xl p-3 border border-stone-200 text-[11px]">
                        "{msg.message}"
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          <span>Stored in DB</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
