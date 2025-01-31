import { useEffect, useState } from 'react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile via a simple media query for "coarse" pointers or user-agent:
  useEffect(() => {
    const matchCoarse = window.matchMedia('(pointer: coarse)');
    setIsMobile(matchCoarse.matches);

    const handleChange = () => setIsMobile(matchCoarse.matches);
    matchCoarse.addEventListener('change', handleChange);
    return () => matchCoarse.removeEventListener('change', handleChange);
  }, []);

  return isMobile;
};

export default useIsMobile;
