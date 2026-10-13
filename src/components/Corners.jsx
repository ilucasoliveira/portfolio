// cantos com voluta para molduras (desenho original)
function Flourish({ className }) {
  return (
    <svg className={`corner ${className}`} viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path d="M1 25V8c0-4 3-7 7-7h17" stroke="currentColor" strokeWidth="1" />
      <path d="M5 25V11c0-3 3-6 6-6h14" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <path d="M8 8c2.5 0 3.5 2 2.5 3.2-1 1.2-3 .6-2.6-1" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="1" cy="1" r="1.2" fill="currentColor" />
    </svg>
  );
}

function Corners() {
  return (
    <>
      <Flourish className="corner--tl" />
      <Flourish className="corner--tr" />
      <Flourish className="corner--bl" />
      <Flourish className="corner--br" />
    </>
  );
}

export default Corners;
