import React from "react";
import { Roboto } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "../styles/global.scss";
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/footer/Footer";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Providers from "@/redux/Providers";
import GeneralSetting from "@/components/UI/Shared/GeneralSetting";
import Script from "next/script";
import { API_BASE_URL } from "@/utils/apiBase";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
  adjustFontFallback: true,
});

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || "Sanam Store",
  description:
    "Sanam Store - Online shopping in Kuwait. Fast delivery and best prices.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://kw.sanamstore.net"
  ),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

const extractScriptContent = (html = "") => {
  const scriptMatch = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
  return scriptMatch?.[1] || "";
};

const extractNoScriptContent = (html = "") => {
  const noScriptMatch = html.match(/<noscript\b[^>]*>([\s\S]*?)<\/noscript>/i);
  return noScriptMatch?.[1] || "";
};

const getBackendScriptTags = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/get-script-tags`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error("Failed to fetch backend script tags:", error);
    return [];
  }
};

export default async function RootLayout({ children }) {
  const backendScripts = (await getBackendScriptTags()) || [];
  const gtmItem = Array.isArray(backendScripts) ? backendScripts.find((item) => item.type === 11) : null;
  const gtmScript = extractScriptContent(gtmItem?.script);
  const gtmNoScript = extractNoScriptContent(gtmItem?.script);

return (
    <html lang="en">
      <head>
        {/* Preconnect to critical origins - reduces connection latency */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        {gtmScript ? (
          <Script
            id="gtm-head"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: gtmScript }}
          />
        ) : null}
      </head>
      <body>
        {gtmNoScript ? (
          <noscript dangerouslySetInnerHTML={{ __html: gtmNoScript }} />
        ) : null}
        {/* Microsoft Clarity - lazy loaded */}
        <Script
          id="microsoft-clarity"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "wmhj7v5209");
            `,
          }}
        />

        {/* GTM and additional analytics script tags are loaded dynamically from the backend API */}

        <Providers>
          <GeneralSetting />
          <Header />
          {children}
          <Footer />

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </Providers>
      </body>
    </html>
  );
}
