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
    default: Boolean
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

  type Follower {
    txHash: String
    txIndex: String
    blockTime: String
    blockNumber: String
    follower: String
    profileId: Int
    followerHandle: String
    followerProfileId: Int
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
    totalRevenueAmountCurrent: Float
    totalRevenueAmountPrevious: Float
    totalRevenueAmountChange: Float
    totalRevenueAmountChangePercentage: Float
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
    collectCountChange: Int
    collectedCountChange: Int
    publicationPostCountChange: Int
    publicationCommentCountChange: Int
    publicationMirrorCountChange: Int
    revenueCountChange: Float
    revenueCollectPostCountChange: Float
    revenueCollectMirroredCountChange: Float
    revenueFollowProfileCountChange: Float
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
    postCount: Int
    followerCount: Int
    commentCount: Int
    commentedCount: Int
    mirrorCount: Int
    mirroredCount: Int
    collectCount: Int
    collectedCount: Int
    revenueCount: Float
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
  
  type RevenueSupporter {
    userAddress: String
    handle: String
    profileId: Int
    link: String
    paidAmountUsd: Float
  }
  
  type RevenueAmountByToken {
    symbol: String
    paidAmountUsd: Float
  }
  
  type RevenueSummary {
    supporterCount: Int
    paidAmountUsd: Float
    revenueAmountByToken: [RevenueAmountByToken]
  }
  
  type RevenuePublication {
    publicationId: String
    profileId: Int
    pubId: Int
    paidAmountUsd: Float
    supporterCount: Int
  }
  
  type TopPost {
    topPostId: Int
    topPostContentUri: String
  }
  
  input Pagination {
    offset: Int!
    limit: Int!
  }

  type Query {
    Profiles(addresses: [String]!, paginate: Pagination): [Profile]!
    ProfileCount(addressOrHandle: String!, startDate: String!, endDate: String!): ProfileCount
    Profile(addressOrHandle: String!): UserAndWhiteList
    Posts(profileId: Int!, startDate: String!, endDate: String!, paginate: Pagination): [Post]
    Followers(profileId: Int!, startDate: String!, endDate: String!, paginate: Pagination): [Follower]
    Commented(profileId: Int!, startDate: String!, endDate: String!, paginate: Pagination): [Comment]
    Comments(profileId: Int!, startDate: String!, endDate: String!, paginate: Pagination): [Comment]
    Mirrored(profileId: Int!, startDate: String!, endDate: String!, paginate: Pagination): [Mirror]
    Mirrors(profileId: Int!, startDate: String!, endDate: String!, paginate: Pagination): [Mirror]
    Collected(profileId: Int!, startDate: String!, endDate: String!, paginate: Pagination): [Collect]
    Collects(profileId: Int!, startDate: String!, endDate: String!, paginate: Pagination): [Collect]

    Summary30Days(addressOrHandle: String, profileId: Int, date: String!): Summary30Days
    DailyChange(addressOrHandle: String, profileId: Int, startDate: String!, endDate: String!): [DailyChange]
    MonthlyStatistics(addressOrHandle: String, profileId: Int, startDate: String!, endDate: String!): MonthlyStatistics
    ProfileTopFollower(addressOrHandle: String, profileId: Int, startDate: String!, endDate: String!): ProfileTopFollower
    RevenueSupporters(addressOrHandle: String, profileId: Int, startDate: String!, endDate: String!, paginate: Pagination): [RevenueSupporter]
    RevenueSummary(addressOrHandle: String, profileId: Int, startDate: String!, endDate: String!): RevenueSummary
    RevenuePublications(addressOrHandle: String, profileId: Int, startDate: String!, endDate: String!, paginate: Pagination): [RevenuePublication]
    TopEngagementPosts(profileId: Int!, startDate: String!, endDate: String!, paginate: Pagination): [TopPost]
    TopCollectedPosts(profileId: Int!, startDate: String!, endDate: String!, paginate: Pagination): [TopPost]
  }
`

export default typeDefs;