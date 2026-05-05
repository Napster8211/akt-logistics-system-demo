import React, { useState, useEffect } from 'react';
import { 
  Package, Plane, Ship, MapPin, Phone, Mail, CheckCircle, 
  Clock, Shield, ArrowRight, Menu, X, Search, ChevronRight, 
  MessageCircle, Anchor, Globe, Truck, Quote, Calculator, Box, Info,
  Upload, FileSpreadsheet, AlertCircle, Database
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

// --- COMPONENTS ---

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-3 rounded-md font-semibold transition-all duration-300 flex items-center justify-center text-center";
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

// --- PAGES ---

const EstimatorPage = () => {
  const [inputs, setInputs] = useState({ length: '', width: '', height: '', qty: '1', origin: 'China', method: 'NotSure' });
  const [result, setResult] = useState(null);
  const [lead, setLead] = useState({ name: '', phone: '' });

  const SEA_FREIGHT_RATE_PER_CBM = 250; // Mock rate GHS
  const AIR_FREIGHT_RATE_PER_KG = 45; // Mock rate GHS

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
    
    // Smart recommendation logic
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

  // Future Backend Placeholder
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 animate-fadeIn">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 flex items-center justify-center">
            <Calculator className="w-10 h-10 mr-3 text-orange-500" /> CBM & Cost Estimator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate your cargo volume and get instant shipping estimates from China, Dubai, or Turkey to Ghana. No hidden charges.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Input Form Section */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 h-fit">
            <h2 className="text-xl font-bold text-blue-900 mb-6 border-b pb-4 flex items-center">
              <Box className="w-5 h-5 mr-2 text-orange-500" /> Cargo Dimensions
            </h2>
            <form onSubmit={handleCalculate} className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Length (cm)</label>
                  <input type="number" required min="1" value={inputs.length} onChange={e => setInputs({...inputs, length: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Width (cm)</label>
                  <input type="number" required min="1" value={inputs.width} onChange={e => setInputs({...inputs, width: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                  <input type="number" required min="1" value={inputs.height} onChange={e => setInputs({...inputs, height: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input type="number" required min="1" value={inputs.qty} onChange={e => setInputs({...inputs, qty: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500" placeholder="1" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
                  <select value={inputs.origin} onChange={e => setInputs({...inputs, origin: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 bg-white">
                    <option value="China">China</option>
                    <option value="Dubai">Dubai (UAE)</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Method</label>
                  <select value={inputs.method} onChange={e => setInputs({...inputs, method: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 bg-white">
                    <option value="NotSure">I'm not sure (Recommend me)</option>
                    <option value="Air">Air Freight</option>
                    <option value="Sea">Sea Freight</option>
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full py-4 text-lg shadow-md">Calculate Estimate</Button>
            </form>
          </div>

          {/* Results & Lead Capture Section */}
          <div className="lg:col-span-5">
            {!result ? (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center">
                <Calculator className="w-16 h-16 text-blue-200 mb-4" />
                <h3 className="text-xl font-bold text-blue-900 mb-2">Ready to Estimate</h3>
                <p className="text-gray-500 text-sm">Enter your dimensions on the left to instantly calculate your CBM and shipping costs.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-fadeIn">
                <div className="bg-blue-900 p-6 text-white text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10"><Calculator className="w-32 h-32 -mt-4 -mr-4" /></div>
                  <h3 className="text-xl font-bold mb-1 relative z-10">Estimated Cost Range</h3>
                  <div className="text-4xl font-extrabold text-orange-500 tracking-tight mt-2 relative z-10">
                    <span className="text-lg text-orange-300">GHS</span> {result.costMin} <span className="text-xl font-medium text-white mx-1">-</span> {result.costMax}
                  </div>
                  <p className="text-blue-200 text-sm mt-3 flex items-center justify-center font-medium relative z-10">
                    <Clock className="w-4 h-4 mr-1" /> Estimated Transit: {result.eta}
                  </p>
                </div>
                
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Total Volume</p>
                      <p className="text-xl font-bold text-blue-900">{result.cbm} <span className="text-sm text-gray-500 font-normal">CBM</span></p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Volumetric Wt.</p>
                      <p className="text-xl font-bold text-blue-900">{result.volWeight} <span className="text-sm text-gray-500 font-normal">KG</span></p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {inputs.method === 'NotSure' && (
                    <div className={`mb-6 p-4 rounded-lg flex items-start ${result.isAirRecommended ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'}`}>
                      <Info className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${result.isAirRecommended ? 'text-blue-500' : 'text-green-500'}`} />
                      <div>
                        <p className={`font-bold text-sm ${result.isAirRecommended ? 'text-blue-900' : 'text-green-900'}`}>💡 Smart Recommendation</p>
                        <p className={`text-sm mt-1 ${result.isAirRecommended ? 'text-blue-800' : 'text-green-800'}`}>
                          Based on your cargo size ({result.cbm} CBM), <strong>{result.recommended}</strong> is the most cost-effective and optimal option.
                        </p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleWhatsAppConversion} className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-sm font-semibold text-gray-700 border-t pt-4">Lock in this estimate & chat with an agent:</p>
                    </div>
                    <input 
                      type="text" 
                      required 
                      value={lead.name}
                      onChange={e => setLead({...lead, name: e.target.value})}
                      placeholder="Your Full Name" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                    />
                    <input 
                      type="tel" 
                      required 
                      value={lead.phone}
                      onChange={e => setLead({...lead, phone: e.target.value})}
                      placeholder="WhatsApp Number" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                    />
                    <Button variant="whatsapp" type="submit" className="w-full py-4 text-lg mt-2 font-bold">
                      <MessageCircle className="w-5 h-5 mr-2" /> Get Exact Quote on WhatsApp
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
    {/* Hero Section */}
    <section className="relative bg-blue-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        {/* Placeholder for background pattern/image */}
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700 via-blue-900 to-black"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10 flex flex-col lg:flex-row items-center">
        <div className="lg:w-3/5 text-center lg:text-left">
          <div className="inline-flex items-center bg-blue-800 rounded-full px-4 py-2 mb-6 text-sm font-medium text-blue-100">
            <span className="flex h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Accra-Based Freight Forwarding Experts
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Fast & Reliable Shipping from <span className="text-orange-500">China & Dubai</span> to Ghana
          </h1>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0">
            Skip the stress of importing. We handle air & sea freight, customs clearance, and doorstep delivery with absolute transparency. Zero hidden fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button onClick={() => navigate('track')} className="text-lg">
              <Search className="w-5 h-5 mr-2" /> Track Shipment
            </Button>
            <Button variant="outline" onClick={() => navigate('quote')} className="text-lg bg-transparent border-white text-white hover:bg-white hover:text-blue-900">
              Get a Quote
            </Button>
          </div>
          
          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-blue-200">
            <div className="flex items-center"><Shield className="w-5 h-5 mr-2 text-orange-500"/> 100% Secure Cargo</div>
            <div className="flex items-center"><Clock className="w-5 h-5 mr-2 text-orange-500"/> Fast Transit Times</div>
            <div className="flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-orange-500"/> Customs Cleared</div>
          </div>
        </div>
        
        {/* Quick Track Widget */}
        <div className="lg:w-2/5 mt-12 lg:mt-0 w-full max-w-md">
          <div className="bg-white rounded-xl shadow-2xl p-6 text-gray-800">
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
              <Package className="mr-2" /> Quick Tracking
            </h3>
            <p className="text-sm text-gray-500 mb-4">Enter your AKT tracking ID to get real-time updates.</p>
            <form onSubmit={(e) => { e.preventDefault(); navigate('track'); }} className="space-y-4">
              <input 
                type="text" 
                placeholder="e.g. AKT-84729" 
                className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Button type="submit" className="w-full">Track Now</Button>
            </form>
          </div>
        </div>
      </div>
    </section>

    {/* Mini Estimator Widget */}
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-10 mb-12">
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center">
          <div className="bg-orange-100 p-3 rounded-full mr-4 hidden sm:block">
            <Calculator className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-900 mb-1">Instant Cost Estimator</h3>
            <p className="text-gray-600 text-sm">Calculate CBM and get an estimated shipping cost instantly.</p>
          </div>
        </div>
        <Button onClick={() => navigate('estimator')} className="w-full md:w-auto px-8 py-4 text-lg">
          Calculate Shipping Cost
        </Button>
      </div>
    </div>

    {/* Stats Section */}
    <section className="bg-gray-50 py-12 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-900 mb-2">5,000+</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Shipments Delivered</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-900 mb-2">3</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Global Hubs</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-900 mb-2">99%</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">On-Time Delivery</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-900 mb-2">24/7</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Local Support</div>
          </div>
        </div>
      </div>
    </section>

    {/* Services Overview */}
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Logistics Solutions Designed for You</h2>
          <p className="text-gray-600">Whether you are a first-time importer or a large wholesaler, we provide tailored end-to-end solutions to get your goods to Ghana safely.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Air Freight', icon: <Plane className="w-10 h-10 text-orange-500" />, desc: 'Fastest delivery from China, Dubai & Turkey. 3-5 days transit. Ideal for high-value or urgent goods.' },
            { title: 'Sea Freight (LCL & FCL)', icon: <Ship className="w-10 h-10 text-orange-500" />, desc: 'Cost-effective shipping for bulk orders. Billed by CBM. Transparent pricing inclusive of customs clearing.' },
            { title: 'Procurement & Payment', icon: <Globe className="w-10 h-10 text-orange-500" />, desc: 'Struggling to pay suppliers? Pay us in Ghana Cedis, and we will settle your suppliers in RMB or AED.' },
          ].map((service, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-8 hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.desc}</p>
              <button onClick={() => navigate('services')} className="text-orange-500 font-semibold flex items-center hover:text-orange-600">
                Learn more <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="py-20 bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-blue-200">Importing to Ghana has never been this simple.</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-blue-800 -translate-y-1/2 z-0"></div>
          
          {[
            { step: '01', title: 'Get Our Address', desc: 'Register to get our warehouse addresses in China or Dubai.' },
            { step: '02', title: 'Send Your Goods', desc: 'Have your supplier deliver your goods to our warehouse.' },
            { step: '03', title: 'We Ship & Clear', desc: 'We load, ship, and handle all customs clearing at Tema/Kotoka.' },
            { step: '04', title: 'Pickup / Delivery', desc: 'Collect from our Spintex office or get doorstep delivery.' }
          ].map((item, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mb-6 border-4 border-blue-900">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-blue-200 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Banner */}
    <section className="py-20 bg-orange-500 text-white text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Import Without the Stress?</h2>
        <p className="text-lg mb-10 opacity-90">Join hundreds of Ghanaian businesses that trust AKT for their freight forwarding needs.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="secondary" onClick={() => navigate('quote')} className="text-lg px-8">
            Get a Free Quote
          </Button>
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="inline-block">
            <Button variant="whatsapp" className="text-lg px-8 w-full sm:w-auto">
              <MessageCircle className="w-5 h-5 mr-2" /> Chat on WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </section>
  </div>
);

const AdminDemoPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPushed, setIsPushed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadExcel = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoaded(true);
      setIsLoading(false);
    }, 800);
  };

  const handlePushToSystem = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsPushed(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 animate-fadeIn">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">Internal Tool</span>
          <h1 className="text-3xl font-bold text-blue-900 flex items-center">
            <Database className="w-8 h-8 mr-3 text-orange-500" /> Admin Shipment Upload (Demo)
          </h1>
          <p className="text-gray-600 mt-2">Simulate the process of uploading your daily Excel sheet to update customer tracking statuses.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-8 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
              <FileSpreadsheet className="w-5 h-5 mr-2" /> Upload Shipment File (.xlsx)
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-grow w-full border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".xlsx, .xls, .csv" onChange={handleLoadExcel} />
                <span className="text-gray-500 flex items-center justify-center">
                  <Upload className="w-4 h-4 mr-2" /> {isLoaded ? 'shipments_update_may_2026.xlsx' : 'Click to browse or drag and drop Excel file'}
                </span>
              </div>
              <Button onClick={handleLoadExcel} disabled={isLoaded || isLoading} className="whitespace-nowrap">
                {isLoading && !isLoaded ? 'Reading File...' : 'Load Demo Data'}
              </Button>
            </div>
          </div>

          {isLoaded && (
            <div className="p-8 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Preview Data (5 Records Found)</h3>
                <span className="text-sm text-green-600 flex items-center font-medium">
                  <CheckCircle className="w-4 h-4 mr-1" /> Data Validated
                </span>
              </div>
              
              <div className="overflow-x-auto border border-gray-200 rounded-lg mb-6">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Tracking ID</th>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Mark</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">ETA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_SHIPMENT_DATA.map((row, idx) => (
                      <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-blue-900">{row.trackingId}</td>
                        <td className="px-6 py-4">{row.customerName}</td>
                        <td className="px-6 py-4">{row.shippingMark}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            row.status === 'Arrived' ? 'bg-green-100 text-green-800' : 
                            row.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{row.eta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {isPushed ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start animate-fadeIn">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-green-900">Success! System Updated.</h4>
                    <p className="text-green-800 text-sm mt-1">
                      Shipment data pushed successfully. Customers can now track their goods live using their Tracking IDs (e.g., AKT-1001, AKT-1002).
                    </p>
                  </div>
                </div>
              ) : (
                <Button onClick={handlePushToSystem} disabled={isLoading} className="w-full">
                  {isLoading ? 'Pushing to Database...' : 'Push Update to System'}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
    
    // Search Mock Database
    setTimeout(() => {
      setIsSearching(false);
      const searchStr = trackingId.toUpperCase().trim();
      const foundItem = MOCK_SHIPMENT_DATA.find(item => item.trackingId === searchStr);
      
      if (foundItem) {
        setResult(foundItem);
      } else {
        setError(`Tracking ID "${searchStr}" not found. Please check your ID and try again, or contact support if you believe this is an error.`);
      }
    }, 800);
  };

  const statusMap = { 'Received': 0, 'Loaded': 1, 'In Transit': 2, 'Arrived': 3 };
  const currentStepIndex = result ? statusMap[result.status] || 0 : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Track Your Shipment</h1>
          <p className="text-gray-600 mb-8">Enter your tracking ID to see real-time status updates.</p>
          
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-8">
            <input 
              type="text" 
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter Tracking ID (Try: AKT-1001, AKT-1002)" 
              className="flex-grow px-5 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
              required
            />
            <Button type="submit" disabled={isSearching} className="py-4 px-8 text-lg">
              {isSearching ? 'Searching...' : 'Track'}
            </Button>
          </form>

          {error && (
            <div className="animate-fadeIn mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {result && (
            <div className="animate-fadeIn border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-blue-900 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <p className="text-blue-200 text-sm uppercase tracking-wider font-semibold mb-1">Tracking ID</p>
                  <p className="text-3xl font-bold">{result.trackingId}</p>
                </div>
                <div className="bg-blue-800 rounded-lg p-4 w-full md:w-auto border border-blue-700 shadow-inner text-left md:text-right">
                  <p className="text-blue-200 text-sm uppercase tracking-wider font-semibold mb-1">Current Status</p>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-orange-500 text-white shadow-md">
                    {result.status !== 'Arrived' && <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>}
                    {result.status === 'Arrived' && <CheckCircle className="w-4 h-4 text-white mr-2" />}
                    {result.status}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 bg-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-gray-100 pb-8 mb-8">
                  <div><span className="text-sm text-gray-500 uppercase font-semibold">Customer</span><br/><span className="text-lg font-bold text-gray-800">{result.customerName}</span></div>
                  <div><span className="text-sm text-gray-500 uppercase font-semibold">Shipping Mark</span><br/><span className="text-lg font-bold text-gray-800">{result.shippingMark}</span></div>
                  <div><span className="text-sm text-gray-500 uppercase font-semibold">Origin</span><br/><span className="text-lg font-bold text-gray-800">{result.origin}</span></div>
                  <div><span className="text-sm text-gray-500 uppercase font-semibold">Est. Delivery</span><br/><span className="text-lg font-bold text-orange-600">{result.eta}</span></div>
                  
                  <div><span className="text-sm text-gray-500 uppercase font-semibold">Container Date</span><br/><span className="font-medium text-gray-800">{result.containerDate}</span></div>
                  <div><span className="text-sm text-gray-500 uppercase font-semibold">Mode</span><br/><span className="font-medium text-gray-800">{result.mode}</span></div>
                  <div><span className="text-sm text-gray-500 uppercase font-semibold">Weight</span><br/><span className="font-medium text-gray-800">{result.weight}</span></div>
                  <div><span className="text-sm text-gray-500 uppercase font-semibold">CBM</span><br/><span className="font-medium text-gray-800">{result.cbm}</span></div>
                </div>

                <div>
                  <h4 className="font-bold text-xl text-blue-900 mb-6 flex items-center">
                    <Truck className="w-6 h-6 mr-2 text-orange-500" /> Shipment Progress
                  </h4>
                  <div className="pl-4">
                    {['Received at warehouse', 'Loaded for shipment', 'In transit to Ghana', 'Arrived & Ready for Pickup'].map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isActive = idx === currentStepIndex;
                      const isLast = idx === 3;

                      return (
                        <div key={idx} className="flex relative pb-8">
                          {!isLast && (
                            <div className={`absolute top-6 left-2.5 w-0.5 h-full -ml-px ${isCompleted && idx < currentStepIndex ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                          )}
                          <div className={`relative z-10 flex-shrink-0 w-5 h-5 rounded-full border-4 mt-1 bg-white transition-colors duration-300 ${
                            isCompleted ? 'border-orange-500' : 'border-gray-300'
                          }`}>
                            {isActive && <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20"></div>}
                          </div>
                          <div className="ml-6">
                            <p className={`font-bold text-lg ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{step}</p>
                            {isActive && <p className="text-sm text-orange-600 font-medium mt-1">Current Status</p>}
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Request a Shipping Quote</h1>
          <p className="text-gray-600">Fill out the form below and our team will get back to you with pricing within 2 hours.</p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Quote Request Sent!</h2>
            <p className="text-gray-600 mb-8">Thank you. One of our agents will contact you shortly via WhatsApp or Email with your customized quote.</p>
            <Button onClick={() => setSubmitted(false)}>Submit Another Request</Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Kwame Mensah" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                  <input type="tel" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="+233 55 000 0000" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origin Country</label>
                  <select required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                    <option value="">Select Origin</option>
                    <option value="China">China</option>
                    <option value="Dubai">Dubai (UAE)</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Method</label>
                  <select required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                    <option value="">Select Method</option>
                    <option value="Air">Air Freight (Fast)</option>
                    <option value="Sea">Sea Freight (Economical)</option>
                    <option value="NotSure">I'm not sure</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type of Goods</label>
                <input type="text" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. Electronics, Clothing, Auto Parts" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Weight / CBM (Optional)</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. 50kg or 2 CBM" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea rows="3" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Any specific requirements or questions?"></textarea>
              </div>

              <Button type="submit" className="w-full py-4 text-lg">Request Quote Now</Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const ServicesPage = ({ navigate }) => (
  <div className="pt-24 pb-12 animate-fadeIn">
    {/* Header */}
    <div className="bg-blue-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">Comprehensive logistics solutions tailored for Ghanaian businesses importing from global markets.</p>
      </div>
    </div>

    {/* Main Services */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <Plane className="w-12 h-12 text-orange-500 mb-6" />
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Air Freight</h2>
          <p className="text-gray-600 mb-6">When speed is your priority. We offer daily flights from major hubs in China, Dubai, and Turkey direct to Kotoka International Airport (ACC).</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-gray-700"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/> 3-5 days transit time</li>
            <li className="flex items-center text-gray-700"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/> Custom clearance included</li>
            <li className="flex items-center text-gray-700"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/> Minimum weight: 1kg</li>
          </ul>
          <Button onClick={() => navigate('quote')} variant="outline" className="w-full">Get Air Freight Quote</Button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <Ship className="w-12 h-12 text-orange-500 mb-6" />
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Sea Freight (LCL & FCL)</h2>
          <p className="text-gray-600 mb-6">The most cost-effective way to import bulk items. Whether you need a full container (FCL) or just space for a few boxes (LCL).</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-gray-700"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/> 35-45 days transit time</li>
            <li className="flex items-center text-gray-700"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/> Pricing per CBM</li>
            <li className="flex items-center text-gray-700"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/> Handled securely at Tema Port</li>
          </ul>
          <Button onClick={() => navigate('quote')} variant="outline" className="w-full">Get Sea Freight Quote</Button>
        </div>
      </div>

      {/* Procurement Section */}
      <div className="bg-orange-50 rounded-2xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center gap-8 border border-orange-100">
        <div className="md:w-2/3">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">Supplier Payment & Procurement</h2>
          <p className="text-gray-700 text-lg mb-4">
            Don't let forex issues stop your business. We help importers pay their suppliers directly in China (RMB/Alipay/WeChat) and Dubai. 
          </p>
          <p className="text-gray-700">
            Simply pay us the equivalent in Ghana Cedis, and we will settle your supplier the same day. Safe, transparent, and fast.
          </p>
        </div>
        <div className="md:w-1/3 w-full">
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
            <Button variant="primary" className="w-full py-4"><MessageCircle className="mr-2"/> Chat with Procurement</Button>
          </a>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-10">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-lg text-blue-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
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

  // Scroll to top on page change
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
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-md z-50 transition-all">
        {/* Top bar */}
        <div className="bg-blue-900 text-white text-xs py-2 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
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
        
        {/* Main Nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => setCurrentPage('home')}
            >
              <div className="bg-blue-900 p-2 rounded-lg mr-2">
                <Anchor className="text-white w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-xl text-blue-900 tracking-tight block leading-none">AKT</span>
                <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest block">Logistics</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`font-semibold transition-colors ${
                    currentPage === item.id ? 'text-orange-500' : 'text-gray-600 hover:text-blue-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex space-x-3 border-l pl-8 border-gray-200">
                <Button variant="outline" onClick={() => setCurrentPage('track')} className="py-2 px-4 text-sm">
                  Track
                </Button>
                <Button variant="primary" onClick={() => setCurrentPage('quote')} className="py-2 px-4 text-sm">
                  Get Quote
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-blue-900 p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`block w-full text-left px-4 py-3 font-semibold rounded-md ${
                    currentPage === item.id ? 'bg-blue-50 text-orange-500' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 flex flex-col space-y-3 px-4">
                <Button variant="outline" onClick={() => setCurrentPage('track')} className="w-full">Track Shipment</Button>
                <Button variant="primary" onClick={() => setCurrentPage('quote')} className="w-full">Get a Quote</Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentPage === 'home' && <HomePage navigate={setCurrentPage} />}
        {currentPage === 'services' && <ServicesPage navigate={setCurrentPage} />}
        {currentPage === 'track' && <TrackPage />}
        {currentPage === 'estimator' && <EstimatorPage />}
        {currentPage === 'quote' && <QuotePage />}
        {currentPage === 'admin' && <AdminDemoPage />}
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-200 py-12 border-t-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="bg-white p-1.5 rounded mr-2">
                  <Anchor className="text-blue-900 w-5 h-5" />
                </div>
                <span className="font-bold text-xl text-white">AKT Logistics</span>
              </div>
              <p className="text-sm text-blue-200 mb-4">
                Your trusted partner for freight forwarding from China and Dubai to Ghana. Fast, safe, and transparent.
              </p>
              <button 
                onClick={() => setCurrentPage('admin')} 
                className="mt-2 flex items-center text-xs text-orange-400 hover:text-orange-300 font-medium"
              >
                <Database className="w-3 h-3 mr-1" /> Admin Demo Portal
              </button>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => setCurrentPage('services')} className="hover:text-white transition-colors">Our Services</button></li>
                <li><button onClick={() => setCurrentPage('track')} className="hover:text-white transition-colors">Track Shipment</button></li>
                <li><button onClick={() => setCurrentPage('quote')} className="hover:text-white transition-colors">Get a Quote</button></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-bold mb-4">Our Services</h4>
              <ul className="space-y-2 text-sm">
                <li>Air Freight to Ghana</li>
                <li>Sea Freight (LCL & FCL)</li>
                <li>Customs Clearance</li>
                <li>Supplier Procurement</li>
                <li>Doorstep Delivery</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 mr-2 text-orange-500 flex-shrink-0" />
                  <span>{ADDRESS}</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-orange-500 flex-shrink-0" />
                  <span>{PHONE_NUMBER}</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-orange-500 flex-shrink-0" />
                  <span>{EMAIL}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
            <p>&copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
            <div className="space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={WHATSAPP_LINK} 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all z-50 group flex items-center"
        aria-label="Chat on WhatsApp"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap px-0 group-hover:px-2 font-semibold">
          Chat with us
        </span>
        <MessageCircle className="w-7 h-7" />
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      </a>

      {/* Global Styles for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}} />
    </div>
  );
}