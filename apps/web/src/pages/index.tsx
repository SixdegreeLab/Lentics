import { gql } from '@apollo/client';
import client from 'src/apollo';
import Navbar from '@components/Shared/Navbar';
import { getSession, GetSessionParams } from "next-auth/react";

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
      <div className="p-1">
        <h1>Web {data?.profile?.owner}</h1>
        <br/>

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