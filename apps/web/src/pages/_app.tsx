import '../styles/index.css'

import Loading from '@components/Shared/Loading';
import type { AppProps } from 'next/app';
import { lazy, Suspense } from 'react';

const Providers: any = lazy(() => import('@components/Common/Providers'));

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <Providers {...pageProps}>
        <Component {...pageProps} />
      </Providers>
    </Suspense>
  );
};

export default App;
