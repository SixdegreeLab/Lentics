import React, { useEffect } from 'react';
import Navbar from '@components/Shared/Navbar';
import { getSession } from "next-auth/react";
import ResponsiveChart from '@components/Shared/Chart/ResponsiveChart';
import DailyChangesXYChart from '@components/Shared/Chart/DailyChangesXYChart';
import toast from 'react-hot-toast';
import moment from 'moment';
import { currentDate, toFixedWithoutRound } from '../overview/[address]';
import { ApiProfileAndPermission } from '@lib/checkPermission';
import { apiQuery } from '../../apollo';
import { DailyChangeQuery, ProfileQuery, RevenueSupportersQuery, RevenuePublicationsQuery, RevenueSummaryQuery } from '@lib/apiGraphql';
import RevenueCard from '@components/Shared/Revenue/RevenueCard';
import RevenueSupporters from '@components/Shared/Revenue/RevenueSupporters';
import RevnuePublications from '@components/Shared/Revenue/RevnuePublications';
import RevenuePieChart from '@components/Shared/Revenue/RevenuePieChart';
import { queryProfiles, queryPublications } from 'lens';
import CurrentViewingText from '@components/Shared/CurrentViewingText';

export type RevenueProps = {
  initSession: any;
  dailyChanges: any;
  revenueSupporters: any;
  supportersHandleData: any;
  revenuePublications: any;
  revenueSummary: any,
  error?: string;
  profileData: ApiProfileAndPermission;
}

export default function Revenue({ dailyChanges, revenueSupporters, revenuePublications, supportersHandleData, revenueSummary, error, profileData }: RevenueProps) {
  // Render data...
  useEffect(() => {
    if (error) {
      toast.error(error);
      return;
    }
  }, [])
  const supportersData = [
    {
      userAddress: 'test',
      handle: 'handle',
      description: 'test string',
      paidAmountUsd: 12,
      profileId: 1,
      link: "Lenster"
    },
    {
      userAddress: 'test2',
      handle: 'handle',
      description: 'test string',
      paidAmountUsd: 12,
      profileId: 2,
      link: "Lenster"
    },
    {
      userAddress: 'test3',
      handle: 'handle',
      description: 'test string',
      paidAmountUsd: 12,
      profileId: 3,
      link: "Lenster"
    }
  ];
  const publicationsData = [
    {
      publicationId: '0x43-0x34',
      content: 'test string',
      supporterCount: 13,
      paidAmountUsd: 12
    },
    {
      publicationId: '0x43-0x34',
      content: 'test string',
      supporterCount: 13,
      paidAmountUsd: 12
    },
    {
      publicationId: '0x43-0x34',
      content: 'test string',
      supporterCount: 13,
      paidAmountUsd: 12
    },
    {
      publicationId: '0x43-0x34',
      content: 'test string',
      supporterCount: 13,
      paidAmountUsd: 12
    },
  ]
  //console.log(revenueSupporters, supportersHandleData);
  return (
    <div className="page_content">
      <Navbar />
      <div className="md:p-1 xl:p-1 mt-2 md:mt-12 xl:mt-12">
        <CurrentViewingText profileData={profileData} />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-3 xl:gap-32">   
          <RevenueCard
            title="Total Revenue"
            cardCollor="yellow"
            count={revenueSummary?.paidAmountUsd || 0} icon="currency"
          />
          <RevenueCard
            title="Total Supporters"
            cardCollor="green"
            count={revenueSummary?.supporterCount || 0} icon="users"
          />
          <div className="col-span-2 md:col-span-1 xl:col-span-1">
          <RevenuePieChart
            title="revenue Distribution"
            cardCollor="red"
            revenueSummary={revenueSummary}
          /></div>
        </div>
        <h1 className="text-2xl font-bold mt-12">Revenure By Time</h1>
        <div>
          <ResponsiveChart>
            {({width, height}) => (
              <DailyChangesXYChart
                width={width}
                height={height}
                data={[
                  {
                    title: 'Collect Post',
                    data: (dailyChanges||[]).map((d) => ({ date: d.blockDate, value: toFixedWithoutRound(d.revenueCollectPostCountChange) }))
                  },
                  {
                    title: 'Follow Profile',
                    data: (dailyChanges||[]).map((d) => ({ date: d.blockDate, value: toFixedWithoutRound(d.revenueFollowProfileCountChange) }))
                  }
                ]}
              />
            )}
          </ResponsiveChart>
        </div>
        <RevenueSupporters data={revenueSupporters} handleData={supportersHandleData} />
        <RevnuePublications data={revenuePublications} />
      </div>
    </div>
  );
}
export type PostItemData = {
  publicationId: string;
  supporterCount: number;
  paidAmountUsd: number;
  content: string;
};

export async function getServerSideProps(context) {
  const authSession = await getSession(context);
  const { address } = context?.params ?? '';
  const pageTitle = 'Lentics - Revenue';
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

  const { data: revenueSupportersData } = await apiQuery({
    query: RevenueSupportersQuery,
    variables: {
      profileId: Number(profileData.Profile.profile.profileId),
      startDate: moment(currentDate).subtract(1, 'months').format('YYYY-MM-DD'),
      endDate: moment(currentDate).format('YYYY-MM-DD')
    }
  });
  let supportersHandle = (revenueSupportersData?.RevenueSupporters || []).map(
    (item) => item.handle
  );
  //supportersHandle = ['jimmythevillain.lens','metaversemusic.lens','verbal.lens','liquidape.lens']; // test data
  let supportersHandleData: any[] = [];
  if(supportersHandle.length){
    try{
      let { data: profiles } = await queryProfiles(supportersHandle);
      supportersHandleData = profiles?.profiles?.items || [];
    }
    catch(e){}
  }
  
  const { data: RevenuePublicationsData } = await apiQuery({
    query: RevenuePublicationsQuery,
    variables: {
      profileId: Number(profileData.Profile.profile.profileId),
      startDate: moment(currentDate).subtract(1, 'months').format('YYYY-MM-DD'),
      endDate: moment(currentDate).format('YYYY-MM-DD')
    }
  });

  let postIds: number[] = [];
  let postItems: PostItemData[] = [];
  for(let item of RevenuePublicationsData.RevenuePublications){
    postIds.push(item.pubId);
    postItems.push({
      publicationId: item.publicationId,
      supporterCount: item.supporterCount,
      paidAmountUsd: item.paidAmountUsd,
      content: ''
    });
  }
  if(postIds.length){
    try{
      const { data: publications } = await queryPublications(Number(profileData.Profile.profile.profileId), postIds);
      if (publications.publications?.items) {
        for (let post of publications.publications.items) {
          for(let i=0; i<postItems.length; i++){
            if(post.id==postItems[i].publicationId){
              postItems[i].content = post?.metadata?.content;
            }
          }
        }
      }
    }
    catch(e){}
  }
  
  const { data: RevenueSummaryData } = await apiQuery({
    query: RevenueSummaryQuery,
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
      revenueSupporters: revenueSupportersData.RevenueSupporters,
      supportersHandleData: supportersHandleData,
      revenuePublications: postItems,
      revenueSummary: RevenueSummaryData.RevenueSummary,
      profileData: profileData.Profile,
      error: dailyChanges.DailyChange ? null : "The current profile doesn't have any activity in the period."
    },
  }
}
