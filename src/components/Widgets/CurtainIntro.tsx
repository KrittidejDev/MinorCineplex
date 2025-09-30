import React, { useEffect, useState } from "react";
import LogoM from "../Icons/LogoM";

type CurtainIntroProps = {
  durationMs?: number;
  onComplete?: () => void;
  className?: string;
  showLogo?: boolean; // if true, show LogoM in center; default false per request: fabric only
};

const CurtainIntro: React.FC<CurtainIntroProps> = ({ durationMs = 2000, onComplete, className, showLogo = false }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, durationMs);
    return () => clearTimeout(timeout);
  }, [durationMs, onComplete]);

  if (!visible) return null;

  return (
    <div className={`mc-curtain-intro ${className ?? ""}`}>
      <div className="curtain left">
        <div className="folds" />
      </div>
      <div className="curtain right">
        <div className="folds" />
      </div>
      {showLogo && (
        <div className="logo-wrap">
          <LogoM width={192} height={221} />
        </div>
      )}

      <style jsx>{`
        .mc-curtain-intro {
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: none;
          background: transparent;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .curtain {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50vw;
          /* Layered gradients to simulate pleated stripes */
          background:
            /* deep vignette on edges */
            radial-gradient(120% 100% at 0% 50%, rgba(0,0,0,0.55), transparent 60%),
            radial-gradient(120% 100% at 100% 50%, rgba(0,0,0,0.55), transparent 60%),
            /* vertical soft shadows */
            repeating-linear-gradient(
              to right,
              rgba(0,0,0,0.55) 0px,
              rgba(0,0,0,0.55) 6px,
              rgba(255,255,255,0.08) 6px,
              rgba(255,255,255,0.08) 10px,
              rgba(0,0,0,0.35) 10px,
              rgba(0,0,0,0.35) 20px
            ),
            /* base red silk */
            linear-gradient(90deg, #7a0a0a 0%, #b31217 30%, #d61b1b 60%, #7a0a0a 100%);
          background-size:
            auto 100%,
            auto 100%,
            38px 100%,
            auto 100%;
          background-position:
            0 0,
            100% 0,
            0 0,
            0 0;
          box-shadow: inset 0 0 80px rgba(0,0,0,0.6);
          transform: translateX(0) translateZ(0);
          will-change: transform, background-position;
          animation:
            curtain-open ${durationMs}ms ease-in forwards,
            fabric-wave 2200ms ease-in-out infinite alternate;
        }

        .curtain.left { left: 0; transform-origin: left center; }
        .curtain.right {
          right: 0;
          transform-origin: right center;
          /* Must re-declare full animation list; setting animation-name alone overrides the list */
          animation:
            curtain-open-right ${durationMs}ms ease-in forwards,
            fabric-wave 2200ms ease-in-out infinite alternate;
        }

        /* Extra animated folds layer to enhance motion parallax */
        .curtain .folds {
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(
              to right,
              rgba(0,0,0,0.45) 0,
              rgba(0,0,0,0.45) 2px,
              rgba(255,255,255,0.12) 2px,
              rgba(255,255,255,0.12) 6px,
              rgba(0,0,0,0.25) 6px,
              rgba(0,0,0,0.25) 14px
            );
          mix-blend-mode: multiply;
          opacity: 0.55;
          pointer-events: none;
          will-change: transform, background-position;
          animation: folds-wave 1800ms ease-in-out infinite alternate;
        }

        .logo-wrap {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: min(34vw, 264px);
          height: min(34vw, 264px);
          border-radius: 0;
          background: transparent;
          /* wrapper stays static; animation runs on the svg */
          animation: none;
        }

        /* Animate SVG inside without altering layout box */
        .logo-wrap :global(svg) {
          transform-origin: center;
          opacity: 0.98;
          /* Keep it GPU-friendly: transform + opacity only (no filters during animation) */
          will-change: transform, opacity;
          backface-visibility: hidden;
          transform: translateZ(0);
          animation: logo-zoom-fade ${durationMs}ms ease-out forwards;
        }

        @keyframes curtain-open {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }

        @keyframes curtain-open-right {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }

        /* Subtle fabric waving by shifting the repeating stripes; no transform here to avoid overriding slide-open */
        @keyframes fabric-wave {
          0% {
            background-position:
              0 0,
              100% 0,
              0 0,
              0 0;
          }
          25% {
            background-position:
              0 0,
              100% 0,
              -6px 0,
              0 0;
          }
          50% {
            background-position:
              0 0,
              100% 0,
              -10px 0,
              0 0;
          }
          75% {
            background-position:
              0 0,
              100% 0,
              -4px 0,
              0 0;
          }
          100% {
            background-position:
              0 0,
              100% 0,
              -12px 0,
              0 0;
          }
        }

        @keyframes folds-wave {
          0% { background-position: 0 0; transform: translateX(0) skewY(0deg); }
          50% { background-position: -10px 0; transform: translateX(0.2%) skewY(0.3deg); }
          100% { background-position: -20px 0; transform: translateX(-0.2%) skewY(-0.3deg); }
        }

        @keyframes logo-zoom-fade {
          0% { opacity: 1; transform: scale(1.22); }
          100% { opacity: 0; transform: scale(0.82); }
        }
      `}</style>
    </div>
  );
};

export default CurtainIntro;


