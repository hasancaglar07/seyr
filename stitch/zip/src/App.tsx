import React, { useState } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, 
  Shuffle, Repeat, Menu, ChevronLeft, ChevronRight,
  Droplet, Sun, Moon, Flame, Leaf, Triangle,
  Calendar, Clock, Info, Mail, Phone, MapPin, Tv
} from 'lucide-react';

const CHANNELS = [
  { id: 1, icon: Droplet, active: true },
  { id: 2, icon: Sun, active: false },
  { id: 3, icon: Moon, active: false },
  { id: 4, icon: Flame, active: false },
  { id: 5, icon: Leaf, active: false },
  { id: 6, icon: Triangle, active: false },
];

const BROADCASTERS = [
  { id: 1, name: 'Ali Ramazan\nDinç Efendi', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
  { id: 2, name: 'Hacı Hasan\nEfendi (K.S.)', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
  { id: 3, name: 'Ali Hasan\nEfendi (Efendi)', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop' },
  { id: 4, name: 'Mehmet\nYıldız', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
  { id: 5, name: 'Ahmet\nKaya', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
  { id: 6, name: 'Mustafa\nDemir', image: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop' },
];

const PROGRAMS = [
  { id: 1, title: 'Mehmet Emin\nA.V. Amin AY', subtitle: 'Mehmet Enuh AY', image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=400&h=600&fit=crop' },
  { id: 2, title: "Dikvtim Lava\nPortar'yan", subtitle: 'Mehmet Tms', image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400&h=600&fit=crop' },
  { id: 3, title: 'Hacı Hasan\nKodmsitt (K.S.)', subtitle: 'Mehmet Emin AY', image: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=400&h=600&fit=crop' },
  { id: 4, title: 'Sarun Alan\nKombae', subtitle: 'Sandta', image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=400&h=600&fit=crop' },
];

const SCHEDULE = [
  { time: '10:00', title: 'Sohbetler', subtitle: 'Morning Discussions', host: BROADCASTERS[0], live: false },
  { time: '11:00', title: 'Mehmet Emin Desi', subtitle: 'Special Broadcast', host: BROADCASTERS[1], live: true },
  { time: '12:00', title: 'Sabi zer', subtitle: 'Daily Mix', host: BROADCASTERS[2], live: false },
  { time: '13:00', title: 'Madet', subtitle: 'Cultural Review', host: BROADCASTERS[3], live: false },
];

function Navbar({ currentTab, setCurrentTab }: { currentTab: string, setCurrentTab: (tab: string) => void }) {
  const tabs = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT US' },
    { id: 'stream', label: 'BROADCAST STREAM' },
    { id: 'programs', label: 'PROGRAMS' },
    { id: 'broadcasters', label: 'BROADCASTERS' },
    { id: 'livetv', label: 'LIVE TV' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <header className="w-full flex justify-center pt-8 px-4 relative z-40">
      <nav className="bg-white/40 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.1)] rounded-full px-8 py-3 flex items-center space-x-6 text-xs font-semibold tracking-wide text-gray-700 overflow-x-auto no-scrollbar max-w-full">
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className="flex flex-col items-center cursor-pointer group shrink-0"
          >
            <span className={`${currentTab === tab.id ? 'text-gray-900 font-bold' : 'hover:text-blue-600'} transition`}>
              {tab.label}
            </span>
            {currentTab === tab.id && (
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 shadow-[0_0_8px_#3b82f6]"></div>
            )}
          </div>
        ))}
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="text-center pt-16 pb-12 relative z-30">
      <h1 className="text-6xl md:text-8xl font-thin text-gray-800 drop-shadow-sm mb-2 tracking-tight">
        LIVE RADIO
      </h1>
      <div className="text-gray-800 text-xl md:text-2xl font-light mb-1">
        Current Show: <span className="font-medium">Mehmet Emin AY</span>
      </div>
      <div className="text-gray-600 text-lg font-light mb-10">
        Time: 13:30
      </div>
      
      <button className="relative overflow-hidden bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md border border-white/60 shadow-[0_4px_15px_rgba(0,0,0,0.05),inset_0_0_10px_rgba(255,255,255,0.5)] px-10 py-3 rounded-full text-gray-800 font-semibold text-sm tracking-widest uppercase hover:scale-105 transition-transform duration-300 group">
        <span className="relative z-10 flex items-center gap-2">
          <Play size={16} className="text-blue-500 fill-blue-500" />
          Listen Live
        </span>
      </button>
    </section>
  );
}

function ChannelBar() {
  return (
    <section className="flex justify-center mb-16 relative z-30">
      <div className="bg-white/40 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.1)] rounded-full px-6 py-3 flex items-center space-x-4 max-w-2xl w-full mx-4">
        <div className="text-xs font-bold text-gray-500 tracking-widest uppercase shrink-0">Channels</div>
        <div className="h-6 w-px bg-gray-400 opacity-30 shrink-0"></div>
        
        <button className="text-gray-400 hover:text-gray-700 shrink-0"><ChevronLeft size={20} /></button>
        
        <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar flex-grow justify-center">
          {CHANNELS.map((channel) => {
            const Icon = channel.icon;
            return (
              <button 
                key={channel.id}
                className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-all border ${
                  channel.active 
                    ? 'bg-blue-500/10 ring-2 ring-blue-400 border-white/40 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                    : 'bg-white/30 hover:bg-white/60 border-white/40'
                }`}
              >
                <Icon size={20} className={channel.active ? 'text-blue-500' : 'text-gray-500'} />
              </button>
            );
          })}
        </div>
        
        <button className="text-gray-400 hover:text-gray-700 shrink-0"><ChevronRight size={20} /></button>
      </div>
    </section>
  );
}

function BroadcastersList() {
  return (
    <div className="relative z-30">
      <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6 ml-2">Broadcasters</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-4">
        {BROADCASTERS.map((person) => (
          <div key={person.id} className="flex flex-col items-center text-center group cursor-pointer">
            <div className="w-24 h-24 rounded-full p-1 bg-white/50 backdrop-blur-sm shadow-md mb-3 ring-1 ring-white/60 group-hover:ring-blue-400 transition-all duration-300">
              <img 
                src={person.image} 
                alt={person.name} 
                className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition duration-300 pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs font-medium leading-tight text-gray-800 whitespace-pre-line">
              {person.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgramsList() {
  return (
    <div className="relative z-30">
      <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6">Programs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROGRAMS.map((program) => (
          <article 
            key={program.id} 
            className="group relative rounded-2xl overflow-hidden shadow-lg h-64 cursor-pointer transform hover:-translate-y-1 transition duration-300"
          >
            <img 
              src={program.image} 
              alt={program.title} 
              className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105 pointer-events-none"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <h3 className="text-white text-base font-bold leading-tight mb-1 whitespace-pre-line">
                {program.title}
              </h3>
              <p className="text-gray-300 text-xs">{program.subtitle}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Player() {
  return (
    <footer className="fixed bottom-6 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-white/60 backdrop-blur-2xl border border-white/50 rounded-2xl p-3 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.1)] w-full max-w-5xl">
        
        {/* Left: Controls */}
        <div className="flex items-center space-x-4 pl-2 sm:pl-4">
          <button className="text-gray-700 hover:text-blue-600 transition">
            <SkipBack size={20} className="fill-current" />
          </button>
          <button className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-md">
            <Pause size={18} className="fill-current" />
          </button>
          <button className="text-gray-700 hover:text-blue-600 transition">
            <SkipForward size={20} className="fill-current" />
          </button>
          <button className="text-gray-600 hover:text-gray-900 transition ml-2 hidden sm:block">
            <Volume2 size={20} />
          </button>
        </div>

        {/* Center: Track Info & Progress */}
        <div className="flex-grow mx-4 sm:mx-8 flex items-center space-x-4">
          <div className="hidden sm:block relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=100&h=100&fit=crop" 
              alt="Album Art" 
              className="w-full h-full object-cover pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col flex-grow min-w-0">
            <div className="flex justify-between items-end mb-1.5">
              <div className="truncate">
                <h4 className="text-sm font-bold text-gray-900 truncate">Seyr FM</h4>
                <p className="text-xs text-gray-600 truncate">Mehmet Emin AY</p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-300/50 rounded-full h-1.5 cursor-pointer group relative">
              <div className="bg-blue-500 h-1.5 rounded-full w-1/3 relative group-hover:bg-blue-400">
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white border border-blue-500 rounded-full shadow opacity-0 group-hover:opacity-100 transition"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Extra Controls */}
        <div className="flex items-center space-x-4 pr-2 sm:pr-4 text-gray-500">
          <button className="hover:text-gray-800 transition hidden sm:block">
            <Shuffle size={18} />
          </button>
          <button className="hover:text-gray-800 transition hidden sm:block">
            <Repeat size={18} />
          </button>
          <button className="hover:text-gray-800 transition">
            <Menu size={20} />
          </button>
        </div>

      </div>
    </footer>
  );
}

// Subpages
function BroadcastStream() {
  return (
    <div className="relative z-30 pt-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight mb-12 text-center drop-shadow-sm">YAYIN AKIŞI</h1>
      
      <div className="flex justify-center mb-12">
        <div className="inline-flex bg-white/40 backdrop-blur-md border border-white/50 rounded-full p-1.5 space-x-1 shadow-sm">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => (
            <button 
              key={day}
              className={`px-6 py-2 rounded-full font-medium text-sm transition ${
                i === 0 ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-white/50 hover:text-gray-800'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="hidden md:block absolute left-[80px] top-4 bottom-4 w-px bg-blue-200/50"></div>
        
        <div className="space-y-8">
          {SCHEDULE.map((item, i) => (
            <article key={i} className="relative flex items-center group">
              <div className="hidden md:block w-[60px] text-right text-lg font-medium text-gray-600 mr-8">{item.time}</div>
              <div className="hidden md:block absolute left-[74px] w-3.5 h-3.5 bg-blue-400 rounded-full border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10"></div>
              
              <div className={`flex-1 bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-4 flex items-center justify-between ml-0 md:ml-8 transition duration-300 ${
                item.live ? 'ring-1 ring-blue-300 shadow-lg bg-white/60' : 'hover:bg-white/60 shadow-sm'
              }`}>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/50 shadow-sm shrink-0">
                    <img src={item.host.image} alt={item.host.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    {item.live && <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100/80 text-blue-600 mb-1">LIVE SOON</span>}
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.subtitle}</p>
                  </div>
                </div>
                <button className={`px-6 py-2 rounded-full text-xs font-bold tracking-wider transition ${
                  item.live 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700' 
                    : 'bg-white/50 border border-white/60 text-gray-700 hover:bg-white/80'
                }`}>
                  REMIND ME
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function LiveTV() {
  return (
    <div className="relative z-30 pt-12 max-w-5xl mx-auto">
      <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col md:flex-row">
        {/* Video Player Area */}
        <div className="flex-1 relative aspect-video bg-black">
          <img 
            src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1200&h=800&fit=crop" 
            alt="Live TV" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
            LIVE
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition border border-white/30">
              <Play size={24} className="text-white fill-white ml-1" />
            </button>
          </div>
          {/* Internal Player Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center gap-4 text-white">
              <button><Pause size={20} className="fill-white" /></button>
              <button><Volume2 size={20} /></button>
              <div className="flex-1 h-1 bg-white/30 rounded-full">
                <div className="w-1/3 h-full bg-blue-500 rounded-full relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <span className="text-xs font-medium">13:30 / LIVE</span>
            </div>
          </div>
        </div>
        
        {/* Chat / Info Sidebar */}
        <div className="w-full md:w-80 bg-white/10 backdrop-blur-md border-l border-white/10 p-4 flex flex-col">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Tv size={18} /> Live Chat
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  U{i}
                </div>
                <div>
                  <span className="text-blue-300 text-xs font-medium">User {i}</span>
                  <p className="text-gray-200 text-sm">Harika bir yayın, teşekkürler!</p>
                </div>
              </div>
            ))}
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Message..." 
              className="w-full bg-black/20 border border-white/20 rounded-full py-2 px-4 text-white text-sm focus:outline-none focus:border-blue-400"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400">
              <Play size={16} className="fill-current" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Live: Program Title</h2>
        <p className="text-gray-600">Description: Brief description of the current program and topics being discussed.</p>
      </div>
    </div>
  );
}

function AboutUs() {
  return (
    <div className="relative z-30 pt-12 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight mb-8 drop-shadow-sm">SEYR DİJİTAL - 2026<br/>GELECEĞE SES</h1>
      
      <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-lg mb-12">
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Seyr FM, yılların getirdiği tecrübe ile dinleyicilerine kaliteli içerikler sunmayı amaçlayan köklü bir radyo istasyonudur. Kültür, sanat, edebiyat ve dini sohbetler ağırlıklı yayın akışımızla her yaştan dinleyiciye hitap ediyoruz.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          Amacımız, geleneksel değerlerimizi modern yayıncılık anlayışıyla harmanlayarak, dinleyicilerimizin hayatına değer katmaktır. Uzman yayıncı kadromuz ve özenle seçilmiş programlarımızla 7/24 kesintisiz hizmet veriyoruz.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Info size={24} />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Misyonumuz</h3>
          <p className="text-sm text-gray-600">Topluma faydalı, doğru ve güvenilir içerikler üreterek kültürel mirasımızı geleceğe taşımak.</p>
        </div>
        <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Tv size={24} />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Vizyonumuz</h3>
          <p className="text-sm text-gray-600">Dijital yayıncılıkta öncü, yenilikçi ve en çok tercih edilen platform olmak.</p>
        </div>
        <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Clock size={24} />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Değerlerimiz</h3>
          <p className="text-sm text-gray-600">Tarafsızlık, kalite, samimiyet ve dinleyici odaklılık temel ilkelerimizdir.</p>
        </div>
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div className="relative z-30 pt-12 max-w-5xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight mb-12 text-center drop-shadow-sm">İLETİŞİM</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
              <Phone size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Telefon</h3>
              <p className="text-gray-600">+90 552 235 10 22</p>
              <p className="text-gray-600">0 212 635 83 95</p>
            </div>
          </div>
          
          <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">E-Posta</h3>
              <p className="text-gray-600">iletisim@seyrdijital.com</p>
            </div>
          </div>
          
          <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Adres</h3>
              <p className="text-gray-600">Dervişali Mah. Salmatomruk Cad. No:7/2 34000 Fatih/İstanbul</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-lg">
          <h3 className="font-bold text-xl text-gray-800 mb-6">Bize Ulaşın</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adınız Soyadınız</label>
              <input type="text" className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta Adresiniz</label>
              <input type="email" className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mesajınız</label>
              <textarea rows={4} className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
            </div>
            <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-500/30">
              GÖNDER
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <>
            <Hero />
            <ChannelBar />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
              <div className="lg:col-span-5">
                <BroadcastersList />
              </div>
              <div className="lg:col-span-7">
                <ProgramsList />
              </div>
            </div>
          </>
        );
      case 'stream':
        return <BroadcastStream />;
      case 'programs':
        return (
          <div className="pt-12">
            <ProgramsList />
          </div>
        );
      case 'broadcasters':
        return (
          <div className="pt-12 max-w-4xl mx-auto">
            <BroadcastersList />
          </div>
        );
      case 'livetv':
        return <LiveTV />;
      case 'about':
        return <AboutUs />;
      case 'contact':
        return <Contact />;
      default:
        return <Hero />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 relative overflow-x-hidden selection:bg-blue-200">
      {/* Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1920&q=80)' }}
      >
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen pb-32">
        <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderContent()}
        </main>
      </div>

      <Player />
    </div>
  );
}
