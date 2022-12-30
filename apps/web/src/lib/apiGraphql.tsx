import { gql } from '@apollo/client';

export const SummaryQuery = gql`
  query SummaryQuery($address: String!) {
    Summary30Days(address: $address) {
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
    }
  }
`

export const DailyChangeQuery = gql`query DailyChange($address: String!) {
  DailyChange(address: $address) {
    profileId
    blockDate
    contentCountChange
    engagementScoreChange
    publicationCountChange
    followerCountChange
    commentedCountChange
    mirroredCountChange
    collectedCountChange
  }
}
`

export const MonthlyStatisticsQuery = gql`query MonthlyStatistics($address: String!, $date: String!) {
  MonthlyStatistics(address: $address, date: $date) {
    profileId
    startDate
    contentCount
    engagementScore
    publicationCount
    followerCount
    commentedCount
    mirroredCount
    collectedCount
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
  Profile(address: $address) {
    profile {
      owner
      handle
    }
    isInWhiteList
  }
}
`;

export const ProfileTopFollowerQuery = gql`query ProfileTopFollower($address: String!, $date: String!) {
  ProfileTopFollower(address: $address, date: $date) {
    followerProfileId
    followerProfileHandle
    followerProfileFollowersCount
    topFollowerFollowingCount
  }
}
`;
