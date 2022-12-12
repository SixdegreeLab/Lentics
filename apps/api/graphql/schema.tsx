const typeDefs = `#graphql
  type Profile {
    profileId: String
    owner: String
    handle: String
    imageUri: String
    followModule: String
    followNftUri: String
    blockTime: String
    blockNumber: String
    txHash: String
    timestamp: String
  }

  type Post {
    txHash: String
    txIndex: String
    blockTime: String
    blockNumber: String
    profileId: String
    pubId: String
    contentUri: String
    collectModule: String
    referenceModule: String
    timestamp: String
  }

  type Follow {
    txHash: String
    txIndex: String
    blockTime: String
    blockNumber: String
    follower: String
    profileId: String
    timestamp: String
  }

  type Comment {
    txHash: String
    txIndex: String
    blockTime: String
    blockNumber: String
    profileId: String
    pubId: String
    contentUri: String
    profileIdPointed: String
    pubIdPointed: String
    collectModule: String
    referenceModule: String
    timestamp: String
  }

  type Mirror {
    txHash: String
    txIndex: String
    blockTime: String
    blockNumber: String
    profileId: String
    pubId: String
    profileIdPointed: String
    pubIdPointed: String
    referenceModule: String
    timestamp: String
  }

  type Collect {
    txHash: String
    txIndex: String
    blockTime: String
    blockNumber: String
    collector: String
    profileId: String
    pubId: String
    rootProfileId: String
    rootPubId: String
    referenceModule: String
    timestamp: String
  }

  type Summary30Days {
    profileId: Int
    engagementCount: Int
    publicationCount: Int
    followerCount: Int
    collectCount: Int
    revenueAmount: Float
    engagementChangeCount: Int
    publicationChangeCount: Int
    followerChangeCount: Int
    collectChangeCount: Int
    revenueChangeAmount: Float
    engagementChangePercentage: Float
    publicationChangePercentage: Float
    followerChangePercentage: Float
    collectChangePercentage: Float
    revenueChangePercentage: Float
  }

  type Query {
    CurrentUser: Profile
    Profiles: [Profile]!
    Profile(id: ID!): Profile
    Posts: [Post]!
    Post(profileId: Int!, pubId: Int!): Post
    Follows: [Follow]!
    Follow(profileId: Int!, follower: String!): Follow
    Comments: [Comment]!
    Comment(profileId: Int!, pubId: Int!): Comment
    Mirrors: [Mirror]!
    Mirror(profileId: Int!, pubId: Int!): Mirror
    Collects: [Collect]!
    Collect(profileId: Int!, pubId: Int!): Collect

    Summary30Days(profileId: Int!): Summary30Days

  }
`

export default typeDefs;