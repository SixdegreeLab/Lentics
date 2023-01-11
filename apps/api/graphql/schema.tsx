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
    profileIds: [Int]
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
    contentCountCurrent: Int
    contentCountPrevious: Int
    contentCountChange: Int
    contentCountChangePercentage: Float
    engagementScoreCurrent: Int
    engagementScorePrevious: Int
    engagementScoreChangeValue: Int
    engagementScoreChangePercentage: Float
    publicationCountCurrent: Int
    publicationCountPrevious: Int
    publicationCountChange: Int
    publicationCountChangePercentage: Float
    followerCountCurrent: Int
    followerCountPrevious: Int
    followerCountChange: Int
    followerCountChangePercentage: Float
    commentedCountCurrent: Int
    commentedCountPrevious: Int
    commentedCountChange: Int
    commentedCountChangePercentage: Float
    mirroredCountCurrent: Int
    mirroredCountPrevious: Int
    mirroredCountChange: Int
    mirroredCountChangePercentage: Float
    collectedCountCurrent: Int
    collectedCountPrevious: Int
    collectedCountChange: Int
    collectedCountChangePercentage: Float
  }
  
  type DailyChange {
    profileId: ID
    blockDate: String
    contentCountChange: Int
    engagementScoreChange: Int
    publicationCountChange: Int
    followerCountChange: Int
    commentedCountChange: Int
    mirroredCountChange: Int
    collectedCountChange: Int
    publicationPostCountChange: Int
    publicationCommentCountChange: Int
    publicationMirrorCountChange: Int
  }
  
  type DailyStatistics {
    profileId: ID
    contentTypeId: Int
    contentTypeName: String
    blockDate: String
    contentCount: Int
    engagementScore: Int
  }
  
  type UserAndWhiteList {
    profile: Profile
    isInWhiteList: Boolean
    whitelist: [String]
  }
  
  type MonthlyStatistics {
    profileId: Int
    startDate: String
    contentCount: Int
    engagementScore: Int
    publicationCount: Int
    followerCount: Int
    commentedCount: Int
    mirroredCount: Int
    collectedCount: Int
    topEngagementPostId: Int
    topPostEngagementScore: Int
    topEngagementPostContentUri: String
    topCommentedPostId: Int
    topPostCommentedCount: Int
    topCommentedPostContentUri: String
    topMirroredPostId: Int
    topPostMirroredCount: Int
    topMirroredPostContentUri: String
    topCollectedPostId: Int
    topPostCollectedCount: Int
    topCollectedPostContentUri: String
  }
  
  type ProfileTopFollower {
    followerProfileId: Int
    followerProfileHandle: String
    followerProfileFollowersCount: Int
    topFollowerFollowingCount: Int
  }
  
  type ProfileCount {
    owner: String
    profileId: Int
    postCount: Int
    followCount: Int
    commentCount: Int
    mirrorCount: Int
    collectCount: Int
  } 

  type Query {
    Profiles(addresses: [String]!): [Profile]!
    ProfileCount(address: String!, startDate: String!, endDate: String!): ProfileCount
    Profile(address: String!): UserAndWhiteList
    Posts(profileId: Int!, startDate: String!, endDate: String!): [Post]
    Post(profileId: Int!, pubId: Int!): Post
    Follows(profileIds: [Int]!, startDate: String!, endDate: String!): [Follow]
    Follow(profileId: Int!, follower: String!): Follow
    Comments(profileId: Int!, startDate: String!, endDate: String!): [Comment]
    Comment(profileId: Int!, pubId: Int!): Comment
    Mirrors(profileId: Int!, startDate: String!, endDate: String!): [Mirror]
    Mirror(profileId: Int!, pubId: Int!): Mirror
    Collects(profileId: Int!, startDate: String!, endDate: String!): [Collect]
    Collect(profileId: Int!, pubId: Int!): Collect

    Summary30Days(address: String!, date: String!): Summary30Days
    DailyChange(address: String!, date: String!): [DailyChange]
    DailyStatistics(address: String!): [DailyStatistics]
    MonthlyStatistics(address: String!, date: String!): MonthlyStatistics
    ProfileTopFollower(address: String!, date: String!): ProfileTopFollower
  }
`

export default typeDefs;