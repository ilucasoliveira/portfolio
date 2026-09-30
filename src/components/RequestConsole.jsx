const STATUS_TEXT = {
  201: "Created",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  503: "Service Unavailable",
};

const PREVIEW_LIMIT = 80;

function preview(value) {
  return value.length > PREVIEW_LIMIT
    ? `${value.slice(0, PREVIEW_LIMIT)}…`
    : value;
}

function RequestConsole({ exchange, title }) {
  if (!exchange) return null;

  const { path, payload, status, body, ms, error } = exchange;
  const shownPayload = Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, preview(value)]),
  );
  const isOk = status >= 200 && status < 300;
  const statusClass = isOk
    ? "contact__console-status--ok"
    : "contact__console-status--error";

  return (
    <section className="contact__console" aria-label={title}>
      <div className="contact__console-title">{title}</div>
      <pre className="contact__console-body">
        <span className="contact__console-method">POST</span> {path}
        {"\n"}
        {JSON.stringify(shownPayload, null, 2)}
        {"\n\n"}
        <span
          className={status ? statusClass : "contact__console-status--error"}
        >
          {status ? `← ${status} ${STATUS_TEXT[status] ?? ""}` : `← ${error}`}
        </span>{" "}
        <span className="contact__console-time">{ms} ms</span>
        {body && `\n${JSON.stringify(body, null, 2)}`}
      </pre>
    </section>
  );
}

export default RequestConsole;
