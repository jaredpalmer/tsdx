import React from 'react';
import '.nextra/styles.css';
import GoogleFonts from 'next-google-fonts';

export default function Nextra({ Component, pageProps }) {
  return (
    <>
      <GoogleFonts
        href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
        rel="stylesheet"
      />
      <Component {...pageProps} />
    </>
  );
}
