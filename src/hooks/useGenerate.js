import { useState, useRef } from 'react';
import { validateResponse } from '../lib/validateResponse.js';
import { mockResponse } from '../lib/mockData.js';

const TIMEOUT_MS = 30_000;

// Simulates the API call using mock data.
// Replace this function body in Phase 8 with:
//   const res = await fetch('/api/generate', { method: 'POST', signal, body: JSON.stringify({ notes }), headers: { 'Content-Type': 'application/json' } });
//   if (!res.ok) throw new Error('Server error');
//   return res.json();
async function fetchStudyData(_notes, signal) {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 800);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
  return mockResponse;
}

export function useGenerate() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const abortRef = useRef(null);
  const requestIdRef = useRef(0);

  async function generate(notes) {
    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = ++requestIdRef.current;

    setStatus('loading');
    setData(null);
    setErrorMessage('');

    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const raw = await fetchStudyData(notes, controller.signal);

      // Discard stale responses
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

      if (err.name === 'AbortError') {
        setErrorMessage('The request took too long. Please try again.');
      } else {
        setErrorMessage(
          'Something went wrong. Your notes are saved — please retry.',
        );
      }
      setStatus('error');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function reset() {
    if (abortRef.current) abortRef.current.abort();
    setStatus('idle');
    setData(null);
    setErrorMessage('');
  }

  return { status, data, errorMessage, generate, reset };
}
