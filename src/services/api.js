export const MESSAGE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://127.0.0.1:8000/message" : "");

function endpoint(path) {
  return MESSAGE_URL ? new URL(path, MESSAGE_URL).toString() : "";
}

export const MESSAGE_PATH = MESSAGE_URL ? new URL(MESSAGE_URL).pathname : "";
export const PING_URL = endpoint("/ping");
export const DOCS_URL = endpoint("/docs");
