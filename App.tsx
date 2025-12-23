
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell,
  PieChart, Pie, Tooltip, Legend
} from 'recharts';
import { Screen, WaterUsageData } from './types';
import { USAGE_DATA, MONTH_USAGE_DATA, WEEKLY_COMPARISON_DATA, CATEGORY_BREAKDOWN, CONNECTED_DEVICES, ACHIEVEMENTS, LEADERBOARD, NAV_ITEMS } from './constants';
import { getWaterAdvice, askAiAssistant } from './services/geminiService';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);
  const [todayUsage, setTodayUsage] = useState(15);
  const [aiTip, setAiTip] = useState("Analyzing your usage patterns...");
  const [isValveOn, setIsValveOn] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [homeChartView, setHomeChartView] = useState<'daily' | 'monthly'>('daily');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    {role: 'ai', text: "Hello! I'm AquaNode. I analyzed your usage today—your morning shower was longer than usual. Try shaving 2 minutes off tomorrow!"}
  ]);

  const [settings, setSettings] = useState({
    unit: 'L',
    currency: 'USD',
    darkMode: true,
    leakAlerts: true,
    dailyReports: true,
    autoShutoff: false
  });

  const [notifications] = useState([
    { id: 1, type: 'alert', title: 'Leak Detected', desc: 'Possible leak in Kitchen pipe', time: '2m ago', unread: true },
    { id: 2, type: 'info', title: 'Weekly Report', desc: 'Your usage summary is ready', time: '1h ago', unread: false },
    { id: 3, type: 'success', title: 'Goal Achieved', desc: 'You stayed under 20L today!', time: '5h ago', unread: false },
  ]);

  useEffect(() => {
    if (currentScreen === Screen.MAIN) {
      getWaterAdvice("Daily usage is 15L, spiked on Thursday").then(setAiTip);
    }
  }, [currentScreen]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (e.currentTarget.scrollTop > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    setShowNotifications(false);
    setIsScrolled(false);
  };

  const NotificationOverlay = () => (
    <div className={`fixed inset-x-4 top-24 lg:left-auto lg:right-10 lg:w-96 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] shadow-2xl z-[100] transition-all duration-300 transform origin-top ${showNotifications ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-black text-slate-800 tracking-tight">Recent Alerts</h3>
        <button onClick={() => setShowNotifications(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
        {notifications.map(n => (
          <div 
            key={n.id} 
            onClick={() => { if (n.type === 'alert') navigate(Screen.LEAK_ALERT); }}
            className={`p-4 rounded-2xl flex gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${n.unread ? 'bg-blue-50/50' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.type === 'alert' ? 'bg-red-100 text-red-500' : n.type === 'success' ? 'bg-emerald-100 text-emerald-500' : 'bg-blue-100 text-blue-500'}`}>
              <i className={`fa-solid ${n.type === 'alert' ? 'fa-triangle-exclamation' : n.type === 'success' ? 'fa-circle-check' : 'fa-info-circle'}`}></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-800 text-sm">{n.title}</p>
                <span className="text-[10px] text-slate-400 font-bold">{n.time}</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className="hidden lg:flex flex-col w-64 h-[calc(100vh-3rem)] m-6 bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white sticky top-6 z-[90] p-8 overflow-hidden transition-all duration-500 hover:shadow-blue-200/40">
      <div className="flex items-center gap-3 mb-10 group">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 transition-transform group-hover:rotate-12">
          <i className="fa-solid fa-droplet text-white text-xl"></i>
        </div>
        <div className="flex flex-col">
          <span className="font-black text-blue-900 tracking-tighter text-xl italic leading-none">AQUANET</span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Every Drop Counts</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${
              currentScreen === item.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
                : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center group-hover:scale-110 transition-transform`}></i>
            <span className="text-sm tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <button 
          onClick={() => navigate(Screen.SETTINGS)}
          className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 ${
            currentScreen === Screen.SETTINGS 
              ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
              : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
          }`}
        >
          <i className="fa-solid fa-gear w-5 text-center"></i>
          <span className="text-sm tracking-tight">Settings</span>
        </button>
      </div>
    </div>
  );

  const BottomNav = () => (
    <div className="lg:hidden fixed bottom-6 left-6 right-6 h-20 bg-white/90 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl flex justify-around items-center px-4 z-[90]">
      {[
        { id: Screen.MAIN, label: 'Home', icon: 'fa-house-chimney' },
        { id: Screen.ANALYTICS, label: 'Stats', icon: 'fa-chart-simple' },
        { id: Screen.AI_ASSISTANT, label: 'AI Help', icon: 'fa-robot' },
        { id: Screen.COMMUNITY, label: 'Social', icon: 'fa-users' }
      ].map(item => (
        <button 
          key={item.id}
          onClick={() => navigate(item.id)} 
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${currentScreen === item.id ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <i className={`fa-solid ${item.icon} text-xl`}></i>
          <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
        </button>
      ))}
    </div>
  );

  const TopBar = ({ title, showBack = false }: { title: string, showBack?: boolean }) => (
    <div className={`sticky top-0 z-[80] transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg py-4 px-6 lg:px-10 rounded-b-[2rem]' : 'bg-transparent py-6 lg:px-10 lg:pt-10 lg:pb-6'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <button onClick={() => navigate(Screen.MAIN)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}
          <div>
            <h1 className="text-xl lg:text-3xl font-black text-slate-900 tracking-tight transition-all">{title}</h1>
            <p className="text-slate-400 text-[10px] lg:text-xs font-black uppercase tracking-widest mt-0.5">Every Drop Counts</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`w-11 h-11 rounded-full bg-white shadow-xl flex items-center justify-center border border-slate-50 transition-all hover:scale-105 active:scale-95 ${notifications.some(n => n.unread) ? 'text-red-500' : 'text-slate-600'}`}
          >
            <div className="relative">
              <i className="fa-solid fa-bell text-lg"></i>
              {notifications.some(n => n.unread) && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>}
            </div>
          </button>
          <button onClick={() => navigate(Screen.SETTINGS)} className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center lg:hidden shadow-xl hover:bg-slate-800 transition-all">
            <i className="fa-solid fa-user text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );

  if (currentScreen === Screen.LOGIN) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
        <div className="hidden lg:flex flex-1 bg-blue-600 items-center justify-center p-12 text-white overflow-hidden relative">
          <div className="z-10 space-y-8 max-w-lg">
            <h1 className="text-7xl font-black tracking-tighter italic leading-[0.9]">Save Every Drop.</h1>
            <p className="text-2xl text-blue-100 font-medium leading-relaxed opacity-90">
              Join thousands of households using AQUANET to reduce water waste.
            </p>
            <div className="pt-10 flex gap-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20">
                <p className="text-4xl font-black italic">12M+</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Liters Saved</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20">
                <p className="text-4xl font-black italic">#1</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Conservation App</p>
              </div>
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-500 rounded-full blur-[140px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-400 rounded-full blur-[100px] opacity-20"></div>
        </div>
        <div className="flex-1 bg-white flex flex-col px-8 py-16 justify-center lg:max-w-2xl relative">
          <div className="max-w-sm mx-auto w-full text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <i className="fa-solid fa-droplet text-5xl text-blue-600 drop-shadow-lg"></i>
            </div>
            <h1 className="text-4xl font-black text-blue-900 tracking-tighter italic">AQUANET</h1>
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mt-2">Every Drop Counts</p>
            
            <div className="mt-16 space-y-5">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Account ID</label>
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 text-sm font-medium focus:ring-4 focus:ring-blue-600/5 focus:bg-white outline-none transition-all shadow-inner"
                />
              </div>
              <button onClick={() => navigate(Screen.MAIN)} className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.5rem] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 transform active:scale-95 text-lg uppercase tracking-widest">
                Authorize Access
              </button>
            </div>
          </div>
          <p className="absolute bottom-8 left-0 right-0 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Protocol v3.0 // Secure Terminal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen relative overflow-hidden">
        <NotificationOverlay />
        <main 
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto custom-scrollbar pb-32 lg:pb-12"
        >
          {currentScreen === Screen.MAIN && (
            <div className="max-w-7xl mx-auto">
              <TopBar title="Live Dashboard" />
              <div className="px-6 lg:px-10 space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden border border-white">
                      <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Daily Flow Monitor</h2>
                      <div className="relative w-64 h-64 mx-auto mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[{ value: todayUsage }, { value: Math.max(5, 45 - todayUsage) }]}
                              innerRadius={90}
                              outerRadius={115}
                              startAngle={225}
                              endAngle={-45}
                              dataKey="value"
                              stroke="none"
                              paddingAngle={0}
                            >
                              <Cell fill="#3B82F6" className="drop-shadow-xl" />
                              <Cell fill="#F1F5F9" />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-6xl font-black text-slate-900 tracking-tighter">{todayUsage}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">LITERS</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="inline-block px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black tracking-widest uppercase">Target Optimized</div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative group cursor-pointer hover:bg-slate-800 transition-all duration-500 overflow-hidden shadow-2xl" onClick={() => navigate(Screen.AI_ASSISTANT)}>
                      <div className="relative z-10">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3">AquaNode Insight</p>
                        <p className="text-xl leading-tight font-bold italic opacity-95">"{aiTip}"</p>
                      </div>
                      <i className="fa-solid fa-sparkles absolute -bottom-4 -right-4 text-7xl opacity-5 group-hover:rotate-12 group-hover:opacity-10 transition-all duration-700"></i>
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-10">
                    <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-white transition-all hover:shadow-2xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                        <h3 className="font-black text-slate-900 text-xl uppercase tracking-tighter italic">Usage Dynamics</h3>
                        <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl shadow-inner border border-slate-100">
                          {['daily', 'monthly'].map(view => (
                            <button 
                              key={view} 
                              onClick={() => setHomeChartView(view as 'daily' | 'monthly')}
                              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${homeChartView === view ? 'bg-white shadow-xl text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                              {view}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={homeChartView === 'daily' ? USAGE_DATA : MONTH_USAGE_DATA}>
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#cbd5e1'}} dy={20} />
                            <Tooltip cursor={{fill: 'rgba(59, 130, 246, 0.03)'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)'}} />
                            <Bar dataKey="amount" radius={[12, 12, 4, 4]} barSize={homeChartView === 'daily' ? 44 : 60}>
                              {(homeChartView === 'daily' ? USAGE_DATA : MONTH_USAGE_DATA).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.day === 'Thu' || entry.day === 'W4' ? '#3B82F6' : '#F1F5F9'} className="transition-all duration-700" />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white rounded-[2.5rem] p-8 shadow-lg shadow-slate-200/40 border border-white flex items-center justify-between group overflow-hidden">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 text-emerald-500 flex items-center justify-center text-2xl shadow-inner transition-transform group-hover:rotate-6"><i className="fa-solid fa-shield-check"></i></div>
                          <div><h3 className="font-black text-slate-800 tracking-tight">Active Scan</h3><span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">System Secure</span></div>
                        </div>
                      </div>
                      <div onClick={() => navigate(Screen.LEAK_ALERT)} className="cursor-pointer bg-white rounded-[2.5rem] p-8 shadow-lg shadow-red-100/30 border border-red-50 flex items-center justify-between hover:bg-red-50/20 transition-all group relative overflow-hidden">
                        <div className="flex items-center gap-5 relative z-10">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-red-100 text-red-600 flex items-center justify-center text-2xl animate-pulse shadow-inner"><i className="fa-solid fa-triangle-exclamation"></i></div>
                          <div><h3 className="font-black text-slate-800 tracking-tight">System Alert</h3><p className="text-[10px] font-black text-red-500 mt-1 uppercase tracking-widest underline decoration-2 underline-offset-4">Leak Detected</p></div>
                        </div>
                        <i className="fa-solid fa-chevron-right text-slate-300 group-hover:translate-x-2 transition-transform relative z-10"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 pt-4">
                   <div className="flex items-center justify-between px-4">
                     <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">Network Integrity</h3>
                     <button onClick={() => navigate(Screen.DEVICES)} className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-[0.2em]">View All Nodes</button>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      {CONNECTED_DEVICES.slice(0, 4).map(d => (
                        <div key={d.id} className="bg-white p-6 rounded-[2rem] border border-white shadow-xl shadow-slate-200/30 flex items-center gap-5 group hover:scale-[1.02] transition-all">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${d.status === 'Low Battery' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                             <i className={`fa-solid ${d.type === 'Valve' ? 'fa-faucet' : 'fa-wave-square'}`}></i>
                           </div>
                           <div className="overflow-hidden">
                              <p className="text-xs font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">{d.name}</p>
                              <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${d.status === 'Active' ? 'text-emerald-500' : 'text-red-500 animate-pulse'}`}>{d.status}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {currentScreen === Screen.ANALYTICS && (
            <div className="max-w-7xl mx-auto">
              <TopBar title="Advanced Analytics" />
              <div className="px-6 lg:px-10 space-y-10">
                <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 border border-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <h3 className="font-black text-slate-900 text-2xl tracking-tighter italic uppercase">Weekly Cycle Comparison</h3>
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-lg bg-blue-600 shadow-lg shadow-blue-100"></div><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Week</span></div>
                      <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-lg bg-blue-100"></div><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Historical</span></div>
                    </div>
                  </div>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={WEEKLY_COMPARISON_DATA}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#cbd5e1'}} dy={25} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)'}} />
                        <Bar dataKey="thisWeek" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={28} />
                        <Bar dataKey="lastWeek" fill="#E2E8F0" radius={[10, 10, 0, 0]} barSize={28} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 border border-white">
                    <h3 className="font-black text-slate-900 text-xl mb-10 uppercase tracking-tighter italic">Consumption Vectors</h3>
                    <div className="flex flex-col md:flex-row items-center gap-12">
                      <div className="w-56 h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={CATEGORY_BREAKDOWN}
                              innerRadius={70}
                              outerRadius={95}
                              paddingAngle={8}
                              dataKey="value"
                              stroke="none"
                            >
                              {CATEGORY_BREAKDOWN.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{borderRadius: '20px', border: 'none'}} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex-1 space-y-5 w-full">
                        {CATEGORY_BREAKDOWN.map(cat => (
                          <div key={cat.name} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                              <div className="w-4 h-4 rounded-md transition-all group-hover:scale-125" style={{backgroundColor: cat.color}}></div>
                              <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{cat.name}</span>
                            </div>
                            <span className="text-lg font-black text-slate-900 tracking-tighter italic">{cat.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-600 rounded-[3rem] p-12 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-blue-200">
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-60">Impact Rating</p>
                      <h3 className="text-5xl font-black mb-6 italic tracking-tighter leading-none">GLOBAL<br/>ELITE</h3>
                      <p className="text-blue-100 font-medium leading-relaxed mb-8 text-lg opacity-90">You achieved <span className="font-black text-white underline decoration-blue-400 decoration-4 underline-offset-8">22% efficiency gain</span> compared to the regional baseline.</p>
                      <div className="inline-block px-8 py-3 bg-white/20 backdrop-blur-xl rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] border border-white/20">TOP 10% CLUB</div>
                    </div>
                    <i className="fa-solid fa-medal absolute bottom-[-40px] right-[-40px] text-[15rem] opacity-5 rotate-12 transition-transform duration-1000 hover:rotate-45"></i>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentScreen === Screen.AI_ASSISTANT && (
            <div className="max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col p-6 lg:p-10">
              <TopBar title="AquaNode Terminal" />
              <div className="flex-1 bg-white rounded-[3.5rem] shadow-2xl border border-white flex flex-col overflow-hidden relative mt-4">
                <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                   <div className="flex justify-center mb-12">
                     <div className="bg-blue-50/50 p-8 rounded-[3rem] text-center border border-blue-100 max-w-sm shadow-inner transition-all hover:shadow-lg">
                        <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-200 group">
                          <i className="fa-solid fa-robot text-5xl text-white transition-transform group-hover:scale-110"></i>
                        </div>
                        <h4 className="font-black text-blue-900 tracking-tighter text-2xl italic leading-none">AquaNode AI</h4>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mt-3">Conservation Intelligence</p>
                     </div>
                   </div>

                   {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-8 rounded-[2.5rem] text-sm leading-relaxed shadow-xl border ${
                        m.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none border-blue-500' 
                          : 'bg-white text-slate-800 rounded-tl-none border-slate-100'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-10 bg-slate-50/50 border-t border-slate-100">
                  <div className="relative group max-w-4xl mx-auto">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (async () => {
                        const input = chatInput;
                        setChatInput("");
                        setMessages(prev => [...prev, { role: 'user', text: input }]);
                        const response = await askAiAssistant(input, todayUsage);
                        setMessages(prev => [...prev, { role: 'ai', text: response }]);
                      })()}
                      placeholder="Input command or conservation query..."
                      className="w-full bg-white border-2 border-slate-200 rounded-[2.5rem] py-6 pl-10 pr-24 shadow-2xl shadow-slate-200/50 outline-none focus:border-blue-600 transition-all font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-black placeholder:uppercase placeholder:tracking-widest"
                    />
                    <button 
                      onClick={async () => {
                        const input = chatInput;
                        setChatInput("");
                        setMessages(prev => [...prev, { role: 'user', text: input }]);
                        const response = await askAiAssistant(input, todayUsage);
                        setMessages(prev => [...prev, { role: 'ai', text: response }]);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-blue-600 rounded-full text-white shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-90 flex items-center justify-center"
                    >
                      <i className="fa-solid fa-paper-plane text-xl"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentScreen === Screen.COMMUNITY && (
            <div className="max-w-7xl mx-auto">
              <TopBar title="Social Hub" />
              <div className="px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                  <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-white">
                    <h3 className="font-black text-slate-900 text-xl mb-10 uppercase tracking-tighter italic">Regional Leaderboard</h3>
                    <div className="space-y-5">
                      {LEADERBOARD.map((item) => (
                        <div key={item.rank} className={`flex items-center gap-6 p-6 rounded-[2.5rem] transition-all duration-500 hover:scale-[1.02] ${item.rank === 4 ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200 scale-105' : 'bg-slate-50 border border-slate-100 hover:bg-slate-100'}`}>
                          <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${item.rank === 4 ? 'bg-white text-blue-600' : 'bg-white text-slate-400'}`}>
                            {item.rank}
                          </span>
                          <div className="flex-1">
                            <p className="font-black tracking-tight text-lg">{item.name}</p>
                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${item.rank === 4 ? 'text-blue-100' : 'text-slate-400'}`}>Monthly Savings: {item.savings}</p>
                          </div>
                          <div className="text-right">
                             <p className="font-black text-2xl tracking-tighter italic">{item.points}</p>
                             <p className={`text-[9px] font-black uppercase tracking-widest ${item.rank === 4 ? 'text-blue-100' : 'text-slate-400'}`}>XP Points</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="bg-emerald-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-emerald-200 text-center relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="w-24 h-24 bg-white/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-5xl shadow-inner backdrop-blur-md">
                        <i className="fa-solid fa-earth-americas"></i>
                      </div>
                      <h3 className="text-3xl font-black mb-3 italic tracking-tighter uppercase">The Core Goal</h3>
                      <p className="text-emerald-100 font-medium mb-8 leading-relaxed opacity-90">Our collective action has reclaimed enough water for <span className="text-white font-black">12 Olympic Hubs</span>.</p>
                      <div className="w-full bg-emerald-900/30 h-4 rounded-full overflow-hidden shadow-inner p-1">
                        <div className="bg-white h-full w-[75%] rounded-full shadow-lg shadow-white/50 transition-all duration-1000"></div>
                      </div>
                    </div>
                    <i className="fa-solid fa-droplet absolute top-[-50px] left-[-50px] text-[12rem] opacity-5 -rotate-12"></i>
                  </div>
                  
                  <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/40 text-center transition-all hover:shadow-2xl">
                    <h4 className="font-black text-slate-900 mb-3 uppercase tracking-tighter italic text-xl">Expand Network</h4>
                    <p className="text-sm text-slate-500 mb-8 font-medium">Transmit your invite code to neighbors and earn 200 XP legacy points.</p>
                    <button className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">Link Invite Protocol</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentScreen === Screen.DEVICES && (
            <div className="max-w-7xl mx-auto">
              <TopBar title="Hardware Nodes" />
              <div className="px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {CONNECTED_DEVICES.map(d => (
                  <div key={d.id} className="bg-white p-10 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-white relative group transition-all duration-500 hover:shadow-2xl hover:scale-[1.03]">
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl mb-10 shadow-inner transition-all duration-500 group-hover:rotate-12 ${d.status === 'Low Battery' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                      <i className={`fa-solid ${d.type === 'Valve' ? 'fa-faucet' : 'fa-wave-square'}`}></i>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black text-slate-900 tracking-tighter italic leading-none">{d.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{d.type} MODULE</p>
                    </div>
                    <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-inner ${d.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600 animate-pulse'}`}>
                        {d.status}
                      </span>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">LOG: {d.lastSync}</p>
                    </div>
                    <button className="absolute top-10 right-10 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-blue-600 transition-all">
                      <i className="fa-solid fa-ellipsis-vertical text-lg"></i>
                    </button>
                  </div>
                ))}
                <div className="bg-white p-10 rounded-[3.5rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/10 transition-all group min-h-[300px]">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-3xl text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all shadow-inner"><i className="fa-solid fa-plus"></i></div>
                  <div><h4 className="font-black text-slate-900 text-xl italic uppercase tracking-tighter">Register Node</h4><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Scan for local telemetry</p></div>
                </div>
              </div>
            </div>
          )}

          {currentScreen === Screen.ACHIEVEMENTS && (
            <div className="max-w-7xl mx-auto">
              <TopBar title="Honor Protocol" />
              <div className="px-6 lg:px-10 space-y-12">
                <div className="bg-indigo-600 rounded-[4rem] p-16 text-white text-center shadow-[0_40px_100px_-20px_rgba(79,70,229,0.3)] relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] mb-6 opacity-60">Legacy Status</p>
                    <h2 className="text-6xl font-black mb-10 italic tracking-tighter leading-none">LVL 5: RAINMAKER</h2>
                    <div className="flex justify-center gap-6 mb-12">
                      {[1,2,3,4,5].map(i => <i key={i} className="fa-solid fa-trophy text-white text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all hover:scale-125"></i>)}
                    </div>
                    <div className="max-w-lg mx-auto bg-indigo-900/40 h-5 rounded-full p-1 shadow-inner relative overflow-hidden">
                      <div className="bg-white h-full w-[60%] rounded-full shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all duration-1000 ease-out"></div>
                    </div>
                    <p className="mt-6 text-[11px] font-black uppercase tracking-[0.5em] text-indigo-100">Progress: 325 / 500 XP to Transcendence</p>
                  </div>
                  <div className="absolute top-[-30%] right-[-10%] w-96 h-96 bg-indigo-400 rounded-full blur-[140px] opacity-30 animate-pulse"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                  {ACHIEVEMENTS.map(a => (
                    <div key={a.id} className={`p-10 rounded-[3rem] bg-white border border-slate-50 text-center transition-all duration-500 hover:shadow-2xl hover:scale-105 group relative overflow-hidden ${!a.unlocked && 'grayscale opacity-25 blur-[0.5px]'}`}>
                      <div className={`w-20 h-20 rounded-[2.5rem] ${a.color} text-white flex items-center justify-center text-3xl mx-auto mb-6 shadow-2xl shadow-current/30 group-hover:rotate-12 transition-all`}><i className={`fa-solid ${a.icon}`}></i></div>
                      <p className="text-[10px] font-black text-slate-900 uppercase leading-none tracking-widest h-8 flex items-center justify-center">{a.title}</p>
                      {a.unlocked && <span className="absolute top-4 right-4 text-emerald-500 text-xs"><i className="fa-solid fa-circle-check"></i></span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentScreen === Screen.SETTINGS && (
            <div className="max-w-4xl mx-auto p-6 lg:p-10">
              <TopBar title="User Control" />
              <div className="space-y-12">
                <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-slate-200/50 border border-white flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
                  <div className="relative group">
                    <div className="w-40 h-40 bg-indigo-50 rounded-[3.5rem] flex items-center justify-center text-7xl text-indigo-300 border-8 border-white shadow-2xl relative overflow-hidden transition-all duration-500 group-hover:rounded-[2.5rem]">
                       <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AquaDev" alt="Profile" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
                    </div>
                    <button className="absolute bottom-2 right-2 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white hover:bg-blue-700 transition-all active:scale-90">
                      <i className="fa-solid fa-camera text-sm"></i>
                    </button>
                  </div>
                  <div className="text-center md:text-left flex-1 relative z-10">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic leading-none">Dev Alpha</h3>
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] mt-3 mb-8 text-xs">Silver Badge Member // Premium</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <button className="px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-[1.5rem] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-300 active:scale-95">Edit Identity</button>
                      <button className="px-8 py-4 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-[1.5rem] hover:bg-slate-100 transition-all border border-slate-200 active:scale-95">Link Multi-Node</button>
                    </div>
                  </div>
                  <div className="absolute top-[-30%] right-[-10%] w-64 h-64 bg-blue-50 rounded-full blur-[100px] opacity-60"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-white space-y-8">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 px-4">Localisation Settings</h4>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <span className="font-black text-slate-900 text-xs uppercase tracking-widest">Fluid Unit</span>
                      <div className="bg-white p-1.5 rounded-2xl flex gap-2 shadow-inner border border-slate-100">
                        {['L', 'gal'].map(u => (
                          <button 
                            key={u} 
                            onClick={() => setSettings({...settings, unit: u})}
                            className={`px-6 py-2.5 text-[10px] font-black rounded-xl transition-all ${settings.unit === u ? 'bg-blue-600 shadow-xl text-white' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <span className="font-black text-slate-900 text-xs uppercase tracking-widest">Currency</span>
                      <div className="bg-white p-1.5 rounded-2xl flex gap-2 shadow-inner border border-slate-100">
                        {['USD', 'RM'].map(c => (
                          <button 
                            key={c} 
                            onClick={() => setSettings({...settings, currency: c})}
                            className={`px-6 py-2.5 text-[10px] font-black rounded-xl transition-all ${settings.currency === c ? 'bg-blue-600 shadow-xl text-white' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-white space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 px-4">AI Protocols</h4>
                    {[
                      {label:'Leak Shield', k:'leakAlerts'},
                      {label:'Sync Reports', k:'dailyReports'},
                      {label:'Auto Close', k:'autoShutoff'}
                    ].map(item => (
                      <div key={item.k} className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-lg">
                        <span className="font-black text-slate-900 text-xs uppercase tracking-widest">{item.label}</span>
                        <button 
                          onClick={() => setSettings({...settings, [item.k]: !settings[item.k as keyof typeof settings]})}
                          className={`w-14 h-8 rounded-full relative transition-all shadow-inner ${settings[item.k as keyof typeof settings] ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full shadow-2xl transition-all duration-300 ${settings[item.k as keyof typeof settings] ? 'right-1.5' : 'left-1.5'}`}></div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-6 pt-10">
                  <button onClick={() => navigate(Screen.LOGIN)} className="w-full bg-red-600 text-white font-black py-6 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(220,38,38,0.3)] uppercase tracking-[0.4em] text-xs active:scale-[0.98] transition-all hover:bg-red-700">Deauthorize Protocol</button>
                  <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">AQUANET OS v4.2.0-STABLE // BUILD 8821</p>
                </div>
              </div>
            </div>
          )}

          {currentScreen === Screen.LEAK_ALERT && (
            <div className="fixed inset-0 bg-slate-900/40 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl">
               <div className="bg-white rounded-[4rem] p-16 shadow-[0_50px_100px_-20px_rgba(239,68,68,0.3)] border-4 border-red-50 text-center space-y-12 alert-pulse max-w-xl w-full relative transform scale-110">
                  <button onClick={() => navigate(Screen.MAIN)} className="absolute top-12 right-12 w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all active:scale-90 shadow-xl border border-white hover:bg-white">
                    <i className="fa-solid fa-xmark text-2xl"></i>
                  </button>
                  <div className="w-32 h-32 bg-red-100 text-red-500 rounded-[3rem] flex items-center justify-center mx-auto text-5xl shadow-2xl shadow-red-200 animate-bounce">
                    <i className="fa-solid fa-droplet-slash"></i>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">SECURITY<br/>BREACH!</h2>
                    <p className="text-slate-500 font-bold leading-relaxed text-lg opacity-80 uppercase tracking-tight">Abnormal flow detected.<br/>Source: <span className="text-red-500 font-black underline decoration-red-200 decoration-8 underline-offset-4">Kitchen Line Module.</span></p>
                  </div>
                  <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-3">Incident Timestamp</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter italic">Today @ 02:13:42 AM</p>
                  </div>
                  <div className="flex flex-col gap-6">
                    <button 
                      onClick={() => setIsValveOn(!isValveOn)}
                      className={`w-full py-8 rounded-[2.5rem] font-black text-white shadow-2xl transition-all transform active:scale-95 text-xl uppercase tracking-[0.3em] ${isValveOn ? 'bg-red-600 shadow-red-300 hover:bg-red-700' : 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700'}`}
                    >
                      {isValveOn ? 'Shut Off Main Line' : 'Reactivate System'}
                    </button>
                    <button onClick={() => navigate(Screen.ANALYTICS)} className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] hover:text-slate-900 transition-colors">Generate Event Report</button>
                  </div>
               </div>
            </div>
          )}
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default App;
