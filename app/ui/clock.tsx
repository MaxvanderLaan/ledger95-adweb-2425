'use client';

import { useEffect, useState } from 'react';

export default function Clock() {
  const [time, setTime] = useState<string>(() => new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formatted = now.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      });
      setTime(formatted);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return <div>{time}</div>;
}
