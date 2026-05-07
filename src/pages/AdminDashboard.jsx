import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { 
  LayoutDashboard, Package, UploadCloud, Users, Truck, Settings, 
  LogOut, Bell, Search, Menu, X, FileSpreadsheet, CheckCircle, 
  AlertCircle, Shield, ChevronRight, Activity
} from 'lucide-react';

// --- MOCK DATA ---
const ROLES = ['Super Admin', 'Tracking Department', 'Warehouse Staff', 'Delivery Department', 'Customer Service'];

const MOCK_SHIPMENTS = [
  { id: 'AKT-1001', customer: 'Kwame Mensah', origin: 'China', status: 'Delivered', date: '2026-05-01' },
  { id: 'AKT-1002', customer: 'Grace Ansah', origin: 'Dubai', status: 'In Transit', date: '2026-05-05' },
  { id: 'AKT-1003', customer: 'Samuel T.', origin: 'Turkey', status: 'Loaded', date: '2026-05-06' },
  { id: 'AKT-1004', customer: 'Abena Osei', origin: 'China', status: 'Received', date: '2026-05-07' },
  { id: 'AKT-1005', customer: 'Daniel Quaye', origin: 'Dubai', status: 'Ready for Pickup', date: '2026-05-06' },
];

const CHART_DATA = [
  { name: 'Mon', shipments: 12 }, { name: 'Tue', shipments: 19 },
  { name: 'Wed', shipments: 15 }, { name: 'Thu', shipments: 22 },
  { name: 'Fri', shipments: 30 }, { name: 'Sat', shipments: 25 },
  { name: 'Sun', shipments: 18 },
];

// --- MODULAR COMPONENTS ---

// 1. Sidebar Component
const Sidebar = ({ currentTab, setCurrentTab, userRole, isMobileOpen, setIsMobileOpen }) => {
  const getMenuByRole = () => {
    const baseMenu = [{ id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> }];
    
    if (userRole === 'Super Admin') {
      return [...baseMenu, 
        { id: 'shipments', label: 'Shipment Management', icon: <Package size={20} /> },
        { id: 'upload', label: 'Excel Upload Center', icon: <UploadCloud size={20} /> },
        { id: 'delivery', label: 'Delivery Ops', icon: <Truck size={20} /> },
        { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
        { id: 'settings', label: 'Settings & Roles', icon: <Settings size={20} /> },
      ];
    }
    if (userRole === 'Warehouse Staff') {
      return [...baseMenu, { id: 'upload', label: 'Excel Upload Center', icon: <UploadCloud size={20} /> }];
    }
    if (userRole === 'Delivery Department') {
      return [...baseMenu, { id: 'delivery', label: 'Delivery Ops', icon: <Truck size={20} /> }];
    }
    return [...baseMenu, { id: 'shipments', label: 'Shipment Tracking', icon: <Package size={20} /> }];
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && <div className="fixed inset-0 bg-blue-900/50 z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />}
      
      <div className={`fixed lg:static inset-y-0 left-0 w-72 bg-blue-900 text-white z-50 transform transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="p-6 border-b border-blue-800 flex justify-between items-center">
          <div>
            <span className="font-bold text-2xl tracking-tight leading-none block">AKT</span>
            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest block">Ops System</span>
          </div>
          <button className="lg:hidden text-white" onClick={() => setIsMobileOpen(false)}><X size={24}/></button>
        </div>

        <div className="flex-grow overflow-y-auto py-6 px-4 space-y-2">
          <p className="text-xs text-blue-400 uppercase font-bold px-4 mb-4">Main Menu</p>
          {getMenuByRole().map(item => (
            <button
              key={item.id}
              onClick={() => { setCurrentTab(item.id); setIsMobileOpen(false); }}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${currentTab === item.id ? 'bg-orange-500 text-white shadow-md' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-blue-800">
          <button className="w-full flex items-center px-4 py-3 text-blue-200 hover:text-white hover:bg-blue-800 rounded-xl transition-all text-sm font-medium">
            <LogOut size={20} className="mr-3" /> Exit Dashboard
          </button>
        </div>
      </div>
    </>
  );
};

// 2. Topbar Component
const TopBar = ({ userRole, setUserRole, setIsMobileOpen }) => (
  <header className="bg-white border-b border-gray-200 h-20 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
    <div className="flex items-center">
      <button className="mr-4 lg:hidden text-blue-900" onClick={() => setIsMobileOpen(true)}><Menu size={24}/></button>
      <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-lg border border-gray-200 w-96 focus-within:ring-2 focus-within:ring-orange-500 focus-within:bg-white transition-all">
        <Search className="text-gray-400 w-5 h-5 mr-2" />
        <input type="text" placeholder="Search tracking ID, customer..." className="bg-transparent border-none outline-none w-full text-sm" />
      </div>
    </div>
    
    <div className="flex items-center space-x-4 sm:space-x-6">
      {/* Role Switcher (For Demo Purposes) */}
      <div className="flex items-center bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
        <Shield className="w-4 h-4 text-orange-500 mr-2 hidden sm:block" />
        <select 
          value={userRole} 
          onChange={(e) => setUserRole(e.target.value)}
          className="bg-transparent text-sm font-bold text-orange-700 outline-none cursor-pointer"
        >
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <button className="relative text-gray-500 hover:text-blue-900 transition-colors">
        <Bell size={24} />
        <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
      </button>
      
      <div className="h-10 w-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold shadow-md">
        {userRole.charAt(0)}
      </div>
    </div>
  </header>
);

// 3. Analytics Overview Component
const OverviewTab = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 sm:space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { title: 'Total Shipments', val: '1,284', icon: <Package />, color: 'bg-blue-50 text-blue-600' },
        { title: 'Active Transit', val: '432', icon: <Truck />, color: 'bg-orange-50 text-orange-600' },
        { title: 'Pending Clearance', val: '84', icon: <AlertCircle />, color: 'bg-red-50 text-red-600' },
        { title: 'Delivered (This Month)', val: '892', icon: <CheckCircle />, color: 'bg-green-50 text-green-600' },
      ].map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center">
          <div className={`p-4 rounded-xl mr-4 ${stat.color}`}>{stat.icon}</div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stat.val}</h3>
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-blue-900 mb-6 flex items-center"><Activity className="mr-2 w-5 h-5"/> Weekly Volume Trends</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Line type="monotone" dataKey="shipments" stroke="#f97316" strokeWidth={4} dot={{r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-blue-900 mb-6">Recent Activity</h3>
        <div className="space-y-6">
          {[
            { msg: 'Excel manifest uploaded', time: '10 mins ago', type: 'upload' },
            { msg: 'AKT-1004 cleared customs', time: '1 hour ago', type: 'success' },
            { msg: 'New admin role assigned', time: '3 hours ago', type: 'system' },
            { msg: 'Delivery rider assigned to AKT-1001', time: '5 hours ago', type: 'delivery' },
          ].map((log, i) => (
            <div key={i} className="flex relative">
              {i !== 3 && <div className="absolute top-6 left-2 w-0.5 h-full bg-gray-100 -ml-px"></div>}
              <div className="relative z-10 w-4 h-4 rounded-full bg-blue-100 border-2 border-white shadow-sm mt-1"></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">{log.msg}</p>
                <p className="text-xs text-gray-500 mt-1">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-6 py-3 text-sm text-blue-600 font-bold bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">View Full Log</button>
      </div>
    </div>
  </motion.div>
);

// 4. Advanced Excel Upload Component
const ExcelUploadTab = () => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);

  const handleUpload = () => {
    setStep(2);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 15;
      setProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setStep(3);
      }
    }, 300);
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-10 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Manifest Import System</h2>
          <p className="text-gray-500">Upload China or Dubai warehouse sheets to auto-update all tracking IDs.</p>
        </div>

        <div className="p-6 sm:p-10">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-10 relative">
            <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
            <div className="absolute left-0 top-1/2 h-1 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
            
            {[1, 2, 3].map(num => (
              <div key={num} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-colors ${step >= num ? 'bg-orange-500 border-white text-white shadow-md' : 'bg-gray-100 border-white text-gray-400'}`}>
                {num}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" exit={{opacity:0}} className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer group" onClick={handleUpload}>
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Drag & Drop Excel File</h3>
                <p className="text-gray-500 mb-6">Supports .xlsx, .csv up to 50MB</p>
                <button className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors">Select File</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{opacity:0}} animate={{opacity:1}} className="py-12 text-center">
                <UploadCloud className="w-16 h-16 text-orange-500 mx-auto mb-6 animate-bounce" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Parsing & Validating Data...</h3>
                <p className="text-gray-500 mb-8">Checking for duplicate tracking IDs and formatting errors.</p>
                <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                  <div className="bg-orange-500 h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-sm font-bold text-orange-600">{progress}% Complete</p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{opacity:0}} animate={{opacity:1}}>
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-green-900">Validation Successful</h4>
                    <p className="text-green-800 text-sm mt-1">Found 142 valid records. 0 duplicates. 0 formatting errors.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                  <button onClick={() => alert("Data pushed to database successfully!")} className="flex-1 py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 shadow-md transition-colors">Confirm & Push to Live System</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// 5. Shipment Management Component
const ShipmentsTab = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-gray-200 shadow-sm">
    <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
      <h2 className="text-xl font-bold text-blue-900">Live Shipments</h2>
      <div className="flex gap-3 w-full sm:w-auto">
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 w-full sm:w-auto">Filter</button>
        <button className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 w-full sm:w-auto">+ Manual Entry</button>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-gray-50 text-gray-500 font-medium">
          <tr>
            <th className="px-6 py-4">Tracking ID</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Origin</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Est. Date</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {MOCK_SHIPMENTS.map((item, i) => (
            <tr key={i} className="hover:bg-blue-50/50 transition-colors">
              <td className="px-6 py-4 font-bold text-blue-900">{item.id}</td>
              <td className="px-6 py-4 text-gray-700">{item.customer}</td>
              <td className="px-6 py-4 text-gray-500">{item.origin}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                  item.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500">{item.date}</td>
              <td className="px-6 py-4">
                <button className="text-blue-600 font-semibold hover:text-blue-900">Manage <ChevronRight className="inline w-4 h-4"/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

// --- MAIN DASHBOARD EXPORT ---
export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [userRole, setUserRole] = useState('Super Admin');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        userRole={userRole}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar userRole={userRole} setUserRole={setUserRole} setIsMobileOpen={setIsMobileOpen} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'overview' && <OverviewTab />}
            {currentTab === 'upload' && <ExcelUploadTab />}
            {currentTab === 'shipments' && <ShipmentsTab />}
            
            {/* Placeholder for other tabs to keep code size reasonable */}
            {['delivery', 'customers', 'settings'].includes(currentTab) && (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <Settings className="w-16 h-16 mb-4 opacity-20" />
                <h2 className="text-xl font-bold text-gray-500">Module Currently in Development</h2>
                <p className="text-sm mt-2">This view is locked for the {userRole} role demonstration.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}