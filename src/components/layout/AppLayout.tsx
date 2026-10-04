import React from 'react';
import { Outlet } from 'react-router-dom';
import { StardustBackground } from './StardustBackground';
import { OfflineBanner } from './OfflineBanner';
import { HeaderHUD } from './HeaderHUD';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileNav } from './MobileNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-sky-100 dark:bg-space-950 text-slate-800 dark:text-slate-100 selection:bg-neon-cyan/25 selection:text-neon-cyan relative">
      {/* Background Stardust Particles */}
      <StardustBackground />

      {/* Desktop Navigation Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8 relative z-10">
        <OfflineBanner />
        <HeaderHUD />
        
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile-first Bottom Navigation Dock */}
      <MobileNav />
    </div>
  );
};
