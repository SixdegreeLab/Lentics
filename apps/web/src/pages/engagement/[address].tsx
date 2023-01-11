import React, { useEffect } from 'react';
import Navbar from '@components/Shared/Navbar';
import { getSession } from "next-auth/react";
import { apiQuery } from '../../apollo';
import { DailyChangeQuery, ProfileQuery } from '@lib/apiGraphql';
import DailyChangesXYChart from '@components/Shared/Chart/DailyChangesXYChart';
import ResponsiveChart from '@components/Shared/Chart/ResponsiveChart';
import toast from 'react-hot-toast';
import moment from 'moment';
import { currentDate } from '../overview/[address]';

export type EngagementProps = {
  initSession: any;
  dailyChanges: any;
  error?: string;
}

export default function Engagement({ dailyChanges, error }: EngagementProps) {
  // Render data...
  useEffect(() => {
    if (error) {
      toast.error(error);
      return;
    }
  }, [])
  return (
    <div className="page_content">
      <Navbar />
      <div className="p-1">
        <h1 className="text-3xl font-bold">Engagement</h1>
        <div>30 days engagement</div>
        <div>
          <ResponsiveChart>
            {({width, height}) => (
              <DailyChangesXYChart
                width={width}
                height={height}
                data={[
                  {
                    title: 'Engagement',
                    data: (dailyChanges||[]).map((d) => ({ date: d.blockDate, value: d.engagementScoreChange }))
                  }
                ]}
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
  const { data: profileData } = await apiQuery({
    query: ProfileQuery,
    variables: { "address": address }
  });
  if (!address || !profileData?.Profile || !profileData?.Profile?.profile) {
    return {
      props: {
        initSession: authSession,
        error: "The current address doesn't have Lens profile."
      }
    }
  }
  
  const { data: dailyChanges } = await apiQuery({
    query: DailyChangeQuery,
    variables: { "address": address, date: moment(currentDate).format('YYYY-MM-DD') }
  });
  return {
    props: {
      initSession: await getSession(context),
      dailyChanges: dailyChanges.DailyChange,
      error: dailyChanges.DailyChange ? null : "The current profile doesn't have any activity in the period."
    },
  }
}
