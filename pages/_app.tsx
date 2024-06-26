import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { inter } from "@/components/fonts";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${inter.className}`}>
      <Component {...pageProps} />
    </main>
  );
}
