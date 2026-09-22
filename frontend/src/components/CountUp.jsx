import React, { useState, useEffect } from 'react';

// Numbers ko smoothly animate karne ke liye simple component (from HMS screenshot)
export default function CountUp({ end = 0, duration = 1000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const finalVal = parseInt(end, 10) || 0;
    if (finalVal === 0) {
      setCount(0);
      return;
    }

    const stepTime = Math.abs(Math.floor(duration / finalVal)) || 50;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= finalVal) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count}</span>;
}
