 'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdsenseAd({
  slotId,
  format = 'auto',
  className = '',
  minHeight = 250,
}: {
  slotId: string;
  format?: string;
  className?: string;
  minHeight?: number;
}) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '';

  const [ready, setReady] = useState(false);
  const enabled = !!clientId.trim() && !!slotId.trim();

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;

    // Inject the adsbygoogle script once.
    const scriptId = 'tuvi-adsense-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      document.head.appendChild(script);
    }

    // Defer setState to avoid linter warnings about synchronous updates.
    window.requestAnimationFrame(() => setReady(true));
  }, [enabled, clientId]);

  useEffect(() => {
    if (!enabled || !ready) return;
    if (!slotId.trim()) return;

    try {
      const queue = window.adsbygoogle || [];
      window.adsbygoogle = queue;
      // Push after <ins> is in the DOM.
      queue.push({});
    } catch {
      // ignore
    }
  }, [enabled, ready, slotId]);

  if (!enabled) {
    return (
      <div
        className={`w-full ${className}`}
        style={{ height: minHeight }}
        aria-hidden="true"
      >
        <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-white/40 p-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
          Quảng cáo (chưa cấu hình: thiếu client/slot)
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div
        className={`w-full ${className}`}
        style={{ height: minHeight }}
        aria-hidden="true"
      >
        <div className="flex h-full items-center justify-center rounded-lg border border-zinc-200 bg-white/40 p-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
          Đang tải quảng cáo...
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

