import { useRuneDecode } from "../hooks/useRuneDecode";

function RuneText({ text, active }) {
  const display = useRuneDecode(text, active);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </>
  );
}

export default RuneText;
