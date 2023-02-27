import React, { useEffect } from 'react';
import Navbar from '@components/Shared/Navbar';
import { getSession } from "next-auth/react";
import { apiQuery } from '../../apollo';
import { DailyChangeQuery, ProfileQuery } from '@lib/apiGraphql';
import DailyChangesXYChart from '@components/Shared/Chart/DailyChangesXYChartWithMultiYAxis';
import ResponsiveChart from '@components/Shared/Chart/ResponsiveChart';
import toast from 'react-hot-toast';
import moment from 'moment';
import { currentDate } from '../overview/[address]';
import { ApiProfileAndPermission } from '@lib/checkPermission';
import RevenueCard from '@components/Shared/Revenue/RevenueCard';
import CurrentViewingText from '@components/Shared/CurrentViewingText';

export type EngagementProps = {
  initSession: any;
  dailyChanges: any;
  error?: string;
  profileData: ApiProfileAndPermission;
}
const getEngagementTotalChangeData = (data) => {
  let result = {
    totalEngagementScoreChange: 0,
    totalPublicationCountChange: 0,
    totalRevenueCountChange: 0
  };
  for(let item of data){
    result.totalEngagementScoreChange += item.engagementScoreChange;
    result.totalPublicationCountChange += item.publicationCountChange;
    result.totalRevenueCountChange += item.revenueCountChange;
  }
  return result;
};

export default function Engagement({ dailyChanges, error, profileData }: EngagementProps) {
  // Render data...
  useEffect(() => {
    if (error) {
      toast.error(error);
      return;
    }
  }, [])

  let engagementTotalChangeData = getEngagementTotalChangeData(dailyChanges||[]);
  return (
    <div className="page_content">
      <Navbar />
      <div className="md:p-1 xl:p-1 mt-2 md:mt-12 xl:mt-12">
        <CurrentViewingText profileData={profileData} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-3 xl:gap-32">   
          <RevenueCard
            title="Total Revenue"
            cardCollor="yellow"
            count={engagementTotalChangeData.totalRevenueCountChange} icon="currency"
          />
          <RevenueCard
            title="Total Engagement"
            cardCollor="green"
            count={engagementTotalChangeData.totalEngagementScoreChange} icon="engagement"
          />
          <div className="col-span-2 md:col-span-1 xl:col-span-1">
            <RevenueCard
              title="Total Publication"
              cardCollor="green"
              count={engagementTotalChangeData.totalPublicationCountChange} icon="publication"
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold mt-12">Engagement By Time</h1>
        <div>
          <ResponsiveChart>
            {({width, height}) => (
              <DailyChangesXYChart
                width={width}
                height={height}
                data={{
                  chart1: [
                    {
                      title: 'Engagement',
                      data: (dailyChanges||[]).map((d) => ({ date: d.blockDate, value: d.engagementScoreChange }))
                    }
                  ],
                  chart2: [
                    {
                      title: 'Post',
                      data: (dailyChanges||[]).map((d) => ({ date: d.blockDate, value: d.publicationPostCountChange }))
                    },
                    {
                      title: 'Followers',
                      data: (dailyChanges||[]).map((d) => ({ date: d.blockDate, value: d.followerCountChange }))
                    },
                    {
                      title: 'Comments',
                      data: (dailyChanges||[]).map((d) => ({ date: d.blockDate, value: d.publicationCommentCountChange }))
                    },
                    {
                      title: 'Commented',
                      data: (dailyChanges||[]).map((d) => ({ date: d.blockDate, value: d.commentedCountChange }))
                    },
                    {
                      title: 'Mirrors',
                      data: (dailyChanges||[]).map((d) => ({ date: d.blockDate, value: d.publicationMirrorCountChange }))
                    },
                    {
                      title: 'Mirrored',
                      data: (dailyChanges||[]).map((d) => ({ date: d.blockDate, value: d.mirroredCountChange }))
                    },
                    {
                      title: 'Collect',
                      data: (dailyChanges||[]).map((d) => ({ date: d.blockDate, value: d.collectCountChange }))
                    },
                    {
                      title: 'Collected',
                      data: (dailyChanges||[]).map((d) => ({ date: d.blockDate, value: d.collectedCountChange }))
                    }
                  ]
                }}
              />
            )}
          </ResponsiveChart>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const authSession = await getSession(context);
  const { address } = context?.params ?? '';
  const pageTitle = 'Lentics - Engagement';
  const { data: profileData } = await apiQuery({
    query: ProfileQuery,
    variables: { "address": address }
  });
  if (!address || !profileData?.Profile || !profileData?.Profile?.profile) {
    return {
      props: {
        pageTitle: pageTitle,
        initSession: authSession,
        error: "The current address doesn't have Lens profile."
      }
    }
  }
  
  const { data: dailyChanges } = await apiQuery({
    query: DailyChangeQuery,
    variables: {
      profileId: Number(profileData.Profile.profile.profileId),
      startDate: moment(currentDate).subtract(1, 'months').format('YYYY-MM-DD'),
      endDate: moment(currentDate).format('YYYY-MM-DD')
    }
  });
  return {
    props: {
      pageTitle: pageTitle,
      initSession: await getSession(context),
      dailyChanges: dailyChanges.DailyChange,
      profileData: profileData.Profile,
      error: dailyChanges.DailyChange ? null : "The current profile doesn't have any activity in the period."
    },
  }
}
