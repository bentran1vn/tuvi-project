 'use client';

import { useEffect, useMemo, useState } from 'react';

const CONSENT_KEY = 'tuvi_ad_consent';

type ConsentValue = 'accepted' | 'rejected';

export function ConsentBanner() {
  const [consent, setConsent] = useState<ConsentValue | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY) as ConsentValue | null;
      if (stored === 'accepted' || stored === 'rejected') {
        // Defer setState to avoid linter warnings about synchronous updates.
        window.requestAnimationFrame(() => setConsent(stored));
      }
    } catch {
      // Ignore storage errors (privacy mode, etc)
    }
  }, []);

  const visible = useMemo(() => consent === null, [consent]);

  if (!visible) return null;

  function accept() {
    setConsent('accepted');
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted');
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('tuvi_ad_consent_changed'));
    }
  }

  function reject() {
    setConsent('rejected');
    try {
      localStorage.setItem(CONSENT_KEY, 'rejected');
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('tuvi_ad_consent_changed'));
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="text-sm text-zinc-700 dark:text-zinc-200">
          Chúng tôi sử dụng cookie/đo lường để hiển thị quảng cáo từ các đối tác
          (Google/Shopee...). Bạn có thể chọn “Chấp nhận” hoặc “Từ chối”.
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={reject}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Từ chối
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-500"
          >
            Chấp nhận
          </button>
        </div>
      </div>
    </div>
  );
}

