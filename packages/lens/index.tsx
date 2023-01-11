import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { MAINNET_API_URL } from 'data/constants';

// TODO: Use mainnet for now, beacause can not query profile on Mumbai Testnet.
const lensApolloClient= new ApolloClient({
  uri: MAINNET_API_URL,
  cache: new InMemoryCache(),
});

export const DefaultProfileDocument = gql`query DefaultProfile($request: DefaultProfileRequest!) {
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

export const ProfileFieldsFragmentDoc = gql`
  fragment ProfileFields on Profile {
    id
    name
    handle
    bio
    ownedBy
    isFollowedByMe
    stats {
      totalFollowers
      totalFollowing
    }
    attributes {
      key
      value
    }
    picture {
      ... on MediaSet {
        original {
          url
        }
      }
      ... on NftImage {
        uri
      }
    }
    followModule {
      __typename
    }
  }
`;

export const ProfilesDocument = gql`
  query Profiles($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        ...ProfileFields
        isDefault
        isFollowedByMe
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
  ${ProfileFieldsFragmentDoc}
`;

export const LikesDocument = gql`
  query Likes($request: WhoReactedPublicationRequest!) {
    whoReactedPublication(request: $request) {
      items {
        reactionId
        profile {
          ...ProfileFields
          isFollowedByMe
        }
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
  ${ProfileFieldsFragmentDoc}
`;

export const CollectModuleFieldsFragmentDoc = gql`
  fragment CollectModuleFields on CollectModule {
    ... on FreeCollectModuleSettings {
      type
      contractAddress
      followerOnly
    }
    ... on FeeCollectModuleSettings {
      type
      referralFee
      contractAddress
      followerOnly
      amount {
        asset {
          symbol
          decimals
          address
        }
        value
      }
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      collectLimit
      referralFee
      contractAddress
      followerOnly
      amount {
        asset {
          symbol
          decimals
          address
        }
        value
      }
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      collectLimit
      endTimestamp
      referralFee
      contractAddress
      followerOnly
      amount {
        asset {
          symbol
          decimals
          address
        }
        value
      }
    }
    ... on TimedFeeCollectModuleSettings {
      type
      endTimestamp
      referralFee
      contractAddress
      followerOnly
      amount {
        asset {
          symbol
          decimals
          address
        }
        value
      }
    }
  }
`;
export const StatsFieldsFragmentDoc = gql`
  fragment StatsFields on PublicationStats {
    totalUpvotes
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }
`;
export const MetadataFieldsFragmentDoc = gql`
  fragment MetadataFields on MetadataOutput {
    name
    description
    content
    image
    attributes {
      traitType
      value
    }
    cover {
      original {
        url
      }
    }
    media {
      original {
        url
        mimeType
      }
    }
  }
`;

export const PostFieldsFragmentDoc = gql`
  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
    }
    reaction(request: $reactionRequest)
    mirrors(by: $profileId)
    canComment(profileId: $profileId) {
      result
    }
    canMirror(profileId: $profileId) {
      result
    }
    hasCollectedByMe
    collectedBy {
      address
      defaultProfile {
        ...ProfileFields
      }
    }
    collectModule {
      ...CollectModuleFields
    }
    stats {
      ...StatsFields
    }
    metadata {
      ...MetadataFields
    }
    hidden
    createdAt
    appId
  }
  ${ProfileFieldsFragmentDoc}
  ${CollectModuleFieldsFragmentDoc}
  ${StatsFieldsFragmentDoc}
  ${MetadataFieldsFragmentDoc}
`;
export const MirrorFieldsFragmentDoc = gql`
  fragment MirrorFields on Mirror {
    id
    profile {
      ...ProfileFields
    }
    reaction(request: $reactionRequest)
    canComment(profileId: $profileId) {
      result
    }
    canMirror(profileId: $profileId) {
      result
    }
    collectModule {
      ...CollectModuleFields
    }
    stats {
      ...StatsFields
    }
    metadata {
      ...MetadataFields
    }
    hidden
    mirrorOf {
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        id
        profile {
          ...ProfileFields
        }
        reaction(request: $reactionRequest)
        mirrors(by: $profileId)
        canComment(profileId: $profileId) {
          result
        }
        canMirror(profileId: $profileId) {
          result
        }
        stats {
          ...StatsFields
        }
        createdAt
      }
    }
    createdAt
    appId
  }
  ${ProfileFieldsFragmentDoc}
  ${CollectModuleFieldsFragmentDoc}
  ${StatsFieldsFragmentDoc}
  ${MetadataFieldsFragmentDoc}
  ${PostFieldsFragmentDoc}
`;
export const CommentFieldsFragmentDoc = gql`
  fragment CommentFields on Comment {
    id
    profile {
      ...ProfileFields
    }
    reaction(request: $reactionRequest)
    mirrors(by: $profileId)
    canComment(profileId: $profileId) {
      result
    }
    canMirror(profileId: $profileId) {
      result
    }
    hasCollectedByMe
    collectedBy {
      address
      defaultProfile {
        ...ProfileFields
      }
    }
    collectModule {
      ...CollectModuleFields
    }
    stats {
      ...StatsFields
    }
    metadata {
      ...MetadataFields
    }
    hidden
    createdAt
    appId
    commentOn {
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        id
        profile {
          ...ProfileFields
        }
        reaction(request: $reactionRequest)
        mirrors(by: $profileId)
        canComment(profileId: $profileId) {
          result
        }
        canMirror(profileId: $profileId) {
          result
        }
        hasCollectedByMe
        collectedBy {
          address
          defaultProfile {
            handle
          }
        }
        collectModule {
          ...CollectModuleFields
        }
        metadata {
          ...MetadataFields
        }
        stats {
          ...StatsFields
        }
        mainPost {
          ... on Post {
            ...PostFields
          }
          ... on Mirror {
            ...MirrorFields
          }
        }
        hidden
        createdAt
      }
      ... on Mirror {
        ...MirrorFields
      }
    }
  }
  ${ProfileFieldsFragmentDoc}
  ${CollectModuleFieldsFragmentDoc}
  ${StatsFieldsFragmentDoc}
  ${MetadataFieldsFragmentDoc}
  ${PostFieldsFragmentDoc}
  ${MirrorFieldsFragmentDoc}
`;

export const PublicationDocument = gql`
  query Publication(
    $request: PublicationQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    publication(request: $request) {
      ... on Post {
        ...PostFields
        onChainContentURI
        collectNftAddress
        profile {
          isFollowedByMe
        }
        referenceModule {
          __typename
        }
      }
      ... on Comment {
        ...CommentFields
        onChainContentURI
        collectNftAddress
        profile {
          isFollowedByMe
        }
        referenceModule {
          __typename
        }
      }
      ... on Mirror {
        ...MirrorFields
        onChainContentURI
        collectNftAddress
        profile {
          isFollowedByMe
        }
        referenceModule {
          __typename
        }
      }
    }
  }
  ${PostFieldsFragmentDoc}
  ${CommentFieldsFragmentDoc}
  ${MirrorFieldsFragmentDoc}
`;

export const ProfileFeedDocument = gql`
  query ProfileFeed(
    $request: PublicationsQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    publications(request: $request) {
      items {
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        totalCount
        next
      }
    }
  }
  ${PostFieldsFragmentDoc}
  ${CommentFieldsFragmentDoc}
  ${MirrorFieldsFragmentDoc}
`;

const queryDoc = async (query: any, variables: any) => (
  await lensApolloClient.query({
    query,
    variables
  })
)

export const queryDefaultProfile = async (address: string) => {
  return await queryDoc(DefaultProfileDocument, {
    request: {
      ethereumAddress: address
    },
  })
};

export const queryProfiles = async (handles: string[]) => {
  return await queryDoc(ProfilesDocument, {
    request: {
      handles
    },
  })
};

export const queryPublication = async (profileId: number, pubId: number) => {
  return await queryDoc(PublicationDocument, {
    request: {
      publicationId: `0x0${profileId.toString(16)}-0x0${pubId.toString(16)}`
    },
  })
};

export const getHexLensPublicationId = (profileId: number, pubId: number) => {
  // 偶数前缀0x，奇数前缀0x0
  let profileIdHex = (profileId.toString(16).length % 2) ? `0x0${profileId.toString(16)}` : `0x${profileId.toString(16)}`;
  let pubIdHex = (pubId.toString(16).length % 2) ? `0x0${pubId.toString(16)}` : `0x${pubId.toString(16)}`;
  return `${profileIdHex}-${pubIdHex}`
}

export const queryPublications = async (profileId: number, pubIds: number[]) => {
  return await queryDoc(ProfileFeedDocument, {
    request: {
      publicationIds: pubIds.map(
        (pubId) => (getHexLensPublicationId(profileId, pubId))
      )
    },
  })
};

export const queryWhoReactedPublication = async (profileId: number, pubId: number) => {
  return await queryDoc(LikesDocument, {
    request: {
      publicationId: `0x0${profileId.toString(16)}-0x0${pubId.toString(16)}`
    },
  })
};
