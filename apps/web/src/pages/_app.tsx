import '../styles/index.css'

import Loading from '@components/Shared/Loading';
import type { AppProps } from 'next/app';
import { lazy, Suspense, useEffect} from 'react';
import { MixpanelTracking } from "@lib/mixpanel";
import { useRouter } from 'next/router';
import Head from "next/head";

const Providers: any = lazy(() => import('@components/Common/Providers'));

const App = ({ Component, pageProps }: AppProps) => {
  const { asPath, query } = useRouter();

  useEffect(() => {
    MixpanelTracking.getInstance().pageViewed({path: asPath, address: query?.address});
  }, []);

  return (
    <>
      <Head><title>{pageProps.pageTitle?? 'Lentics'}</title></Head>
      <Suspense fallback={<Loading />}>
        <Providers {...pageProps}>
          <Component {...pageProps} />
        </Providers>
      </Suspense>
    </>
  );
};

export default App;
