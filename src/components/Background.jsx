import "./Background.css";

function Background() {
  return (
    <>
      <div className="bg-noise" />
      <div className="bg-glow" />
      <div className="bg-stars bg-stars--drift" />
      <div className="bg-stars bg-stars--twinkle-a" />
      <div className="bg-stars bg-stars--twinkle-b" />
    </>
  );
}

export default Background;
