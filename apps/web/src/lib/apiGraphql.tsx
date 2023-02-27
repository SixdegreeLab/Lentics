import { gql } from '@apollo/client';

export const SummaryQuery = gql`
  query SummaryQuery($address: String, $profileId: Int, $date: String!) {
    Summary30Days(addressOrHandle: $address, profileId: $profileId, date: $date) {
      profileId
      contentCountCurrent
      contentCountPrevious
      contentCountChange
      contentCountChangePercentage
      engagementScoreCurrent
      engagementScorePrevious
      engagementScoreChangeValue
      engagementScoreChangePercentage
      publicationCountCurrent
      publicationCountPrevious
      publicationCountChange
      publicationCountChangePercentage
      followerCountCurrent
      followerCountPrevious
      followerCountChange
      followerCountChangePercentage
      commentedCountCurrent
      commentedCountPrevious
      commentedCountChange
      commentedCountChangePercentage
      mirroredCountCurrent
      mirroredCountPrevious
      mirroredCountChange
      mirroredCountChangePercentage
      collectedCountCurrent
      collectedCountPrevious
      collectedCountChange
      collectedCountChangePercentage
      totalRevenueAmountCurrent
      totalRevenueAmountPrevious
      totalRevenueAmountChange
      totalRevenueAmountChangePercentage
    }
  }
`

export const DailyChangeQuery = gql`query DailyChange($address: String, $profileId: Int, $startDate: String!, $endDate: String!) {
  DailyChange(addressOrHandle: $address, profileId: $profileId, startDate: $startDate, endDate: $endDate) {
    profileId
    blockDate
    contentCountChange
    engagementScoreChange
    publicationCountChange
    followerCountChange
    commentedCountChange
    mirroredCountChange
    collectCountChange
    collectedCountChange
    publicationPostCountChange
    publicationCommentCountChange
    publicationMirrorCountChange
    revenueCountChange
    revenueCollectPostCountChange
    revenueCollectMirroredCountChange
    revenueFollowProfileCountChange
  }
}
`

export const MonthlyStatisticsQuery = gql`query MonthlyStatistics($address: String, $profileId: Int, $startDate: String!, $endDate: String!) {
  MonthlyStatistics(addressOrHandle: $address, profileId: $profileId, startDate: $startDate, endDate: $endDate) {
    profileId
    startDate
    contentCount
    engagementScore
    publicationCount
    followerCount
    commentCount
    commentedCount
    mirrorCount
    mirroredCount
    collectCount
    collectedCount
    revenueCount
    topEngagementPostId
    topPostEngagementScore
    topEngagementPostContentUri
    topCommentedPostId
    topPostCommentedCount
    topCommentedPostContentUri
    topMirroredPostId
    topPostMirroredCount
    topMirroredPostContentUri
    topCollectedPostId
    topPostCollectedCount
    topCollectedPostContentUri
  }
}
`

export const ProfileQuery = gql`query Profile($address: String!) {
  Profile(addressOrHandle: $address) {
    profile {
      profileId
      owner
      handle
    }
    isInWhiteList
    whitelist
  }
}
`;

export const ProfileTopFollowerQuery = gql`query ProfileTopFollower($address: String, $profileId: Int, $startDate: String!, $endDate: String!) {
  ProfileTopFollower(addressOrHandle: $address, profileId: $profileId, startDate: $startDate, endDate: $endDate) {
    followerProfileId
    followerProfileHandle
  }
}
`;


export const RevenueSupportersQuery = gql`query RevenueSupporters($address: String, $profileId: Int, $startDate: String!, $endDate: String!) {
  RevenueSupporters(addressOrHandle: $address, profileId: $profileId, startDate: $startDate, endDate: $endDate) {
    userAddress
    handle
    profileId
    link
    paidAmountUsd
  }
}
`;

export const RevenuePublicationsQuery = gql`query RevenueSupporters($address: String, $profileId: Int, $startDate: String!, $endDate: String!) {
  RevenuePublications(addressOrHandle: $address, profileId: $profileId, startDate: $startDate, endDate: $endDate) {
    publicationId
    profileId
    pubId
    paidAmountUsd
    supporterCount
  }
}
`;

export const RevenueSummaryQuery = gql`query RevenueSupporters($address: String, $profileId: Int, $startDate: String!, $endDate: String!) {
  RevenueSummary(addressOrHandle: $address, profileId: $profileId, startDate: $startDate, endDate: $endDate) {
    supporterCount
    paidAmountUsd
    revenueAmountByToken {
      symbol
      paidAmountUsd
    }
  }
}
`;

export const PostQuery = gql`query PostQuery($profileId: Int!, $startDate: String!, $endDate: String!) {
  Posts(profileId: $profileId, startDate: $startDate, endDate: $endDate) {
    txHash
    txIndex
    blockTime
    blockNumber
    profileId
    pubId
    contentUri
    collectModule
    referenceModule
    timestamp
  }
}
`;

export const FollowersQuery = gql`query Followers($profileId: Int!, $startDate: String!, $endDate: String!, $paginate: Pagination) {
  Followers(profileId: $profileId, startDate: $startDate, endDate: $endDate, paginate: $paginate) {
    txHash
    txIndex
    blockTime
    blockNumber
    follower
    profileId
    followerHandle
    followerProfileId
    timestamp
  }
}
`;

export const TopEngagementPostsQuery = gql`query TopEngagementPosts($profileId: Int!, $startDate: String!, $endDate: String!, $paginate: Pagination) {
  TopEngagementPosts(profileId: $profileId, startDate: $startDate, endDate: $endDate, paginate: $paginate) {
    topPostId
    topPostContentUri
  }
}
`;

export const TopCollectedPostsQuery = gql`query TopCollectedPosts($profileId: Int!, $startDate: String!, $endDate: String!, $paginate: Pagination) {
  TopCollectedPosts(profileId: $profileId, startDate: $startDate, endDate: $endDate, paginate: $paginate) {
    topPostId
    topPostContentUri
  }
}
`;
