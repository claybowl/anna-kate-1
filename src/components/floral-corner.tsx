export function FloralCorner({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const isLeft = position.includes("left");
  const isTop = position.includes("top");

  // Right side = horizontal mirror of left. Bottom = rotated 180 so vine goes up.
  const transform = isTop
    ? (isLeft ? "" : "scaleX(-1)")
    : (isLeft ? "rotate(180deg)" : "rotate(180deg) scaleX(-1)");

  return (
    <div
      className={`pointer-events-none absolute ${isTop ? "top-0" : "bottom-0"} ${isLeft ? "left-0" : "right-0"} z-0`}
      style={{ transform, transformOrigin: "center" }}
    >
      <svg
        width="500"
        height="900"
        viewBox="0 0 500 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-75"
      >
        {/* Main vine — thick bold stem */}
        <path
          d="M20 0 C50 60, 90 80, 75 150 C60 220, 100 260, 80 340 C60 420, 95 460, 70 540 C45 620, 85 660, 60 740 C35 820, 70 860, 45 900"
          stroke="#355E3B"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Secondary vine */}
        <path
          d="M10 40 C40 80, 70 85, 58 140 C46 195, 80 215, 65 270 C50 325, 75 350, 60 400"
          stroke="#8A9A5B"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* ============================== */}
        {/* DISCO FLOWER 1: MASSIVE burnt orange — SPINNING */}
        {/* ============================== */}
        <g className="animate-spin" style={{ transformOrigin: "60px 80px", animationDuration: "18s", animationTimingFunction: "linear" }}>
          <g transform="translate(60, 80)">
            {/* Bold chunky petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <ellipse
                key={angle}
                cx={Math.cos((angle * Math.PI) / 180) * 38}
                cy={Math.sin((angle * Math.PI) / 180) * 38}
                rx="26"
                ry="14"
                fill="#CC5500"
                stroke="#8B3A00"
                strokeWidth="2"
                transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 38}, ${Math.sin((angle * Math.PI) / 180) * 38})`}
              />
            ))}
            {/* Inner ring */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <ellipse
                key={`inner-${angle}`}
                cx={Math.cos((angle * Math.PI) / 180) * 20}
                cy={Math.sin((angle * Math.PI) / 180) * 20}
                rx="14"
                ry="7"
                fill="#E06600"
                transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 20}, ${Math.sin((angle * Math.PI) / 180) * 20})`}
              />
            ))}
            <circle cx="0" cy="0" r="14" fill="#E1B200" stroke="#8B3A00" strokeWidth="2" />
            <circle cx="0" cy="0" r="8" fill="#CC5500" />
          </g>
        </g>

        {/* ============================== */}
        {/* DISCO FLOWER 2: HUGE mustard yellow sunflower */}
        {/* ============================== */}
        <g transform="translate(90, 220)">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
            <ellipse
              key={angle}
              cx={Math.cos((angle * Math.PI) / 180) * 42}
              cy={Math.sin((angle * Math.PI) / 180) * 42}
              rx="22"
              ry="10"
              fill="#E1B200"
              stroke="#B89600"
              strokeWidth="2"
              transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 42}, ${Math.sin((angle * Math.PI) / 180) * 42})`}
            />
          ))}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
            <ellipse
              key={`inner-${angle}`}
              cx={Math.cos((angle * Math.PI) / 180) * 22}
              cy={Math.sin((angle * Math.PI) / 180) * 22}
              rx="12"
              ry="5"
              fill="#C9A000"
              transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 22}, ${Math.sin((angle * Math.PI) / 180) * 22})`}
            />
          ))}
          <circle cx="0" cy="0" r="16" fill="#CC5500" stroke="#8B3A00" strokeWidth="2" />
          <circle cx="0" cy="0" r="9" fill="#A0522D" />
        </g>

        {/* ============================== */}
        {/* DISCO FLOWER 3: BIG hunter green — SPINNING reverse */}
        {/* ============================== */}
        <g className="animate-spin" style={{ transformOrigin: "55px 400px", animationDuration: "24s", animationTimingFunction: "linear", animationDirection: "reverse" }}>
          <g transform="translate(55, 400)">
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <ellipse
                key={angle}
                cx={Math.cos((angle * Math.PI) / 180) * 35}
                cy={Math.sin((angle * Math.PI) / 180) * 35}
                rx="24"
                ry="12"
                fill="#355E3B"
                stroke="#2a4a2f"
                strokeWidth="2"
                transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 35}, ${Math.sin((angle * Math.PI) / 180) * 35})`}
              />
            ))}
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <ellipse
                key={`inner-${angle}`}
                cx={Math.cos((angle * Math.PI) / 180) * 18}
                cy={Math.sin((angle * Math.PI) / 180) * 18}
                rx="12"
                ry="6"
                fill="#4a7a52"
                transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 18}, ${Math.sin((angle * Math.PI) / 180) * 18})`}
              />
            ))}
            <circle cx="0" cy="0" r="12" fill="#E1B200" stroke="#2a4a2f" strokeWidth="2" />
            <circle cx="0" cy="0" r="6" fill="#8A9A5B" />
          </g>
        </g>

        {/* ============================== */}
        {/* DISCO FLOWER 4: MASSIVE terracotta — SPINNING */}
        {/* ============================== */}
        <g className="animate-spin" style={{ transformOrigin: "75px 580px", animationDuration: "22s", animationTimingFunction: "linear" }}>
          <g transform="translate(75, 580)">
            {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle) => (
              <ellipse
                key={angle}
                cx={Math.cos((angle * Math.PI) / 180) * 36}
                cy={Math.sin((angle * Math.PI) / 180) * 36}
                rx="22"
                ry="11"
                fill="#A0522D"
                stroke="#7a3a1a"
                strokeWidth="2"
                transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 36}, ${Math.sin((angle * Math.PI) / 180) * 36})`}
              />
            ))}
            {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle) => (
              <ellipse
                key={`inner-${angle}`}
                cx={Math.cos((angle * Math.PI) / 180) * 18}
                cy={Math.sin((angle * Math.PI) / 180) * 18}
                rx="12"
                ry="5.5"
                fill="#B87333"
                transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 18}, ${Math.sin((angle * Math.PI) / 180) * 18})`}
              />
            ))}
            <circle cx="0" cy="0" r="13" fill="#E1B200" stroke="#7a3a1a" strokeWidth="2" />
            <circle cx="0" cy="0" r="7" fill="#CC5500" />
          </g>
        </g>

        {/* ============================== */}
        {/* DISCO FLOWER 5: BIG copper rose — SPINNING */}
        {/* ============================== */}
        <g className="animate-spin" style={{ transformOrigin: "50px 760px", animationDuration: "28s", animationTimingFunction: "linear", animationDirection: "reverse" }}>
          <g transform="translate(50, 760)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <ellipse
                key={angle}
                cx={Math.cos((angle * Math.PI) / 180) * 32}
                cy={Math.sin((angle * Math.PI) / 180) * 32}
                rx="20"
                ry="10"
                fill="#B87333"
                stroke="#8a5522"
                strokeWidth="2"
                transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 32}, ${Math.sin((angle * Math.PI) / 180) * 32})`}
              />
            ))}
            <circle cx="0" cy="0" r="11" fill="#CC5500" stroke="#8a5522" strokeWidth="2" />
            <circle cx="0" cy="0" r="6" fill="#E1B200" />
          </g>
        </g>

        {/* ============================== */}
        {/* MEDIUM FLOWERS scattered between the big ones */}
        {/* ============================== */}

        {/* Sage green medium */}
        <g transform="translate(100, 150)">
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx={Math.cos((angle * Math.PI) / 180) * 24}
              cy={Math.sin((angle * Math.PI) / 180) * 24}
              rx="14"
              ry="7"
              fill="#8A9A5B"
              stroke="#6a7a4b"
              strokeWidth="1.5"
              transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 24}, ${Math.sin((angle * Math.PI) / 180) * 24})`}
            />
          ))}
          <circle cx="0" cy="0" r="8" fill="#E1B200" />
        </g>

        {/* Avocado medium */}
        <g transform="translate(30, 310)">
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse
              key={angle}
              cx={Math.cos((angle * Math.PI) / 180) * 22}
              cy={Math.sin((angle * Math.PI) / 180) * 22}
              rx="13"
              ry="6"
              fill="#7B8C3A"
              stroke="#5a6a2a"
              strokeWidth="1.5"
              transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 22}, ${Math.sin((angle * Math.PI) / 180) * 22})`}
            />
          ))}
          <circle cx="0" cy="0" r="7" fill="#E1B200" />
        </g>

        {/* Sienna medium */}
        <g transform="translate(110, 480)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <ellipse
              key={angle}
              cx={Math.cos((angle * Math.PI) / 180) * 20}
              cy={Math.sin((angle * Math.PI) / 180) * 20}
              rx="12"
              ry="6"
              fill="#A0522D"
              stroke="#7a3a1a"
              strokeWidth="1.5"
              transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 20}, ${Math.sin((angle * Math.PI) / 180) * 20})`}
            />
          ))}
          <circle cx="0" cy="0" r="7" fill="#E1B200" />
        </g>

        {/* Mustard small bud */}
        <g transform="translate(40, 670)">
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse
              key={angle}
              cx={Math.cos((angle * Math.PI) / 180) * 16}
              cy={Math.sin((angle * Math.PI) / 180) * 16}
              rx="10"
              ry="5"
              fill="#E1B200"
              stroke="#B89600"
              strokeWidth="1.5"
              transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 16}, ${Math.sin((angle * Math.PI) / 180) * 16})`}
            />
          ))}
          <circle cx="0" cy="0" r="5.5" fill="#CC5500" />
        </g>

        {/* ============================== */}
        {/* BIG CHUNKY LEAVES */}
        {/* ============================== */}
        <g transform="translate(35, 110) rotate(40)">
          <path d="M0 0 C18 -10, 45 -5, 50 10 C45 20, 18 15, 0 0Z" fill="#355E3B" stroke="#2a4a2f" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="45" y2="7" stroke="#2a4a2f" strokeWidth="1" opacity="0.5" />
        </g>
        <g transform="translate(95, 280) rotate(-30)">
          <path d="M0 0 C18 -10, 45 -5, 50 10 C45 20, 18 15, 0 0Z" fill="#8A9A5B" stroke="#6a7a4b" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="45" y2="7" stroke="#6a7a4b" strokeWidth="1" opacity="0.4" />
        </g>
        <g transform="translate(25, 350) rotate(50)">
          <path d="M0 0 C15 -8, 38 -4, 42 8 C38 16, 15 12, 0 0Z" fill="#355E3B" stroke="#2a4a2f" strokeWidth="1.5" />
        </g>
        <g transform="translate(100, 510) rotate(-40)">
          <path d="M0 0 C18 -10, 45 -5, 50 10 C45 20, 18 15, 0 0Z" fill="#7B8C3A" stroke="#5a6a2a" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="45" y2="7" stroke="#5a6a2a" strokeWidth="1" opacity="0.4" />
        </g>
        <g transform="translate(30, 620) rotate(35)">
          <path d="M0 0 C15 -8, 38 -4, 42 8 C38 16, 15 12, 0 0Z" fill="#8A9A5B" stroke="#6a7a4b" strokeWidth="1.5" />
        </g>
        <g transform="translate(90, 690) rotate(-25)">
          <path d="M0 0 C18 -10, 45 -5, 50 10 C45 20, 18 15, 0 0Z" fill="#355E3B" stroke="#2a4a2f" strokeWidth="1.5" />
        </g>
        <g transform="translate(20, 830) rotate(45)">
          <path d="M0 0 C15 -8, 38 -4, 42 8 C38 16, 15 12, 0 0Z" fill="#8A9A5B" stroke="#6a7a4b" strokeWidth="1.5" />
        </g>

        {/* Decorative berries */}
        <circle cx="65" cy="130" r="5" fill="#CC5500" opacity="0.6" />
        <circle cx="40" cy="260" r="4" fill="#E1B200" opacity="0.5" />
        <circle cx="85" cy="370" r="5" fill="#A0522D" opacity="0.6" />
        <circle cx="30" cy="490" r="4" fill="#CC5500" opacity="0.5" />
        <circle cx="70" cy="660" r="5" fill="#E1B200" opacity="0.5" />
        <circle cx="45" cy="850" r="4" fill="#B87333" opacity="0.5" />
      </svg>
    </div>
  );
}
