import React from 'react';

export type MonthlyData = {
  engagementScore: number;
  publicationCount: number;
  followerCount: number;
  collectedCount: number;
  contentCount: number;
  profileId: number;
  topEngagementPostId: number;
  topCommentedPostId: number;
  topMirroredPostId: number;
  topCollectedPostId: number;
}
export type SummaryMonthlyStatsProps = {
  monthlyData: MonthlyData;
}

const SummaryMonthlyStats: React.FC<SummaryMonthlyStatsProps> = ({ monthlyData }) => {
  return (
    <div className="grid gap-4 sm:gap-8 grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 overview-summary-month break-all items-stretch content-center">
      <div className="overview-summary-month-item">
        <h6>Engagements</h6>
        <div>{monthlyData?.engagementScore ?? 0}</div>
      </div>
      <div className="overview-summary-month-item">
        <h6>Publications</h6>
        <div>{monthlyData?.publicationCount ?? 0}</div>
      </div>
      <div className="overview-summary-month-item">
        <h6>New Followers</h6>
        <div>{monthlyData?.followerCount ?? 0}</div>
      </div>
      <div className="overview-summary-month-item">
        <h6>Collects</h6>
        <div>{monthlyData?.collectedCount ?? 0}</div>
      </div>
      {/*<div className="overview-summary-month-item">
        <h6>Revenue</h6>
        <div>{monthlyData?.contentCount ?? 0}</div>
      </div>*/}
    </div>
  )
}

export default SummaryMonthlyStats;
