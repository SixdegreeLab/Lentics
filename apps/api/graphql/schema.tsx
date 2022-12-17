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
    profileIds: [ID]
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
    profileId: ID
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
    CurrentUser(profileId: ID): Profile
    Profiles: [Profile]!
    Profile(id: ID!): Profile
    Posts: [Post]!
    Post(profileId: ID!, pubId: ID!): Post
    Follows: [Follow]!
    Follow(profileId: ID!, follower: String!): Follow
    Comments: [Comment]!
    Comment(profileId: ID!, pubId: ID!): Comment
    Mirrors: [Mirror]!
    Mirror(profileId: ID!, pubId: ID!): Mirror
    Collects: [Collect]!
    Collect(profileId: ID!, pubId: ID!): Collect

    Summary30Days(profileId: ID): Summary30Days

  }
`

export default typeDefs;