import Navbar from '@components/Shared/Navbar';
import { getSession } from "next-auth/react";

export default function Web({ initSession }) {
  // Render data...
  return (
    <div className="page_content">
      <Navbar />
      <div className="p-1">
        <h1>Publication</h1>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      initSession: await getSession(context),
    },
  }
}
