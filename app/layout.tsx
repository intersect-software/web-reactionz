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
        {typeof process.env.NEXT_PUBLIC_CHATWOOT_URL !== "undefined" && (
          <Script
            id="chatwoot"
            dangerouslySetInnerHTML={{
              __html: `(function(d,t) {
                        var BASE_URL="${process.env.NEXT_PUBLIC_CHATWOOT_URL}";
                        var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
                        g.src=BASE_URL+"/packs/js/sdk.js";
                        g.defer = true;
                        g.async = true;
                        s.parentNode.insertBefore(g,s);
                        g.onload=function(){
                          window.chatwootSDK.run({
                            websiteToken: '${process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN}',
                            baseUrl: BASE_URL
                          })
                        }
                      })(document,"script");`,
            }}
          />
        )}
      </body>
    </html>
  );
}
