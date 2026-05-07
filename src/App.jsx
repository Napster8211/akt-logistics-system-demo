import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Package, Plane, Ship, MapPin, Phone, Mail, CheckCircle, 
  Clock, Shield, ArrowRight, Menu, X, Search, ChevronRight, 
  MessageCircle, Anchor, Globe, Truck, Quote, Calculator, Box, Info,
  Upload, FileSpreadsheet, AlertCircle, Database, LayoutDashboard, 
  UploadCloud, Users, Settings, LogOut, Bell, Activity
} from 'lucide-react';

// --- DATA & CONTENT ---
const COMPANY_NAME = "AKT Shipping & Logistics";
const PHONE_NUMBER = "+233240716504";
const WHATSAPP_LINK = "https://wa.me/233240716504";
const EMAIL = "hello@aktshipping.com";
const ADDRESS = "Tantra-Hills, Golden Door-Adjacent ICGC Potters Temple, Accra, Ghana";

const TESTIMONIALS = [
  { name: "Kwame O.", business: "Electronics Importer, Makola", text: "AKT is the most reliable forwarder I've used. My goods from Shenzhen arrived in exactly 4 days via air freight. The tracking system saved me hours of WhatsApp back-and-forth." },
  { name: "Grace A.", business: "Boutique Owner, Osu", text: "As a first-time importer from Dubai, I was nervous. The AKT team guided me through procurement, handled the customs, and delivered right to my shop. Highly recommended!" },
  { name: "Samuel T.", business: "Auto Parts Dealer", text: "Their sea freight LCL service is top-notch. Transparent pricing, no hidden fees at the port. They are true professionals." }
];

const FAQS = [
  { q: "How long does Air Freight take from China to Ghana?", a: "Air freight typically takes 3-5 business days from the time your goods leave our China warehouse to arrival in Accra." },
  { q: "How do you charge for Sea Freight?", a: "Sea freight is charged per Cubic Meter (CBM). Our rates are all-inclusive of customs clearing, meaning no surprise fees at Tema port." },
  { q: "Can you help me pay my suppliers in China or Dubai?", a: "Yes! We offer procurement assistance. You pay us in Cedis, and we pay your suppliers in RMB or AED, saving you the hassle of forex conversion." },
  { q: "Do I need to come to your office to clear my goods?", a: "No. We handle full customs clearance. You can pick up your goods at our Spintex warehouse or request doorstep delivery." }
];

const MOCK_SHIPMENT_DATA = [
  { trackingId: 'AKT-1001', customerName: 'Kwame Mensah', shippingMark: 'K.M. ELEC', origin: 'Guangzhou, China', status: 'Arrived', containerDate: 'April 10, 2026', eta: 'May 2, 2026', mode: 'Sea Freight', weight: '150 KG', cbm: '0.8' },
  { trackingId: 'AKT-1002', customerName: 'Grace Ansah', shippingMark: 'GRACE BTQ', origin: 'Dubai, UAE', status: 'In Transit', containerDate: 'May 1, 2026', eta: 'May 8, 2026', mode: 'Air Freight', weight: '45 KG', cbm: '0.2' },
  { trackingId: 'AKT-1003', customerName: 'Samuel T.', shippingMark: 'SAM AUTO', origin: 'Istanbul, Turkey', status: 'Loaded', containerDate: 'May 4, 2026', eta: 'May 12, 2026', mode: 'Air Freight', weight: '120 KG', cbm: '0.5' },
  { trackingId: 'AKT-1004', customerName: 'Abena Osei', shippingMark: 'AO-04', origin: 'Guangzhou, China', status: 'Received', containerDate: 'Pending', eta: 'TBD', mode: 'Sea Freight', weight: '500 KG', cbm: '2.5' },
  { trackingId: 'AKT-1005', customerName: 'Daniel Quaye', shippingMark: 'DQ-TECH', origin: 'Dubai, UAE', status: 'Arrived', containerDate: 'April 25, 2026', eta: 'May 4, 2026', mode: 'Air Freight', weight: '80 KG', cbm: '0.4' }
];

// --- ADMIN DASHBOARD MOCK DATA ---
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

// --- COMPONENTS ---

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-md font-semibold transition-all duration-300 flex items-center justify-center text-center";
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-blue-900 hover:bg-blue-800 text-white",
    outline: "border-2 border-blue-900 text-blue-900 hover:bg-blue-50",
    whatsapp: "bg-green-500 hover:bg-green-600 text-white shadow-lg",
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- ADMIN DASHBOARD COMPONENTS ---

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

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [userRole, setUserRole] = useState('Super Admin');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50 font-sans overflow-hidden mt-16 sm:mt-20">
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
};

// --- PAGES ---

const EstimatorPage = () => {
  const [inputs, setInputs] = useState({ length: '', width: '', height: '', qty: '1', origin: 'China', method: 'NotSure' });
  const [result, setResult] = useState(null);
  const [lead, setLead] = useState({ name: '', phone: '' });

  const SEA_FREIGHT_RATE_PER_CBM = 250;
  const AIR_FREIGHT_RATE_PER_KG = 45;

  const handleCalculate = (e) => {
    e.preventDefault();
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const h = parseFloat(inputs.height) || 0;
    const q = parseInt(inputs.qty) || 1;

    const cbm = (l * w * h * q) / 1000000;
    const volWeight = (l * w * h * q) / 6000;

    let recommended = 'Sea Freight';
    let isAirRecommended = false;
    
    if (cbm < 0.5) {
      recommended = 'Air Freight';
      isAirRecommended = true;
    }

    let calculatedMethod = inputs.method === 'NotSure' ? recommended : (inputs.method === 'Air' ? 'Air Freight' : 'Sea Freight');
    
    let baseCost = 0;
    let eta = '';
    
    if (calculatedMethod === 'Air Freight') {
      baseCost = volWeight * AIR_FREIGHT_RATE_PER_KG;
      eta = '3-5 Days';
    } else {
      baseCost = cbm * SEA_FREIGHT_RATE_PER_CBM;
      eta = '35-45 Days';
    }

    setResult({
      cbm: cbm.toFixed(3),
      volWeight: volWeight.toFixed(2),
      costMin: (baseCost * 0.85).toFixed(0),
      costMax: (baseCost * 1.15).toFixed(0),
      recommended,
      isAirRecommended,
      calculatedMethod,
      eta
    });
  };

  const handleSaveEstimate = () => {
    console.log("Saving estimate lead to database:", { ...inputs, ...result, ...lead });
  };

  const handleWhatsAppConversion = (e) => {
    e.preventDefault();
    if(!lead.name || !lead.phone) return; 
    
    handleSaveEstimate();
    
    const msg = `Hello AKT, I used the Cost Estimator:\n\n📦 *Volume:* ${result.cbm} CBM\n⚖️ *Vol. Weight:* ${result.volWeight} KG\n🌍 *Origin:* ${inputs.origin}\n🚢 *Method:* ${result.calculatedMethod}\n💰 *Est. Cost:* GHS ${result.costMin} - ${result.costMax}\n\nMy name is ${lead.name} (${lead.phone}). Please assist with an exact quote.`;
    window.open(`https://wa.me/233240716504?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-12 animate-fadeIn px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-4 flex items-center justify-center">
            <Calculator className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 text-orange-500 flex-shrink-0" /> 
            <span className="leading-tight">CBM & Cost Estimator</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Calculate your cargo volume and get instant shipping estimates from China, Dubai, or Turkey to Ghana. No hidden charges.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-8 h-fit">
            <h2 className="text-lg sm:text-xl font-bold text-blue-900 mb-5 sm:mb-6 border-b pb-4 flex items-center">
              <Box className="w-5 h-5 mr-2 text-orange-500" /> Cargo Dimensions
            </h2>
            <form onSubmit={handleCalculate} className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Length (cm)</label>
                  <input type="number" required min="1" value={inputs.length} onChange={e => setInputs({...inputs, length: e.target.value})} className="w-full text-sm sm:text-base px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Width (cm)</label>
                  <input type="number" required min="1" value={inputs.width} onChange={e => setInputs({...inputs, width: e.target.value})} className="w-full text-sm sm:text-base px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                  <input type="number" required min="1" value={inputs.height} onChange={e => setInputs({...inputs, height: e.target.value})} className="w-full text-sm sm:text-base px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input type="number" required min="1" value={inputs.qty} onChange={e => setInputs({...inputs, qty: e.target.value})} className="w-full text-sm sm:text-base px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500" placeholder="1" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Origin</label>
                  <select value={inputs.origin} onChange={e => setInputs({...inputs, origin: e.target.value})} className="w-full text-sm sm:text-base px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 bg-white">
                    <option value="China">China</option>
                    <option value="Dubai">Dubai (UAE)</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Preferred Method</label>
                  <select value={inputs.method} onChange={e => setInputs({...inputs, method: e.target.value})} className="w-full text-sm sm:text-base px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 bg-white">
                    <option value="NotSure">I'm not sure (Recommend me)</option>
                    <option value="Air">Air Freight</option>
                    <option value="Sea">Sea Freight</option>
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full py-4 text-base sm:text-lg shadow-md mt-2">Calculate Estimate</Button>
            </form>
          </div>

          <div className="lg:col-span-5">
            {!result ? (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 sm:p-8 h-full flex flex-col items-center justify-center text-center min-h-[300px]">
                <Calculator className="w-12 h-12 sm:w-16 sm:h-16 text-blue-200 mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-2">Ready to Estimate</h3>
                <p className="text-gray-500 text-xs sm:text-sm">Enter your dimensions to instantly calculate your CBM and shipping costs.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-fadeIn">
                <div className="bg-blue-900 p-6 sm:p-8 text-white text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10"><Calculator className="w-32 h-32 -mt-4 -mr-4" /></div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 relative z-10">Estimated Cost Range</h3>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-orange-500 tracking-tight mt-2 relative z-10 flex items-center justify-center flex-wrap">
                    <span className="text-base sm:text-lg text-orange-300 mr-2">GHS</span> 
                    {result.costMin} 
                    <span className="text-lg sm:text-xl font-medium text-white mx-2">-</span> 
                    {result.costMax}
                  </div>
                  <p className="text-blue-200 text-xs sm:text-sm mt-3 flex items-center justify-center font-medium relative z-10">
                    <Clock className="w-4 h-4 mr-1" /> Est. Transit: {result.eta}
                  </p>
                </div>
                
                <div className="p-5 sm:p-6 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Total Volume</p>
                      <p className="text-lg sm:text-xl font-bold text-blue-900">{result.cbm} <span className="text-xs sm:text-sm text-gray-500 font-normal">CBM</span></p>
                    </div>
                    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Volumetric Wt.</p>
                      <p className="text-lg sm:text-xl font-bold text-blue-900">{result.volWeight} <span className="text-xs sm:text-sm text-gray-500 font-normal">KG</span></p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  {inputs.method === 'NotSure' && (
                    <div className={`mb-5 sm:mb-6 p-4 rounded-lg flex items-start ${result.isAirRecommended ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'}`}>
                      <Info className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${result.isAirRecommended ? 'text-blue-500' : 'text-green-500'}`} />
                      <div>
                        <p className={`font-bold text-xs sm:text-sm ${result.isAirRecommended ? 'text-blue-900' : 'text-green-900'}`}>💡 Smart Recommendation</p>
                        <p className={`text-xs sm:text-sm mt-1 ${result.isAirRecommended ? 'text-blue-800' : 'text-green-800'}`}>
                          Based on your cargo size ({result.cbm} CBM), <strong>{result.recommended}</strong> is the most cost-effective and optimal option.
                        </p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleWhatsAppConversion} className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 border-t pt-4">Lock in this estimate & chat with an agent:</p>
                    </div>
                    <input 
                      type="text" 
                      required 
                      value={lead.name}
                      onChange={e => setLead({...lead, name: e.target.value})}
                      placeholder="Your Full Name" 
                      className="w-full text-sm sm:text-base px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
                    />
                    <input 
                      type="tel" 
                      required 
                      value={lead.phone}
                      onChange={e => setLead({...lead, phone: e.target.value})}
                      placeholder="WhatsApp Number" 
                      className="w-full text-sm sm:text-base px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
                    />
                    <Button variant="whatsapp" type="submit" className="w-full py-4 text-sm sm:text-base lg:text-lg mt-2 font-bold">
                      <MessageCircle className="w-5 h-5 mr-2" /> Get Exact Quote
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = ({ navigate }) => (
  <div className="animate-fadeIn">
    <section className="relative bg-blue-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700 via-blue-900 to-black"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-32 relative z-10 flex flex-col lg:flex-row items-center">
        <div className="lg:w-3/5 text-center lg:text-left mb-10 lg:mb-0">
          <div className="inline-flex items-center justify-center bg-blue-800 rounded-full px-4 py-2 mb-6 text-xs sm:text-sm font-medium text-blue-100">
            <span className="flex h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Accra-Based Freight Forwarding Experts
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-tight">
            Fast & Reliable Shipping from <span className="text-orange-500">China & Dubai</span> to Ghana
          </h1>
          <p className="text-base sm:text-lg text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0">
            Skip the stress of importing. We handle air & sea freight, customs clearance, and doorstep delivery with absolute transparency. Zero hidden fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <Button onClick={() => navigate('track')} className="text-base sm:text-lg w-full sm:w-auto">
              <Search className="w-5 h-5 mr-2" /> Track Shipment
            </Button>
            <Button variant="outline" onClick={() => navigate('quote')} className="text-base sm:text-lg bg-transparent border-white text-white hover:bg-white hover:text-blue-900 w-full sm:w-auto">
              Get a Quote
            </Button>
          </div>
          
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-blue-200">
            <div className="flex items-center justify-center"><Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500"/> 100% Secure</div>
            <div className="flex items-center justify-center"><Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500"/> Fast Transit</div>
            <div className="flex items-center justify-center"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500"/> Customs Cleared</div>
          </div>
        </div>
        
        <div className="lg:w-2/5 w-full max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-2xl p-5 sm:p-6 text-gray-800">
            <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-2 sm:mb-4 flex items-center">
              <Package className="mr-2 flex-shrink-0" /> Quick Tracking
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-4">Enter your AKT tracking ID to get real-time updates.</p>
            <form onSubmit={(e) => { e.preventDefault(); navigate('track'); }} className="space-y-3 sm:space-y-4">
              <input 
                type="text" 
                placeholder="e.g. AKT-84729" 
                className="w-full text-sm sm:text-base px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Button type="submit" className="w-full py-3">Track Now</Button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-6 sm:-mt-10 mb-8 sm:mb-12">
      <div className="bg-white rounded-xl shadow-xl p-5 sm:p-6 md:p-8 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center text-center md:text-left flex-col md:flex-row w-full md:w-auto">
          <div className="bg-orange-100 p-3 rounded-full mb-3 md:mb-0 md:mr-4">
            <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-1">Instant Cost Estimator</h3>
            <p className="text-xs sm:text-sm text-gray-600">Calculate CBM and get an estimated shipping cost instantly.</p>
          </div>
        </div>
        <Button onClick={() => navigate('estimator')} className="w-full md:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base lg:text-lg">
          Calculate Cost
        </Button>
      </div>
    </div>

    <section className="bg-gray-50 py-10 sm:py-12 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-1 sm:mb-2">5,000+</div>
            <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">Shipments</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-1 sm:mb-2">3</div>
            <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">Global Hubs</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-1 sm:mb-2">99%</div>
            <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">On-Time</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-1 sm:mb-2">24/7</div>
            <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">Support</div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-3 sm:mb-4">Logistics Solutions Designed for You</h2>
          <p className="text-sm sm:text-base text-gray-600">Whether you are a first-time importer or a large wholesaler, we provide tailored end-to-end solutions to get your goods to Ghana safely.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            { title: 'Air Freight', icon: <Plane className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />, desc: 'Fastest delivery from China, Dubai & Turkey. 3-5 days transit. Ideal for high-value or urgent goods.' },
            { title: 'Sea Freight (LCL & FCL)', icon: <Ship className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />, desc: 'Cost-effective shipping for bulk orders. Billed by CBM. Transparent pricing inclusive of customs clearing.' },
            { title: 'Procurement & Payment', icon: <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />, desc: 'Struggling to pay suppliers? Pay us in Ghana Cedis, and we will settle your suppliers in RMB or AED.' },
          ].map((service, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-6 sm:p-8 hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="bg-white w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-md mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-2 sm:mb-3">{service.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{service.desc}</p>
              <button onClick={() => navigate('services')} className="text-orange-500 text-sm sm:text-base font-semibold flex items-center hover:text-orange-600">
                Learn more <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-12 sm:py-16 lg:py-20 bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">How It Works</h2>
          <p className="text-sm sm:text-base text-blue-200">Importing to Ghana has never been this simple.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-blue-800 -translate-y-1/2 z-0"></div>
          
          {[
            { step: '01', title: 'Get Our Address', desc: 'Register to get our warehouse addresses in China or Dubai.' },
            { step: '02', title: 'Send Your Goods', desc: 'Have your supplier deliver your goods to our warehouse.' },
            { step: '03', title: 'We Ship & Clear', desc: 'We load, ship, and handle all customs clearing at Tema/Kotoka.' },
            { step: '04', title: 'Pickup / Delivery', desc: 'Collect from our Spintex office or get doorstep delivery.' }
          ].map((item, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-500 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold shadow-lg mb-4 sm:mb-6 border-4 border-blue-900">
                {item.step}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-blue-200">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-12 sm:py-16 lg:py-20 bg-orange-500 text-white text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight">Ready to Import Without the Stress?</h2>
        <p className="text-base sm:text-lg mb-8 sm:mb-10 opacity-90">Join hundreds of Ghanaian businesses that trust AKT for their freight forwarding needs.</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button variant="secondary" onClick={() => navigate('quote')} className="text-base sm:text-lg px-8 w-full sm:w-auto">
            Get a Free Quote
          </Button>
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="inline-block w-full sm:w-auto">
            <Button variant="whatsapp" className="text-base sm:text-lg px-8 w-full">
              <MessageCircle className="w-5 h-5 mr-2" /> Chat on WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </section>
  </div>
);

const TrackPage = () => {
  const [trackingId, setTrackingId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingId) return;
    
    setIsSearching(true);
    setResult(null);
    setError('');
    
    setTimeout(() => {
      setIsSearching(false);
      const searchStr = trackingId.toUpperCase().trim();
      const foundItem = MOCK_SHIPMENT_DATA.find(item => item.trackingId === searchStr);
      
      if (foundItem) {
        setResult(foundItem);
      } else {
        setError(`Tracking ID "${searchStr}" not found. Please check your ID and try again.`);
      }
    }, 800);
  };

  const statusMap = { 'Received': 0, 'Loaded': 1, 'In Transit': 2, 'Arrived': 3 };
  const currentStepIndex = result ? statusMap[result.status] || 0 : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-12 px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">Track Your Shipment</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Enter your tracking ID to see real-time status updates.</p>
          
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <input 
              type="text" 
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g. AKT-1001" 
              className="w-full sm:flex-grow px-4 sm:px-5 py-3.5 sm:py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-lg"
              required
            />
            <Button type="submit" disabled={isSearching} className="w-full sm:w-auto py-3.5 sm:py-4 px-8 text-base sm:text-lg">
              {isSearching ? 'Searching...' : 'Track'}
            </Button>
          </form>

          {error && (
            <div className="animate-fadeIn mb-6 sm:mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-red-800">{error}</p>
            </div>
          )}

          {result && (
            <div className="animate-fadeIn border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-blue-900 text-white p-5 sm:p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
                <div>
                  <p className="text-blue-200 text-xs sm:text-sm uppercase tracking-wider font-semibold mb-1">Tracking ID</p>
                  <p className="text-2xl sm:text-3xl font-bold break-all">{result.trackingId}</p>
                </div>
                <div className="bg-blue-800 rounded-lg p-3 sm:p-4 w-full md:w-auto border border-blue-700 shadow-inner text-left md:text-right">
                  <p className="text-blue-200 text-xs sm:text-sm uppercase tracking-wider font-semibold mb-1">Current Status</p>
                  <span className="inline-flex items-center px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-orange-500 text-white shadow-md">
                    {result.status !== 'Arrived' && <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>}
                    {result.status === 'Arrived' && <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white mr-2" />}
                    {result.status}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 md:p-8 bg-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border-b border-gray-100 pb-6 sm:pb-8 mb-6 sm:mb-8">
                  <div><span className="text-xs sm:text-sm text-gray-500 uppercase font-semibold">Customer</span><br/><span className="text-sm sm:text-lg font-bold text-gray-800">{result.customerName}</span></div>
                  <div><span className="text-xs sm:text-sm text-gray-500 uppercase font-semibold">Mark</span><br/><span className="text-sm sm:text-lg font-bold text-gray-800">{result.shippingMark}</span></div>
                  <div><span className="text-xs sm:text-sm text-gray-500 uppercase font-semibold">Origin</span><br/><span className="text-sm sm:text-lg font-bold text-gray-800">{result.origin}</span></div>
                  <div><span className="text-xs sm:text-sm text-gray-500 uppercase font-semibold">Est. Delivery</span><br/><span className="text-sm sm:text-lg font-bold text-orange-600">{result.eta}</span></div>
                  
                  <div><span className="text-xs sm:text-sm text-gray-500 uppercase font-semibold">Container Date</span><br/><span className="text-xs sm:text-sm font-medium text-gray-800">{result.containerDate}</span></div>
                  <div><span className="text-xs sm:text-sm text-gray-500 uppercase font-semibold">Mode</span><br/><span className="text-xs sm:text-sm font-medium text-gray-800">{result.mode}</span></div>
                  <div><span className="text-xs sm:text-sm text-gray-500 uppercase font-semibold">Weight</span><br/><span className="text-xs sm:text-sm font-medium text-gray-800">{result.weight}</span></div>
                  <div><span className="text-xs sm:text-sm text-gray-500 uppercase font-semibold">CBM</span><br/><span className="text-xs sm:text-sm font-medium text-gray-800">{result.cbm}</span></div>
                </div>

                <div>
                  <h4 className="font-bold text-lg sm:text-xl text-blue-900 mb-5 sm:mb-6 flex items-center">
                    <Truck className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-orange-500" /> Shipment Progress
                  </h4>
                  <div className="pl-2 sm:pl-4">
                    {['Received at warehouse', 'Loaded for shipment', 'In transit to Ghana', 'Arrived & Ready'].map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isActive = idx === currentStepIndex;
                      const isLast = idx === 3;

                      return (
                        <div key={idx} className="flex relative pb-6 sm:pb-8">
                          {!isLast && (
                            <div className={`absolute top-5 sm:top-6 left-[9px] sm:left-2.5 w-0.5 h-full -ml-px ${isCompleted && idx < currentStepIndex ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                          )}
                          <div className={`relative z-10 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-4 mt-1 bg-white transition-colors duration-300 ${
                            isCompleted ? 'border-orange-500' : 'border-gray-300'
                          }`}>
                            {isActive && <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20"></div>}
                          </div>
                          <div className="ml-4 sm:ml-6">
                            <p className={`font-bold text-sm sm:text-lg leading-none mt-1 sm:mt-0 ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{step}</p>
                            {isActive && <p className="text-xs sm:text-sm text-orange-600 font-medium mt-1">Current Status</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const QuotePage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-12 px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-3 sm:mb-4">Request a Shipping Quote</h1>
          <p className="text-sm sm:text-base text-gray-600">Fill out the form below and our team will get back to you with pricing within 2 hours.</p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10 text-center animate-fadeIn">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-3 sm:mb-4">Quote Request Sent!</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Thank you. One of our agents will contact you shortly via WhatsApp or Email with your customized quote.</p>
            <Button onClick={() => setSubmitted(false)} className="w-full sm:w-auto mx-auto text-sm sm:text-base">Submit Another Request</Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" required className="w-full text-sm sm:text-base px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Kwame Mensah" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                  <input type="tel" required className="w-full text-sm sm:text-base px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="+233 55 000 0000" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Origin Country</label>
                  <select required className="w-full text-sm sm:text-base px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                    <option value="">Select Origin</option>
                    <option value="China">China</option>
                    <option value="Dubai">Dubai (UAE)</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Shipping Method</label>
                  <select required className="w-full text-sm sm:text-base px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                    <option value="">Select Method</option>
                    <option value="Air">Air Freight (Fast)</option>
                    <option value="Sea">Sea Freight (Economical)</option>
                    <option value="NotSure">I'm not sure</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Type of Goods</label>
                <input type="text" required className="w-full text-sm sm:text-base px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. Electronics, Clothing, Auto Parts" />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Estimated Weight / CBM (Optional)</label>
                <input type="text" className="w-full text-sm sm:text-base px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. 50kg or 2 CBM" />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea rows="3" className="w-full text-sm sm:text-base px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Any specific requirements?"></textarea>
              </div>

              <Button type="submit" className="w-full py-4 text-base sm:text-lg">Request Quote Now</Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const ServicesPage = ({ navigate }) => (
  <div className="pt-24 sm:pt-28 pb-12 animate-fadeIn px-4">
    <div className="bg-blue-900 text-white py-12 sm:py-16 rounded-xl sm:rounded-none -mx-4 sm:mx-0 px-4 sm:px-0">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Our Services</h1>
        <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">Comprehensive logistics solutions tailored for Ghanaian businesses importing from global markets.</p>
      </div>
    </div>

    <div className="max-w-7xl mx-auto py-10 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <Plane className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 mb-5 sm:mb-6" />
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-3 sm:mb-4">Air Freight</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">When speed is your priority. We offer daily flights from major hubs in China, Dubai, and Turkey direct to Kotoka International Airport (ACC).</p>
          <ul className="space-y-3 mb-6 sm:mb-8">
            <li className="flex items-center text-sm sm:text-base text-gray-700"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0"/> 3-5 days transit time</li>
            <li className="flex items-center text-sm sm:text-base text-gray-700"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0"/> Custom clearance included</li>
            <li className="flex items-center text-sm sm:text-base text-gray-700"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0"/> Minimum weight: 1kg</li>
          </ul>
          <Button onClick={() => navigate('quote')} variant="outline" className="w-full">Get Air Quote</Button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <Ship className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 mb-5 sm:mb-6" />
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-3 sm:mb-4">Sea Freight (LCL & FCL)</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">The most cost-effective way to import bulk items. Whether you need a full container (FCL) or just space for a few boxes (LCL).</p>
          <ul className="space-y-3 mb-6 sm:mb-8">
            <li className="flex items-center text-sm sm:text-base text-gray-700"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0"/> 35-45 days transit time</li>
            <li className="flex items-center text-sm sm:text-base text-gray-700"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0"/> Pricing per CBM</li>
            <li className="flex items-center text-sm sm:text-base text-gray-700"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0"/> Handled securely at Tema Port</li>
          </ul>
          <Button onClick={() => navigate('quote')} variant="outline" className="w-full">Get Sea Quote</Button>
        </div>
      </div>

      <div className="bg-orange-50 rounded-2xl p-6 sm:p-8 md:p-12 mb-12 sm:mb-16 flex flex-col md:flex-row items-center gap-6 sm:gap-8 border border-orange-100">
        <div className="w-full md:w-2/3 text-center md:text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 mb-3 sm:mb-4">Supplier Payment & Procurement</h2>
          <p className="text-gray-700 text-sm sm:text-lg mb-3 sm:mb-4">
            Don't let forex issues stop your business. We help importers pay their suppliers directly in China and Dubai. 
          </p>
          <p className="text-gray-700 text-sm sm:text-base">
            Simply pay us the equivalent in Ghana Cedis, and we will settle your supplier the same day. Safe, transparent, and fast.
          </p>
        </div>
        <div className="w-full md:w-1/3 mt-4 md:mt-0">
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="block">
            <Button variant="primary" className="w-full py-4 text-sm sm:text-base"><MessageCircle className="w-5 h-5 mr-2"/> Chat with Procurement</Button>
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-900 mb-8 sm:mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4 sm:space-y-6">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-base sm:text-lg text-blue-900 mb-2">{faq.q}</h3>
              <p className="text-sm sm:text-base text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);

  // Custom Navigation logic handling Browser History (Back Button Fix)
  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    window.history.pushState({ page: pageId }, '', `#${pageId}`);
  };

  useEffect(() => {
    // Check initial hash on load
    const initPage = window.location.hash.replace('#', '') || 'home';
    setCurrentPage(initPage);
    window.history.replaceState({ page: initPage }, '', `#${initPage}`);

    // Listen for back button press
    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
      } else {
        setCurrentPage(window.location.hash.replace('#', '') || 'home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  }, [currentPage]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'track', label: 'Track' },
    { id: 'estimator', label: 'Cost Estimator' },
    { id: 'quote', label: 'Quote' }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900 overflow-x-hidden w-full">
      <nav className="fixed top-0 w-full bg-white shadow-md z-50 transition-all">
        <div className="bg-blue-900 text-white text-[10px] sm:text-xs py-2 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            <div className="flex space-x-4">
              <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {ADDRESS}</span>
              <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> Mon-Sat: 8am - 6pm</span>
            </div>
            <div className="flex space-x-4">
              <span className="flex items-center"><Phone className="w-3 h-3 mr-1"/> {PHONE_NUMBER}</span>
              <span className="flex items-center"><Mail className="w-3 h-3 mr-1"/> {EMAIL}</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => handleNavigate('home')}
            >
              <div className="bg-blue-900 p-1.5 sm:p-2 rounded-lg mr-2">
                <Anchor className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="font-bold text-lg sm:text-xl text-blue-900 tracking-tight block leading-none">AKT</span>
                <span className="text-[9px] sm:text-[10px] text-orange-500 font-bold uppercase tracking-widest block">Logistics</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`font-semibold text-sm lg:text-base transition-colors ${
                    currentPage === item.id ? 'text-orange-500' : 'text-gray-600 hover:text-blue-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex space-x-3 border-l pl-6 lg:pl-8 border-gray-200">
                <button onClick={() => handleNavigate('track')} className="border-2 border-blue-900 text-blue-900 hover:bg-blue-50 py-2 px-4 rounded-md text-sm font-semibold transition-all">
                  Track
                </button>
                <button onClick={() => handleNavigate('quote')} className="bg-orange-500 hover:bg-orange-600 text-white shadow-md py-2 px-4 rounded-md text-sm font-semibold transition-all">
                  Get Quote
                </button>
              </div>
            </div>

            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-blue-900 p-2 focus:outline-none"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6 sm:w-7 sm:h-7" /> : <Menu className="w-6 h-6 sm:w-7 sm:h-7" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0 right-0 max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="px-4 pt-2 pb-8 space-y-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`block w-full text-left px-4 py-4 text-base font-semibold rounded-md ${
                    currentPage === item.id ? 'bg-blue-50 text-orange-500' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 flex flex-col space-y-3 px-2">
                <Button variant="outline" onClick={() => handleNavigate('track')} className="w-full py-4 text-base">Track Shipment</Button>
                <Button variant="primary" onClick={() => handleNavigate('quote')} className="w-full py-4 text-base">Get a Quote</Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow w-full max-w-[100vw]">
        {currentPage === 'home' && <HomePage navigate={handleNavigate} />}
        {currentPage === 'services' && <ServicesPage navigate={handleNavigate} />}
        {currentPage === 'track' && <TrackPage />}
        {currentPage === 'estimator' && <EstimatorPage />}
        {currentPage === 'quote' && <QuotePage />}
        {currentPage === 'admin' && <AdminDashboard />}
      </main>

      {currentPage !== 'admin' && (
        <footer className="bg-blue-900 text-blue-200 py-10 sm:py-12 border-t-4 border-orange-500 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
              <div className="col-span-1">
                <div className="flex items-center mb-4">
                  <div className="bg-white p-1.5 rounded mr-2">
                    <Anchor className="text-blue-900 w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg sm:text-xl text-white">AKT Logistics</span>
                </div>
                <p className="text-xs sm:text-sm text-blue-200 mb-4">
                  Your trusted partner for freight forwarding from China and Dubai to Ghana. Fast, safe, and transparent.
                </p>
                <button 
                  onClick={() => handleNavigate('admin')} 
                  className="mt-2 flex items-center text-xs text-orange-400 hover:text-orange-300 font-medium"
                >
                  <Database className="w-3 h-3 mr-1" /> Admin Demo Portal
                </button>
              </div>

              <div>
                <h4 className="text-white font-bold mb-3 sm:mb-4">Quick Links</h4>
                <ul className="space-y-2 text-xs sm:text-sm">
                  <li><button onClick={() => handleNavigate('home')} className="hover:text-white transition-colors py-1">Home</button></li>
                  <li><button onClick={() => handleNavigate('services')} className="hover:text-white transition-colors py-1">Our Services</button></li>
                  <li><button onClick={() => handleNavigate('track')} className="hover:text-white transition-colors py-1">Track Shipment</button></li>
                  <li><button onClick={() => handleNavigate('quote')} className="hover:text-white transition-colors py-1">Get a Quote</button></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-3 sm:mb-4">Our Services</h4>
                <ul className="space-y-2 text-xs sm:text-sm">
                  <li className="py-1">Air Freight to Ghana</li>
                  <li className="py-1">Sea Freight (LCL & FCL)</li>
                  <li className="py-1">Customs Clearance</li>
                  <li className="py-1">Supplier Procurement</li>
                  <li className="py-1">Doorstep Delivery</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-3 sm:mb-4">Contact Us</h4>
                <ul className="space-y-3 text-xs sm:text-sm">
                  <li className="flex items-start">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{ADDRESS}</span>
                  </li>
                  <li className="flex items-center">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500 flex-shrink-0" />
                    <span>{PHONE_NUMBER}</span>
                  </li>
                  <li className="flex items-center">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500 flex-shrink-0" />
                    <span>{EMAIL}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-blue-800 mt-10 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-center sm:text-left gap-4">
              <p>&copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
              <div className="space-x-4 flex flex-wrap justify-center">
                <a href="#" className="hover:text-white py-1">Privacy Policy</a>
                <a href="#" className="hover:text-white py-1">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Floating WhatsApp Button - Optimized for Mobile safe areas */}
      {currentPage !== 'admin' && (
        <a 
          href={WHATSAPP_LINK} 
          target="_blank" 
          rel="noreferrer"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-green-500 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all z-50 group flex items-center"
          aria-label="Chat on WhatsApp"
        >
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap px-0 group-hover:px-2 font-semibold text-sm hidden sm:inline-block">
            Chat with us
          </span>
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className="absolute top-0 right-0 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-white"></span>
          </span>
        </a>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}} />
    </div>
  );
}