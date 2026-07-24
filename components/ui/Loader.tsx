"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  isLoading: boolean;
}

export default function Loader({ isLoading }: LoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md bg-navy-950/30"
        >
          <style>{`
            .vw-loader {
              --navy: #0F172A;
              --copper: #B87333;
              --spark: #22FF44;
              --ring-line: rgba(15,23,42,.13);
              --label-ink: rgba(15,23,42,.62);
              position: relative;
              width: clamp(168px, 24vw, 232px);
              aspect-ratio: 1;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .vw-loader__ring {
              position: absolute; inset: 0; width: 100%; height: 100%;
              opacity: 0;
              animation: ringIn .5s ease-out .05s forwards;
            }
            @keyframes ringIn { from { opacity: 0; transform: scale(.93); } to { opacity: 1; transform: scale(1); } }

            .vw-ring-sweep {
              transform-box: fill-box; transform-origin: 50% 50%;
              animation: ringSweep 2.6s linear infinite;
              will-change: transform;
            }
            @keyframes ringSweep { to { transform: rotate(360deg); } }

            .vw-loader__mark {
              position: absolute;
              inset: 19%;
              animation: markBreathe 4.2s ease-in-out 1.9s infinite;
              transform-box: fill-box; transform-origin: 50% 50%;
            }
            @keyframes markBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.018); } }

            .vw-mark path { transform-box: fill-box; transform-origin: 50% 50%; }

            .vw-wing {
              opacity: 0;
              animation:
                wingIn .6s cubic-bezier(.34,1.56,.64,1) calc(.15s + var(--i) * .08s) 1 forwards,
                wingShimmer 2.8s ease-in-out calc(1.3s + var(--i) * .15s) infinite;
            }
            @keyframes wingIn {
              0% { opacity: 0; transform: scale(.55) translateY(9px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes wingShimmer {
              0%, 100% { filter: brightness(1); }
              50% { filter: brightness(1.09); }
            }

            .vw-eye-group {
              opacity: 0;
              animation: eyeIn .55s cubic-bezier(.34,1.9,.64,1) 1.05s 1 forwards;
            }
            @keyframes eyeIn { 0% { opacity: 0; transform: scale(0); } 100% { opacity: 1; transform: scale(1); } }

            .vw-eye-pulse {
              animation: eyePulse 1.7s ease-in-out 1.75s infinite;
              will-change: transform, filter;
            }
            @keyframes eyePulse {
              0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(184,115,51,.5)); }
              50% { transform: scale(1.13); filter: drop-shadow(0 0 9px rgba(184,115,51,.85)); }
            }

            .vw-loader__flash {
              position: absolute; inset: 0;
              border-radius: 50%;
              background: radial-gradient(circle, rgba(184,115,51,.55), rgba(184,115,51,0) 68%);
              opacity: 0;
              animation: flash .7s ease-out 1.05s 1;
              pointer-events: none;
            }
            @keyframes flash { 0% { opacity: 0; } 45% { opacity: .9; } 100% { opacity: 0; } }

            .vw-loader__label {
              position: absolute; left: 50%; bottom: -2.6em;
              transform: translateX(-50%);
              display: flex; align-items: center; gap: .5em;
              font-family: 'IBM Plex Mono', ui-monospace, Menlo, monospace;
              font-size: 11px; font-weight: 500; letter-spacing: .32em;
              color: var(--label-ink);
              opacity: 0;
              animation: labelIn .5s ease-out .45s forwards;
              white-space: nowrap;
            }
            @keyframes labelIn { from { opacity: 0; transform: translate(-50%,4px); } to { opacity: 1; transform: translate(-50%,0); } }

            .vw-label__dots { display: inline-flex; gap: 3px; }
            .vw-dot {
              width: 3px; height: 3px; border-radius: 50%;
              background: var(--copper);
              opacity: .25;
              animation: dotPulse 1.4s ease-in-out calc(.9s + var(--i) * .18s) infinite;
            }
            @keyframes dotPulse { 0%, 100% { opacity: .25; } 50% { opacity: 1; } }
          `}</style>

          <motion.div 
            initial={{ scale: 0.9, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 10, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-warm-50 p-12 rounded-2xl shadow-2xl flex items-center justify-center border border-navy-100"
          >
            <div className="vw-loader">
              <svg className="vw-loader__ring" viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="46" fill="none" stroke="var(--ring-line)" strokeWidth="1"/>
                <line x1="50" y1="1.5" x2="50" y2="7.5" stroke="var(--navy)" strokeWidth="1.4" opacity=".38"/>
                <line x1="50" y1="92.5" x2="50" y2="98.5" stroke="var(--navy)" strokeWidth="1" opacity=".16"/>
                <line x1="1.5" y1="50" x2="7.5" y2="50" stroke="var(--navy)" strokeWidth="1" opacity=".16"/>
                <line x1="92.5" y1="50" x2="98.5" y2="50" stroke="var(--navy)" strokeWidth="1" opacity=".16"/>
                <circle className="vw-ring-sweep" cx="50" cy="50" r="46" fill="none" stroke="var(--copper)"
                        strokeWidth="2" strokeLinecap="round" strokeDasharray="28 261"/>
              </svg>

              <div className="vw-loader__flash"></div>

              <svg className="vw-loader__mark" viewBox="0 0 1024 1024" aria-hidden="true">
                <g className="vw-mark">
                  <path className="vw-wing" style={{ '--i': 0 } as any} fill="var(--navy)" d="M170.402 720.21C121.12 660.417 92.5034 595.919 83.0561 525.752C72.6263 448.288 88.7103 374.723 134.11 305.746C170.511 250.44 221.647 205.228 294.418 177.733C365.372 150.925 439.27 146.056 515.348 162.413C531.82 165.955 548.188 169.702 563.749 175.296C568.963 177.171 574.696 178.631 577 184.67C560.99 180.828 545.116 176.583 528.948 173.209C427.629 152.064 334.578 166.137 252.38 216.977C200.237 249.227 177.283 295.155 168.812 345.425C157.249 414.048 170.475 481.145 193.344 547.316C215.577 611.645 250.075 672.03 290.153 730.579C291.787 732.967 295.023 735.164 291.199 740.595C181.441 634.488 130.683 513.775 129.591 378.926C119.14 399.857 115.292 421.986 113.357 444.095C105.009 539.481 136.031 627.091 201.239 707.346C248.999 766.127 310.715 814.557 383.088 854.766C385.327 856.01 387.395 857.468 389.367 858.968C389.889 859.366 389.754 860.295 389.921 860.986C346.562 862.223 219.402 780.827 170.402 720.21Z"/>
                  <path className="vw-wing" style={{ '--i': 1 } as any} fill="var(--navy)" d="M831.71 751.836C772.525 820.579 692.476 863.517 588.862 876.746C534.266 883.717 480.232 879.817 428.752 861.852C354.154 835.818 311.955 782.156 313.02 715.892C313.792 667.791 337.919 626.29 370.06 587.089C411.222 536.886 465.02 495.299 520.836 455.492C603.985 396.192 688.305 337.906 772.187 279.242C778.899 274.549 786.083 270.273 794.301 265C795.521 271.566 790.567 273.699 787.316 276.311C709.726 338.658 626.818 396.592 545.956 456.231C484.926 501.243 425.171 547.337 383.059 605.217C358.191 639.397 340.797 675.554 340.487 715.419C339.982 780.422 387.111 829.529 466.393 848.004C534.505 863.876 600.946 858.495 665.096 836.325C774.763 798.425 840.674 731.471 869.291 641.109C889.939 575.912 880.058 512.181 851.404 449.673C849.742 446.047 846.556 442.659 847.872 438.33C870.448 450.699 896.48 534.991 894.934 595.447C893.489 651.986 871.16 703.746 831.71 751.836Z"/>
                  <path className="vw-wing" style={{ '--i': 2 } as any} fill="var(--navy)" d="M699.583 222.571C631.889 288.226 563.227 352.123 481.724 406.635C446.781 430.007 409.481 450.616 366.451 463.716C318.079 478.443 266.698 474.545 238.037 443.83C216.469 420.717 211.518 393.881 215.029 366.201C220.033 326.751 237.755 290.269 260.393 255.147C261.144 253.983 262.589 253.094 264.833 251.059C268.128 257.342 264.321 261.803 262.411 266.11C249.041 296.251 237.27 326.675 233.933 358.706C231.433 382.697 235.633 405.719 251.323 426.779C268.212 449.45 301.71 458.666 338.398 451.044C388.798 440.575 429.615 416.996 468.862 391.515C561.012 331.688 638.277 260.598 715.956 189.78C761.125 148.599 803.173 105.476 846.498 63.1464C855.31 54.5361 865.296 47.0219 880.443 51.1788C895.175 55.2217 898.281 66.1708 899.448 76.8415C902.319 103.071 893.579 128.049 882.726 152.276C868.734 183.507 847.777 212.136 823.287 239.085C820.492 242.16 818.154 246.055 811.359 247.061C810.702 240.967 815.324 236.773 818.494 232.328C844.327 196.11 865.16 158.427 874.422 117.222C876.454 108.183 876.276 99.1614 875.382 90.1652C874.708 83.3883 870.756 76.9454 862.483 74.4789C853.811 71.8935 847.63 77.3566 842.74 82.0089C825.721 98.2023 809.184 114.709 792.501 131.121C761.723 161.398 730.971 191.691 699.583 222.571Z"/>
                  <path className="vw-wing" style={{ '--i': 3 } as any} fill="var(--navy)" d="M681.057 529.833C705.874 505.33 719.8 476.921 738.014 447C741.689 456.119 739.449 461.906 737.781 467.464C722.216 519.33 683.747 560.104 636.374 596.808C592.345 630.92 541.367 658.842 497.808 693.339C484.09 704.202 471.883 715.853 462.34 729.237C438.351 762.881 451.489 797.91 495.09 815.527C507.838 820.677 521.318 824.289 535.415 826.672C541.819 827.754 549.165 827.446 555.559 832.301C544.425 835.914 534.804 832.782 525.191 831.862C506.635 830.087 489.092 825.709 473.109 818.122C430.916 798.094 417.876 763.077 438.842 726.897C458.161 693.558 492.054 670.088 526.866 647.268C581.742 611.295 637.368 575.934 681.057 529.833Z"/>
                  <path className="vw-wing" style={{ '--i': 4 } as any} fill="var(--navy)" d="M823.538 293.728C824.71 281.096 820.876 270.444 812.476 260.965C824.23 254.477 832.904 255.945 839.909 265.419C848.206 276.64 846.47 289.251 843.753 300.747C834.644 339.29 807.322 369.535 771.063 395.154C769.695 396.121 767.94 396.642 764 394.555C789.827 363.661 818.979 333.598 823.538 293.728Z"/>
                  <g className="vw-eye-group">
                    <g className="vw-eye-pulse">
                      <path fill="var(--copper)" d="M571.193 507.608C608.782 503.249 607.755 523.188 598.874 540.143C585.14 566.364 562.948 581.907 528.287 564.852C525.083 535.195 549.281 524.283 571.193 507.608Z"/>
                      <path fill="var(--spark)" d="M574.388 542.094C580.818 541.423 580.642 544.49 579.123 547.099C576.774 551.133 572.978 553.524 567.049 550.9C566.501 546.338 570.64 544.659 574.388 542.094Z"/>
                    </g>
                  </g>
                </g>
              </svg>

              <div className="vw-loader__label">
                <span>LOADING</span>
                <span className="vw-label__dots" aria-hidden="true">
                  <span className="vw-dot" style={{ '--i': 0 } as any}></span>
                  <span className="vw-dot" style={{ '--i': 1 } as any}></span>
                  <span className="vw-dot" style={{ '--i': 2 } as any}></span>
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
