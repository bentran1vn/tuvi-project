 'use client';

export function ShopeeAd({
  placement,
  className = '',
  minHeight = 120,
}: {
  placement: 'home-top' | 'sidebar' | 'la-so-bottom';
  className?: string;
  minHeight?: number;
}) {
  const widgetScript = process.env.NEXT_PUBLIC_SHOPEE_WIDGET_SCRIPT || '';

  if (!widgetScript.trim()) {
    return (
      <div
        className={className}
        style={{ minHeight }}
        aria-hidden="true"
        data-shopee-placement={placement}
      >
        <div className="flex min-h-[120px] items-center justify-center rounded-lg border border-zinc-200 bg-white p-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          Shopee widget: chưa cung cấp affiliate/widget snippet
        </div>
      </div>
    );
  }

  // If you later paste a real embed snippet, you can pass it via NEXT_PUBLIC_SHOPEE_WIDGET_SCRIPT.
  // NOTE: Use with care; snippet should be safe for your use-case.
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: widgetScript }}
      data-shopee-placement={placement}
    />
  );
}

