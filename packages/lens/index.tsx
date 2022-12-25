import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { MAINNET_API_URL } from 'data/constants';

// TODO: Use mainnet for now, beacause can not query profile on Mumbai Testnet.
const lensApolloClient= new ApolloClient({
  uri: MAINNET_API_URL,
  cache: new InMemoryCache(),
});

const query = `query DefaultProfile($request: DefaultProfileRequest!) {
  defaultProfile(request: $request) {
    id
    name
    bio
    isDefault
    attributes {
      displayType
      traitType
      key
      value
    }
    followNftAddress
    metadata
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        chainId
        verified
      }
      ... on MediaSet {
        original {
          url
          mimeType
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        chainId
        verified
      }
      ... on MediaSet {
        original {
          url
          mimeType
        }
      }
    }
    ownedBy
    dispatcher {
      address
      canUseRelay
    }
    stats {
      totalFollowers
      totalFollowing
      totalPosts
      totalComments
      totalMirrors
      totalPublications
      totalCollects
    }
    followModule {
      ... on FeeFollowModuleSettings {
        type
        contractAddress
        amount {
          asset {
            name
            symbol
            decimals
            address
          }
          value
        }
        recipient
      }
      ... on ProfileFollowModuleSettings {
       type
      }
      ... on RevertFollowModuleSettings {
       type
      }
    }
  }
}
`


export const queryDefaultProfile = async (address: string) => {
  return await lensApolloClient.query({
    query: gql(query),
    variables: {
      request: {
        ethereumAddress: address
      },
    },
  })
}
