'use client';

import { useState } from 'react';
import DesktopIcon from './desktopIcon';
import { useRouter } from 'next/navigation';

export default function DesktopEnvironment() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const clearSelection = () => {
    setSelectedIndex(null);
  };

  return (
    <div className="desktop-app-container">
      <DesktopIcon
        src="/icons/directory_explorer-0.png"
        label="Dashboard"
        onDoubleClick={() => {
          clearSelection();
          router.push('/dashboard');
        }}
        index={0}
        selected={selectedIndex === 0}
        onSelect={() => setSelectedIndex(0)}
      />
      <DesktopIcon
        src="/icons/recycle_bin_full_cool-0.png"
        label="Recycle Bin"
        onDoubleClick={() => { clearSelection(); }}
        index={2}
        selected={selectedIndex === 2}
        onSelect={() => setSelectedIndex(2)} 
      />
      <DesktopIcon
        src="/icons/briefcase-4.png"
        label="My Briefcase"
        onDoubleClick={() => { clearSelection(); }}
        index={3}
        selected={selectedIndex === 3}
        onSelect={() => setSelectedIndex(3)} 
      />
      <DesktopIcon
        src="/icons/directory_closed_cool-3.png"
        label="Online Services"
        onDoubleClick={() => { clearSelection(); }}
        index={4}
        selected={selectedIndex === 4}
        onSelect={() => setSelectedIndex(4)} 
      />

    </div>
  );
}
