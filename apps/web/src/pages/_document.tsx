import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

class LensterDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          {/* Icons */}
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default LensterDocument;
