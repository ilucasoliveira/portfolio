import { navigate, routeFor } from "../hooks/useRoute";
import { preloadPage } from "../pages/lazy";

// <a> que troca de página sem recarregar (com o véu de transição); links de âncora
// na mesma página e cliques com Ctrl/Cmd/Shift seguem o comportamento normal.
// Ao passar o mouse, focar ou tocar, o código da página de destino já começa a baixar.
function Link({ href, onClick, onPointerEnter, onFocus, children, ...props }) {
  function preload() {
    const url = new URL(href, window.location.origin);
    if (url.origin === window.location.origin) preloadPage(routeFor(url.pathname).page);
  }

  function handleClick(event) {
    onClick?.(event);
    preload();
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
    <a
      href={href}
      onClick={handleClick}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        preload();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        preload();
      }}
      {...props}
    >
      {children}
    </a>
  );
}

export default Link;
