 'use client';

import { useMemo, useState } from 'react';

function fallbackCopy(text: string) {
  if (typeof document === 'undefined') return Promise.reject(new Error('No document'));

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.left = '-9999px';
  textarea.setAttribute('readonly', 'true');

  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  const ok = document.execCommand('copy');
  document.body.removeChild(textarea);

  return ok ? Promise.resolve() : Promise.reject(new Error('execCommand failed'));
}

export function CopyToClipboardButton({
  text,
  label = 'Copy nội dung',
}: {
  text: string;
  label?: string;
}) {
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle');
  const canCopy = useMemo(() => !!text, [text]);

  async function onCopy() {
    if (!canCopy) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        await fallbackCopy(text);
      }
      setStatus('done');
      window.setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      window.setTimeout(() => setStatus('idle'), 2000);
    }
  }

  const finalLabel = status === 'done' ? 'Đã copy' : status === 'error' ? 'Copy lỗi' : label;

  return (
    <button
      type="button"
      disabled={!canCopy}
      onClick={onCopy}
      className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
    >
      {finalLabel}
    </button>
  );
}

