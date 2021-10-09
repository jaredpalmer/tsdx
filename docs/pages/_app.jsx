import { DokzProvider, GithubLink, ColorModeSwitch } from "dokz";
import React, { Fragment } from "react";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import Logo from "../components/logo";

export default function App(props) {
  const { Component, pageProps } = props;
  return (
    <ChakraProvider resetCSS>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Fira+Code"
          rel="stylesheet"
          key="google-font-Fira"
        />
      </Head>
      <DokzProvider
        headerLogo={<Logo height={35} />}
        headerItems={[
          <GithubLink key="0" url="https://github.com/weiran-zsd/dts-cli" />,
          <ColorModeSwitch key="1" />,
        ]}
        sidebarOrdering={{
          "index.mdx": true,
          "api-reference.mdx": true,
          "customization.mdx": true,
          "change-log.mdx": true,
        }}
      >
        
        <Component {...pageProps} />
      </DokzProvider>
    </ChakraProvider>
  );
}
