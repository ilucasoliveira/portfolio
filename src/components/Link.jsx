import { navigate } from "../hooks/useRoute";

// <a> que troca de página sem recarregar (com o véu de transição); links de âncora
// na mesma página e cliques com Ctrl/Cmd/Shift seguem o comportamento normal
function Link({ href, onClick, children, ...props }) {
  function handleClick(event) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return;

    const samePage = url.pathname === window.location.pathname;
    if (samePage && url.hash) return;

    event.preventDefault();
    navigate(href, { x: event.clientX, y: event.clientY });
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export default Link;
