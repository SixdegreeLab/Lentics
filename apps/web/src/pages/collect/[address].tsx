import React, { useEffect } from 'react';
import Navbar from '@components/Shared/Navbar';
import { getSession } from "next-auth/react";
import { apiQuery } from '../../apollo';
import { DailyChangeQuery, ProfileQuery, MonthlyStatisticsQuery } from '@lib/apiGraphql';
import DailyChangesXYChart from '@components/Shared/Chart/DailyChangesXYChart';
import ResponsiveChart from '@components/Shared/Chart/ResponsiveChart';
import toast from 'react-hot-toast';
import moment from 'moment';
import { currentDate } from '../overview/[address]';
import { ApiProfileAndPermission } from '@lib/checkPermission';
import RevenueCard from '@components/Shared/Revenue/RevenueCard';
import { queryPublications } from 'lens';
import { Fragment } from 'react'
import { Tab } from '@headlessui/react';
import Post from '@components/Shared/publication/Post';
import CurrentViewingText from '@components/Shared/CurrentViewingText';

export type CollectProps = {
  initSession: any;
  dailyChanges: any;
  topCollectPost: any;
  error?: string;
  profileData: ApiProfileAndPermission;
}
const getCollectTotalChangeData = (data) => {
  let result = {
    totalCollectCountChange: 0,
    totalCollectedCountChange: 0
  };
  for(let item of data){
    result.totalCollectCountChange += item.collectCountChange;
    result.totalCollectedCountChange += item.collectedCountChange;
  }
  return result;
};
const getTopCollectPostDetails = async (profileId, startDate, endDate) => {

  if (!profileId){
    return {};
  }
  const { data: monthlyDatas } = await apiQuery({
    query: MonthlyStatisticsQuery,
    variables: {
      profileId: Number(profileId),
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD')
    }
  });
  let monthlyData = monthlyDatas?.MonthlyStatistics?? {};

  let postIds: number[] = [];

  if (monthlyData?.topCollectedPostId) {
    postIds.push(monthlyData.topCollectedPostId);
  }
  if (!postIds.length){
    return {};
  }
  try{
    const { data: publications } = await queryPublications(profileId, postIds);
    if (publications.publications?.items) {
      for (let post of publications.publications.items) {
        if(!post.hidden){
          return post;
        }
      }
    }
  }
  catch(e){}
  return {};
};

export default function Collect({ dailyChanges, error, profileData, topCollectPost }: CollectProps) {
  // Render data...
  useEffect(() => {
    if (error) {
      toast.error(error);
      return;
    }
  }, [])

  let collectTotalChangeData = getCollectTotalChangeData(dailyChanges||[]);
  return (
    <div className="page_content">
      <Navbar />
      <div className="md:p-1 xl:p-1 mt-2 md:mt-12 xl:mt-12">
        <CurrentViewingText profileData={profileData} />
        <div className="grid grid-cols-2 gap-8 mt-12">   
          <RevenueCard
            title="Total Collect"
            cardCollor="yellow"
            count={collectTotalChangeData.totalCollectCountChange} icon="engagement"
          />
          <RevenueCard
            title="Total Collected"
            cardCollor="green"
            count={collectTotalChangeData.totalCollectedCountChange} icon="engagement"
          />
        </div>
        <h1 className="text-2xl font-bold mt-12">Collect By Time</h1>
        <div>
          <ResponsiveChart>
            {({width, height}) => (
              <DailyChangesXYChart
                width={width}
                height={height}
                data={[
                  {
                    title: 'Collect',
                    data: (dailyChanges||[]).map((d) => ({ date: d.blockDate, value: d.collectCountChange }))
                  },
                  {
                    title: 'Collected',
                    data: (dailyChanges||[]).map((d) => ({ date: d.blockDate, value: d.collectedCountChange }))
                  }
                ]}
              />
            )}
          </ResponsiveChart>
        </div>
        <div className="mt-12 flex flex-col-reverse md:grid md:grid-cols-1 xl:grid xl:grid-cols-1">
          <div className="pb-8">
            <Tab.Group>
              <Tab.List className="w-full flex bg-white border rounded-md border-gray-200 mb-2 p-4">
                <div className="flex-grow">
                  <Tab as={Fragment}>
                  {({ selected }) => (
                    <button className={ selected ? 
                        'border-b-4 border-green-600 text-green-600 px-4' : 
                        'text-black px-4'
                      }
                    >Top Collect</button>
                  )}
                  </Tab>
                </div>
                <div className="hidden flex-grow-0 md:flex lx:flex text-gray-400 text-sm w-[300px]">
                  {/*<div className="flex-1">engagement</div>*/}
                  <div className="flex-1">comment</div>
                  <div className="flex-1">mirror</div>
                  <div className="flex-1">collect</div>
                </div>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <Post key="topCollectedPost" data={topCollectPost}/>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const authSession = await getSession(context);
  const { address } = context?.params ?? '';
  const pageTitle = 'Lentics - Collect';
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

  let profileId = profileData?.Profile?.profile?.profileId;
  let startDate = moment().subtract(1, 'months').format('YYYY-MM-DD');
  let endDate = moment().format('YYYY-MM-DD');
  const { data: dailyChanges } = await apiQuery({
    query: DailyChangeQuery,
    variables: {
      "address": address,
      startDate: startDate,
      endDate: endDate
    }
  });
  const topCollectPost  = await getTopCollectPostDetails(profileId,startDate,endDate);
  return {
    props: {
      pageTitle: pageTitle,
      initSession: await getSession(context),
      dailyChanges: dailyChanges.DailyChange,
      profileData: profileData.Profile,
      topCollectPost: topCollectPost,
      error: dailyChanges.DailyChange ? null : "The current profile doesn't have any activity in the period."
    },
  }
}
