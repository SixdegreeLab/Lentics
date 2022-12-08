import '../styles/index.css' // import Tailwind globally
import Layout from '../components/Layout' // header layout persists between page changes
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
export default MyApp