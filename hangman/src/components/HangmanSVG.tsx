interface HangmanSVGProps {
  wrongCount: number;
}

const PARTS = [
  <path key="1" d="M1,11 h8" />,
  <path key="2" d="M9,11 v-10" />,
  <path key="3" d="M9,1 h-4" />,
  <path key="4" d="M5,1 v2" />,
  <circle key="5" cx="5" cy="4" r="1" />,
  <path key="6" d="M5,5 v3" />,
  <path key="7" d="M5,5 l-2,2" />,
  <path key="8" d="M5,5 l2,2" />,
  <path key="9" d="M5,8 l-2,2" />,
  <path key="10" d="M5,8 l2,2" />,
];

export function HangmanSVG({ wrongCount }: HangmanSVGProps) {
  const visible = Math.min(4 + wrongCount, PARTS.length);
  return (
    <svg
      viewBox="0 0 10 12"
      style={{ width: '100%', maxWidth: 200, height: 'auto' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          .hangman-part path, .hangman-part circle {
            stroke: #707070; stroke-width: 0.1; stroke-linecap: round; fill: none;
          }
          .hangman-part {
            opacity: 0;
            animation: hangman-fade-in 0.35s ease-out forwards;
          }
          @keyframes hangman-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
      {PARTS.slice(0, visible).map((part) => (
        <g key={part.key} className="hangman-part">
          {part}
        </g>
      ))}
    </svg>
  );
}
