import { useState, useCallback, CSSProperties } from "react";

export interface Tilt3DOptions {
  max?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  easing?: string;
  reset?: boolean;
  glare?: boolean;
  maxGlare?: number;
}

export interface Tilt3DReturn {
  ref: (node: HTMLElement | null) => void;
  style: CSSProperties;
  onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
}

export const use3DTilt = (options: Tilt3DOptions = {}): Tilt3DReturn => {
  const {
    max = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 400,
    easing = "cubic-bezier(0.03, 0.98, 0.52, 0.99)",
    reset = true,
    glare = false,
    maxGlare = 0.5,
  } = options;

  const [element, setElement] = useState<HTMLElement | null>(null);
  const [tiltStyle, setTiltStyle] = useState<CSSProperties>({});

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // คำนวณมุมเอียง
      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;

      const rotateY = percentX * max;
      const rotateX = -percentY * max;

      // คำนวณแสงสะท้อน
      const glareX = percentX * 100;
      const glareY = percentY * 100;

      const newStyle: CSSProperties = {
        transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
        transition: `transform ${speed * 0.001}s ${easing}`,
      };

      // เพิ่มเอฟเฟกต์แสงถ้าเปิดใช้งาน
      if (glare) {
        newStyle.background = `
          radial-gradient(
            circle at ${50 + glareX}% ${50 + glareY}%,
            rgba(255, 255, 255, ${maxGlare}) 0%,
            transparent 80%
          )
        `;
      }

      setTiltStyle(newStyle);
    },
    [element, max, perspective, scale, speed, easing, glare, maxGlare]
  );

  const handleMouseLeave = useCallback(() => {
    if (reset) {
      setTiltStyle({
        transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transition: `transform ${speed * 0.001}s ${easing}`,
      });
    }
  }, [reset, perspective, speed, easing]);

  return {
    ref: setElement,
    style: tiltStyle,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
};
