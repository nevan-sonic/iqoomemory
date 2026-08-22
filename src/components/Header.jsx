import React, { useState, useEffect } from 'react';
import { Cpu, Wifi, WifiOff, Battery, ShieldCheck, Download, Smartphone } from 'lucide-react';

export function Header({ airplaneMode, setAirplaneMode }) {
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [isCharging, setIsCharging] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      }).catch(() => {});
    }

    // Capture PWA beforeinstallprompt event
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('To install this app on your device:\n• On Chrome / Android / Edge: Click the "Install" icon in your URL address bar.\n• On iOS Safari: Tap Share -> "Add to Home Screen".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <header className="flex flex-col border-b border-white/5 bg-[#08090C] shrink-0 select-none z-40">
      {/* OriginOS Status Bar */}
      <div className="flex items-center justify-between px-3.5 pt-1.5 pb-0.5 text-slate-400 font-mono text-[9px] leading-none">
        <span className="font-bold text-white tracking-tight">{currentTime}</span>
        
        {/* Right Status Icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAirplaneMode(!airplaneMode)}
            className="flex items-center gap-0.5 cursor-pointer hover:text-yellow-400 transition-colors"
            title="Toggle Airplane Mode to test 100% on-device AI"
          >
            {airplaneMode ? (
              <WifiOff size={10} strokeWidth={2} className="text-yellow-400" />
            ) : (
              <Wifi size={10} strokeWidth={2} className="text-slate-400" />
            )}
            <span className={airplaneMode ? 'text-yellow-400 font-bold' : ''}>
              {airplaneMode ? 'OFFLINE' : '5G'}
            </span>
          </button>

          <div className="flex items-center gap-0.5">
            <Battery size={10} strokeWidth={2} className="text-slate-400" />
            <span>{batteryLevel}%</span>
          </div>
        </div>
      </div>

      {/* Brand Header */}
      <div className="flex items-center justify-between px-3.5 py-1.5">
        <div className="flex items-center gap-2">
          {/* iQOO Brand Logo Pill */}
          <div className="w-5 h-5 rounded-md bg-[#FFDE00] flex items-center justify-center font-display font-black text-black text-[10px] leading-none tracking-tighter shadow-sm">
            Q
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-xs tracking-wider text-white uppercase leading-none">
                MEMORY
              </span>
              <span className="text-[7px] font-mono font-bold bg-[#161822] text-yellow-400 border border-yellow-400/25 px-1 py-0.2 rounded uppercase leading-none">
                NPU V4
              </span>
            </div>
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wide mt-0.5 leading-none">
              On-Device Layer
            </span>
          </div>
        </div>

        {/* Actions: Install App & Local Safe Badge */}
        <div className="flex items-center gap-1.5">
          {!isInstalled && (
            <button
              onClick={handleInstallClick}
              className="iqoo-badge iqoo-badge-yellow !text-[8px] !px-2 !py-1 cursor-pointer flex items-center gap-1 font-mono hover:bg-yellow-300 transition-colors shadow-sm"
              title="Install MEMORY as native Progressive Web App"
            >
              <Download size={9} strokeWidth={2.5} className="text-black" />
              <span>INSTALL</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-[#11131A] border border-white/8 px-2 py-1 rounded-full">
            <ShieldCheck size={11} strokeWidth={2} className="text-yellow-400" />
            <span className="text-[8px] font-bold text-slate-300 font-mono uppercase tracking-wider leading-none">
              Local Safe
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
