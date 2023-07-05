import "rsuite/dist/rsuite.min.css";
import "./globals.css";
import NextAuthProvider from "@/lib/NextAuthSessionProvider";
import Footer from "@/components/Footer";
import Script from "next/script";

export const metadata = {
  title: "Web Reactionz - global reactions for the Web",
  description: "Global reactions for the Web",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          {children}
          <Footer />
        </NextAuthProvider>
        {typeof process.env.NEXT_PUBLIC_ANALYTICS_URL !== "undefined" && (
          <Script
            src={process.env.NEXT_PUBLIC_ANALYTICS_URL}
            data-website-id={process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID}
          />
        )}
      </body>
    </html>
  );
}
