import { gql } from '@apollo/client';
import client from 'src/apollo';
import Navbar from '@components/Shared/Navbar';
import { getSession, GetSessionParams } from "next-auth/react";
import SignInDialog from '@components/Shared/Navbar/signin';

const HOME_QUERY = gql`
  query getProfile($address: String!) {
    Profile(address: $address) {
      profile {
        profileId,
        owner
      }
      isInWhiteList
      whitelist
    }
  }
`

export default function Web({ data, initSession }) {
  return (
    <div className="page_content">
      <Navbar initSession={initSession}/>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 mt-3">
          <h2 className="mt-6 text-center text-4xl font-bold tracking-tight text-gray-900">
            Analize Your Lens Data
          </h2>
          <p className="mt-2 text-center text-base text-gray-600">
            Analyze your Lens Protocal data to understand your impact, publication, revenue. Every word, photo, video, and follower can have an impact.
          </p>
          <p className="mt-2 text-center text-sm">
            <button className="mt-2 justify-center rounded-md border border-transparent bg-green-400 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
              Connect Wallet
            </button>
            <span className="mx-5">Or</span>
            <button className="mt-2 justify-center rounded-md border border-transparent bg-slate-400 px-4 py-2 text-sm font-medium text-white hover:bg-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
              View Demo
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const authSession = await getSession(context);
  const { data } = await client.query({
    query: HOME_QUERY,
    variables: { "address": "0x0e0f0C0976806D470F69d7A3855612C861863576" },
    context: {
      headers: {
        Authorization: authSession ? authSession.address : ""
      }
    },
  });

  return {
    props: {
      data: data.Profile,
      initSession: authSession,
    },
  }
}