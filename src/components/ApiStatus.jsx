import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { DOCS_URL, PING_URL } from "../services/api";
import "./ApiStatus.css";

const WAKING_AFTER_MS = 2500;
const COLD_START_MS = 1500;
const PING_TIMEOUT_MS = 60000;

async function measurePing() {
  const start = performance.now();
  const response = await fetch(PING_URL, {
    cache: "no-store",
    signal: AbortSignal.timeout(PING_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return Math.round(performance.now() - start);
}

function ApiStatus({ active }) {
  const { t } = useLanguage();
  const [state, setState] = useState("checking");
  const [latency, setLatency] = useState(null);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!active || hasChecked.current) return;

    if (!PING_URL) {
      setState("offline");
      return;
    }

    hasChecked.current = true;
    let cancelled = false;

    const wakingTimer = setTimeout(() => {
      if (!cancelled) setState("waking");
    }, WAKING_AFTER_MS);

    async function check() {
      try {
        let ms = await measurePing();
        if (ms > COLD_START_MS) ms = await measurePing();
        if (cancelled) return;
        setLatency(ms);
        setState("online");
      } catch {
        if (!cancelled) setState("offline");
      } finally {
        clearTimeout(wakingTimer);
      }
    }

    check();

    return () => {
      cancelled = true;
      clearTimeout(wakingTimer);
    };
  }, [active]);

  const labels = {
    checking: t.contact.api.checking,
    waking: t.contact.api.waking,
    online: t.contact.api.online,
    offline: t.contact.api.offline,
  };

  return (
    <div className="api-status">
      <div className="api-status__row" role="status" aria-live="polite">
        <span
          className={`api-status__dot api-status__dot--${state}`}
          aria-hidden="true"
        />
        <span className="api-status__name">{t.contact.api.label}</span>
        <span className="api-status__state">
          {labels[state]}
          {state === "online" && latency !== null && ` · ${latency} ms`}
        </span>
      </div>

      {DOCS_URL && (
        <a
          href={DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="api-status__docs"
        >
          {t.contact.api.docs}
        </a>
      )}
    </div>
  );
}

export default ApiStatus;
