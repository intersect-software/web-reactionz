"use client";
import Script from "next/script";

export default function ReactionsWidget({
  domSelector,
  position,
  prompt,
  layout,
  bordered,
}: {
  domSelector: string;
  position?: string;
  prompt?: string;
  layout?: string;
  bordered?: string;
}) {
  const siteId = process.env.NEXT_PUBLIC_SITE_ID;
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL;

  return (
    <Script
      async
      defer
      src="/setup.min.js"
      data-noautoinit="1"
      onReady={() => {
        new WebReactionz({
          siteId,
          baseUrl,
          domSelector,
          position,
          prompt,
          layout,
          bordered,
        }).init();
      }}
    />
  );
}
