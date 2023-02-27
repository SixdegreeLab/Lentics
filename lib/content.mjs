import { Command } from 'commander';
import pg from 'pg';
const program = new Command();
const { Pool, types } = pg;
import { BigNumber } from 'ethers';

import fetch from 'cross-fetch';
import aClient from '@apollo/client';
const { ApolloClient, HttpLink, InMemoryCache, gql } = aClient;

function parseArgs(){
  program
    .option('-h, --host <char>', 'db host', 'db')
    .option('-p, --port <number>', 'db port', 5432)
    .option('-u, --user <char>', 'db user', 'postgres')
    .option('-w, --password <char>', 'db password', 'postgres')
    .option('-d, --dbname <char>', 'db name', 'lenticsdb')
    .parse(process.argv);
  return program.opts()
}

function getHexLensPublicationIdWithBigNumber(profileId, pubId) {
  return `${BigNumber.from(profileId).toHexString()}-${BigNumber.from(pubId).toHexString()}`
}

function getNumberFromLensPublicationId(id) {
  const data = { profileId: 0, pubId: 0 };
  const info = id.split('-');
  if (info.length == 2) {
    data.profileId = BigNumber.from(info[0]).toNumber();
    data.pubId = BigNumber.from(info[1]).toNumber();
  }
  return data;
}

// defautl rendom(10s-20s) to sleep
function sleep(time) {
  let mTime = time || parseInt(Math.random() * 10000 + 10000);
  return new Promise((resolve) => setTimeout(resolve, mTime));
}

const httpLink = new HttpLink({
  uri: 'https://api.lens.dev',
  fetchOptions: 'no-cors',
  fetch
});
const lensApolloClient= new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const PublicationsQueryDocument = gql`
query PublicationsQuery($request: PublicationsQueryRequest!) {
  publications(request: $request) {
    items {
      ... on Post {
        ...PostFields
        __typename
      }
      ... on Comment {
        ...CommentFields
        __typename
      }
      ... on Mirror {
        ...MirrorFields
        __typename
      }
      __typename
    }
  }
}

fragment StatsFields on PublicationStats {
  totalUpvotes
  totalAmountOfMirrors
  totalAmountOfCollects
  totalAmountOfComments
  __typename
}

fragment MetadataFields on MetadataOutput {
  name
  description
  content
  image
  attributes {
    traitType
    value
    __typename
  }
  cover {
    original {
      url
      __typename
    }
    __typename
  }
  media {
    original {
      url
      mimeType
      __typename
    }
    __typename
  }
  __typename
}

fragment PostFields on Post {
  id
  stats {
    ...StatsFields
    __typename
  }
  metadata {
    ...MetadataFields
    __typename
  }
  createdAt
  appId
  __typename
}

fragment CommentFields on Comment {
  id
  stats {
    ...StatsFields
    __typename
  }
  metadata {
    ...MetadataFields
    __typename
  }
  createdAt
  appId
  __typename
}

fragment MirrorFields on Mirror {
  id
  stats {
    ...StatsFields
    __typename
  }
  metadata {
    ...MetadataFields
    __typename
  }
  createdAt
  appId
  __typename
}
`;

let {
  host,
  port,
  user,
  password,
  dbname
} =  parseArgs();
const dbPool = new Pool({
  host: host,
  port: port,
  user: user,
  password: password,
  database: dbname
});
let client = await dbPool.connect();

async function main() {
  await getPublications();
}

async function getPublications() {
  try {
    // get 10 publicationIds from lenshub_event_commentcreated/lenshub_event_postcreated/lenshub_publication
    const postResult = await client.query(`
      select lep."profileId", lep."pubId"
      from lenshub_event_postcreated lep
      left join lenshub_publication lp on lep."profileId" = lp."profileId" and lep."pubId" = lp."pubId"
      where lp.id is null
      union 
      select lec."profileId", lec."pubId"
      from lenshub_event_commentcreated lec
      left join lenshub_publication lp2 on lec."profileId" = lp2."profileId" and lec."pubId" = lp2."pubId"
      where lp2.id is null
      limit 100;
    `);

    if (postResult.rowCount) {
      // save into lenshub_publication at first
      let publicationIds = [], publicationId;
      for (const row of postResult.rows) {
        publicationId = getHexLensPublicationIdWithBigNumber(row.profileId, row.pubId);
        publicationIds.push(publicationId);
        await client.query(`
          insert into lenshub_publication (
            id,
            "profileId",
            "pubId"
          ) values (
            '${publicationId}',
            ${row.profileId},
            ${row.pubId}
          ) on conflict do nothing;
        `);
      }

      // get publications from api.lens.dev
      const { data } = await lensApolloClient.query({
        query: PublicationsQueryDocument,
        variables: { request: { publicationIds: publicationIds } } //test: ['0x018b48-0x05'] ['0x01-0x7a']
      })

      // update publications into lenshub_publication
      for (const item of data.publications.items) {
        console.log(item.id, getNumberFromLensPublicationId(item.id));
        await client.query(`
          update lenshub_publication set
            "appId" = '${item.appId}',
            "createdAt" = '${item.createdAt}',
            "typeName" = '${item.__typename}',
            metadata = '${JSON.stringify(item).replace(/'/g,"''")}',
            "updateAt" = now(),
            updated = true
          where id = '${item.id}'
        `);
      }

      // sleep
      await sleep();

      // loop
      await getPublications();
    }
  } catch (error) {
    dbPool.end();
    console.error(error);
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }).finally(function(){
    dbPool.end();
  });
