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
        {typeof process.env.NEXT_PUBLIC_PAPERCUPS_TOKEN !== "undefined" && (
          <>
            <Script
              id="papercups"
              dangerouslySetInnerHTML={{
                __html: `window.Papercups = {
                  config: {
                    token: "${process.env.NEXT_PUBLIC_PAPERCUPS_TOKEN}",
                    inbox: "${process.env.NEXT_PUBLIC_PAPERCUPS_INBOX}",
                    title: "Welcome to Web Reactionz",
                    subtitle: "Ask us anything in the chat window below 😊",
                    primaryColor: "#ff595e",
                    requireEmailUpfront: true,
                    baseUrl: "${process.env.NEXT_PUBLIC_PAPERCUPS_URL}"
                  },
                };`,
              }}
            />
            <Script
              src={`${process.env.NEXT_PUBLIC_PAPERCUPS_URL}/widget.js`}
            />
          </>
        )}
      </body>
    </html>
  );
}
