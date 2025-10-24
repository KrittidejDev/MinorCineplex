import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Script from "next/script";
import { ToastContainer } from "react-toastify";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <Script
          src="https://cdn.omise.co/omise.js"
          strategy="beforeInteractive"
          onLoad={() => console.log("Omise.js loaded successfully")}
          onError={(e) => console.error("Failed to load Omise.js:", e)}
        />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Component {...pageProps} />
      </AuthProvider>
    </SessionProvider>
  );
}
