import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import React from "react";
import Head from "next/head";

import store from "../redux";
import "normalize.css";
import "styles/main.scss";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Minesweeper</title>
        <link rel="icon" href="/favicon.webp" />
      </Head>
      <React.StrictMode>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </React.StrictMode>
    </>
  );
}
