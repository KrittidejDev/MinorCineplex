import { useState, useEffect } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition({ x: window.scrollX, y: window.scrollY });
    };

    window.addEventListener('scroll', updatePosition);
    updatePosition();

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
};

export const useElementInViewport = (elementRef: React.RefObject<HTMLElement | null>) => {
  const [isInViewport, setIsInViewport] = useState(true);

  useEffect(() => {
    const checkInViewport = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // ตรวจสอบว่า element อยู่ใน viewport หรือไม่
      const inViewport = rect.top < windowHeight && rect.bottom > 0;
      setIsInViewport(inViewport);
    };

    window.addEventListener('scroll', checkInViewport);
    window.addEventListener('resize', checkInViewport);
    checkInViewport();

    return () => {
      window.removeEventListener('scroll', checkInViewport);
      window.removeEventListener('resize', checkInViewport);
    };
  }, [elementRef]);

  return isInViewport;
};
