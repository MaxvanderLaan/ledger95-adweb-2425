'use client';

import { useEffect, useState } from 'react';

export default function Clock() {
    // React "state" example, time holds the time value and setTime updates it. 
    // useState<string> is a hook that initizalizes the current time.
  const [time, setTime] = useState<string>(() => new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  }));

  // React "hook" example, when setTime is called useEffect rerenders the component.
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formatted = now.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      });
      // setTime is the set method of the react "state" used above, it causes a rerender from the useEffect hook.
      setTime(formatted);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return <div>{time}</div>;
}
