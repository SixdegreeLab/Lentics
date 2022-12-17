import { gql } from '@apollo/client';
import client from 'src/apollo';

const HOME_QUERY = gql`
query getProfile($profileId: ID!) {
  Profile(id: $profileId) {
    profileId,
    owner
  }
}
`

export default function Web({ data }) {
  // Render data...
  console.log(data);
  return (
    <div className="page_content mt-[46px] bg-gray-50 sm:ml-64">
      <div className="container p-5">
        <h1>Web</h1>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: HOME_QUERY,
    variables: { "profileId": "104814" }
  });

  return {
    props: {
      data,
    },
  }
}