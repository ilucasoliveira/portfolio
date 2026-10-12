import "./Background.css";

const TWINKLES = [
  { x: 8, y: 14, size: 2, delay: 0, gold: false },
  { x: 22, y: 72, size: 1.5, delay: 2.4, gold: true },
  { x: 35, y: 28, size: 2, delay: 4.1, gold: false },
  { x: 47, y: 86, size: 1.5, delay: 1.2, gold: false },
  { x: 58, y: 9, size: 2, delay: 5.6, gold: true },
  { x: 66, y: 54, size: 1.5, delay: 3.3, gold: false },
  { x: 74, y: 22, size: 2, delay: 6.8, gold: false },
  { x: 83, y: 68, size: 1.5, delay: 0.7, gold: true },
  { x: 91, y: 38, size: 2, delay: 4.9, gold: false },
  { x: 14, y: 46, size: 1.5, delay: 7.5, gold: false },
  { x: 52, y: 40, size: 1.5, delay: 2.9, gold: true },
  { x: 96, y: 90, size: 2, delay: 6.1, gold: false },
];

function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-glow" />
      <div className="bg-stars" />
      {TWINKLES.map((star, i) => (
        <span
          key={i}
          className={`bg-twinkle ${star.gold ? "bg-twinkle--gold" : ""}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default Background;
