'use client';

import Image from 'next/image';

interface DesktopIconProps {
  src: string;
  label: string;
  onDoubleClick?: () => void;
  selected: boolean;
  index: number;
  onSelect: () => void;
}


export default function DesktopIcon({ src, label, onDoubleClick, selected, index, onSelect }: DesktopIconProps) {
  let clickTimeout: NodeJS.Timeout;

  const handleClick = () => {
      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        onSelect();
      }, 200);
  };

  const handleDoubleClick = () => {
    clearTimeout(clickTimeout);
    if (onDoubleClick) {
      onDoubleClick();
    }
  };

  return (
    <div
      className={`desktop-icon ${selected ? 'selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <Image width={64} height={64} src={src} alt={label} />
      <div className="desktop-label">{label}</div>
    </div>
  );
}
