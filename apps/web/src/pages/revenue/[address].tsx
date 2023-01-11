import Navbar from '@components/Shared/Navbar';
import { getSession } from "next-auth/react";
import React from 'react';

export default function Revenue({  }) {
  // Render data...
  return (
    <div className="page_content">
      <Navbar />
      <div className="p-1">
        <h1 className="text-3xl font-bold">Revenue</h1>
        <div>Under Construction…</div>
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
