import { useState, useRef } from 'react';
import { validateResponse } from '../lib/validateResponse.js';

const TIMEOUT_MS = 30_000;

// Sends the notes to our backend proxy, which handles the Gemini call
async function fetchStudyData(notes, signal) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ notes }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data?.message ?? 'Server error.');

  return data;
}

// Translates raw errors into messages the UI can show the user.
// Returns null for user-triggered aborts — those are silent by design.
function classifyError(err, timedOut) {
  if (err.name === 'AbortError') {
    return timedOut ? 'The request took too long. Please try again.' : null;
  }
  if (err instanceof TypeError) {
    return 'Unable to reach the server. Check your connection and retry.';
  }
  return (
    err.message ?? 'Something went wrong. Your notes are saved — please retry.'
  );
}

export function useGenerate() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const abortRef = useRef(null);
  const requestIdRef = useRef(0); // guards against stale responses from previous requests

  async function generate(notes) {
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = ++requestIdRef.current;

    setStatus('loading');
    setData(null);
    setErrorMessage('');

    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, TIMEOUT_MS);

    try {
      const raw = await fetchStudyData(notes, controller.signal);

      if (requestId !== requestIdRef.current) return;

      const result = validateResponse(raw);

      if (!result.valid) {
        setErrorMessage(result.reason);
        setStatus('error');
        return;
      }

      setData(result.data);
      setStatus('success');
    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      const message = classifyError(err, timedOut);
      if (message === null) return;

      setErrorMessage(message);
      setStatus('error');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function reset() {
    abortRef.current?.abort();
    setStatus('idle');
    setData(null);
    setErrorMessage('');
  }

  return { status, data, errorMessage, generate, reset };
}
