import React, { useEffect, useState } from 'react';
import {
  getSession,
  GetSessionParams
} from 'next-auth/react';

import Navbar from '@components/Shared/Navbar';
import SummaryCard from '@components/Shared/SummaryCard';
import * as moment from 'moment';

import client from '../../apollo';
import { queryPublications, queryProfiles } from 'lens';
import { MonthlyData } from '@components/Shared/Summary/SummaryMonthlyStats';
import TopPostMonthly from '@components/Shared/Summary/TopPostMonthly';
import toast from 'react-hot-toast';
import { Session } from '../api/auth/[...nextauth]';
import { ApiProfileAndPermission, checkPermission } from '@lib/checkPermission';
import {
  DailyChangeQuery,
  MonthlyStatisticsQuery,
  ProfileQuery,
  ProfileTopFollowerQuery,
  SummaryQuery
} from '@lib/apiGraphql';

export async function getServerSideProps(context: GetSessionParams | undefined) {
  // 测试address
  // 0x713A95B5923FAEe8Dc32593Ff9c0A30a3818D978
  // 0xed74c2cdFa90CF3C824cc427a103065651e46d89
  // 0xBAD8ca0d3Ef9e2b9D2A3149b707a879eBeA2a0BD
  // 0x84080288433CeC65AF0fC29978b95EC9ed477da0
  const authSession: Session = await getSession(context);
  const { address } = context.params;
  const hasPermission = await checkPermission(address, authSession);
  if (!hasPermission) {
    return {
      props: {
        initSession: authSession,
        error: "You do not have permission to access this wallet address."
      }
    }
  }
  
  const { data: profileData } = await client.query({
    query: ProfileQuery,
    variables: { "address": address }
  });
  if (!address || !profileData?.Profile || !profileData?.Profile?.profile) {
    return {
      props: {
        initSession: authSession,
        error: "The wallet address not found."
      }
    }
  }
  
  const { data } = await client.query({
    query: SummaryQuery,
    variables: { "address": address }
  });

  const { data: dailyChanges } = await client.query({
    query: DailyChangeQuery,
    variables: { "address": address }
  });
  
  const { data: currentMonthlyData } = await client.query({
    query: MonthlyStatisticsQuery,
    variables: { "address": address, date: moment().format('YYYY-MM-DD') }
  });

  const { data: lastMonthlyData } = await client.query({
    query: MonthlyStatisticsQuery,
    variables: { "address": address, date: moment().subtract(1, 'months').format('YYYY-MM-DD') }
  });

  const { data: currentProfileTopFollower } = await client.query({
    query: ProfileTopFollowerQuery,
    variables: { "address": address, date: moment().format('YYYY-MM-DD') }
  });

  const { data: lastProfileTopFollower } = await client.query({
    query: ProfileTopFollowerQuery,
    variables: { "address": address, date: moment().subtract(1, 'months').format('YYYY-MM-DD') }
  });

  return {
    props: {
      data,
      initSession: authSession,
      dailyChanges: dailyChanges.DailyChange,
      currentMonthlyData: currentMonthlyData.MonthlyStatistics,
      lastMonthlyData: lastMonthlyData.MonthlyStatistics,
      profileData: profileData.Profile,
      currentProfileTopFollower: currentProfileTopFollower.ProfileTopFollower,
      lastProfileTopFollower: lastProfileTopFollower.ProfileTopFollower,
      error: null
    },
  }
}

const fetchPublication = async (currentMonthlyData, lastMonthlyData) => {
  let postIds: number[] = [];
  let profileId: number = currentMonthlyData?.profileId || 0;
  if (currentMonthlyData?.topEngagementPostId && !postIds.includes(currentMonthlyData.topEngagementPostId)) {
    postIds.push(currentMonthlyData.topEngagementPostId)
  }
  if (currentMonthlyData?.topCommentedPostId && !postIds.includes(currentMonthlyData.topCommentedPostId)) {
    postIds.push(currentMonthlyData.topCommentedPostId)
  }
  if (currentMonthlyData?.topMirroredPostId && !postIds.includes(currentMonthlyData.topMirroredPostId)) {
    postIds.push(currentMonthlyData.topMirroredPostId)
  }
  if (currentMonthlyData?.topCollectedPostId && !postIds.includes(currentMonthlyData.topCollectedPostId)) {
    postIds.push(currentMonthlyData.topCollectedPostId)
  }
  if (lastMonthlyData?.topEngagementPostId && !postIds.includes(lastMonthlyData.topEngagementPostId)) {
    postIds.push(lastMonthlyData.topEngagementPostId)
  }
  if (lastMonthlyData?.topCommentedPostId && !postIds.includes(lastMonthlyData.topCommentedPostId)) {
    postIds.push(lastMonthlyData.topCommentedPostId)
  }
  if (lastMonthlyData?.topMirroredPostId && !postIds.includes(lastMonthlyData.topMirroredPostId)) {
    postIds.push(lastMonthlyData.topMirroredPostId)
  }
  if (lastMonthlyData?.topCollectedPostId && !postIds.includes(lastMonthlyData.topCollectedPostId)) {
    postIds.push(lastMonthlyData.topCollectedPostId)
  }
  
  if (!profileId || !postIds.length) return {};
  
  let posts: any = {};
  const { data: publications } = await queryPublications(profileId, postIds)
  if (publications.publications?.items) {
    for (let post of publications.publications.items) {
      posts[post.id] = post;
    }
  }
  return posts
};

export type ProfileTopFollowerData = {
  followerProfileId?: number;
  followerProfileHandle?: string;
  followerProfileFollowersCount?: number;
  topFollowerFollowingCount?: number;
}

const fetchProfile = async (
  currentProfileTopFollower: ProfileTopFollowerData,
  lastProfileTopFollower: ProfileTopFollowerData
) => {
  // demo profile: stani.lens
  let handles: string[] = [];
  if (currentProfileTopFollower?.followerProfileHandle) {
    handles.push(currentProfileTopFollower?.followerProfileHandle)
  }
  if (lastProfileTopFollower?.followerProfileHandle) {
    handles.push(lastProfileTopFollower?.followerProfileHandle)
  }
  
  if (!handles || !handles.length) return {};
  const { data: profiles } = await queryProfiles(handles)
  let followers: any = {};
  if (profiles.profiles?.items) {
    for (let profile of profiles.profiles.items) {
      followers[profile.handle] = profile;
    }
  }
  return followers
}

export type OverviewProps = {
  data: any;
  initSession: any;
  dailyChanges: any;
  currentMonthlyData: MonthlyData;
  lastMonthlyData: MonthlyData;
  profileData: ApiProfileAndPermission;
  currentProfileTopFollower: ProfileTopFollowerData;
  lastProfileTopFollower: ProfileTopFollowerData;
  error?: string;
}


export default function Web({
                              data,
                              dailyChanges,
                              currentMonthlyData,
                              lastMonthlyData,
                              profileData,
                              currentProfileTopFollower,
                              lastProfileTopFollower,
                              error}: OverviewProps) {
  // Render data...data.Summary30Days.contentCountPrevious
  const [publications, setPublications] = useState({});
  const [followers, setFollowers] = useState({});
  const [lensLoading, setLensLoading] = useState(true);
  let addressName = profileData?.profile?.owner ? 
    `${profileData.profile.owner.substring(0, 4)}...${profileData.profile.owner.substring(profileData.profile.owner.length - 4)}`
    : '';
  
  useEffect(() => {
    if (error) {
      toast.error(error);
      setLensLoading(false);
      return;
    }

    (async () => {
      let posts = await fetchPublication(currentMonthlyData, lastMonthlyData)
      setPublications(posts);
      
      let followers = await fetchProfile(currentProfileTopFollower, lastProfileTopFollower)
      setFollowers(followers)

      setLensLoading(false);
    })()
  }, []);
  
  return (
      <div className="page_content">
        <Navbar
          addressName={addressName}
          addressHandle={profileData?.profile?.handle ? `@${profileData?.profile?.handle}` : ''} />
        <div className="px-5 pb-5">
          <div className="mt-12">
            <div className="flex leading-9 space-x-2 mb-8">
              <h4 className="inline text-3xl font-bold">30 days summary</h4>
              <span className="text-gray-500">with change over previous period</span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
              <SummaryCard
                title="Engagement"
                count={data?.Summary30Days?.engagementScoreCurrent || 0}
                data={(dailyChanges||[]).map((d) => ({ date: Date.parse(d.blockDate), value: d.engagementScoreChange }))}
                changePercent={(data?.Summary30Days?.engagementScoreChangePercentage || 0)}
              />
              <SummaryCard
                title="Publication"
                count={data?.Summary30Days?.publicationCountCurrent || 0}
                data={(dailyChanges||[]).map((d) => ({ date: Date.parse(d.blockDate), value: d.publicationCountChange }))}
                changePercent={(data?.Summary30Days?.publicationCountChangePercentage || 0)}
                bgClass="bg-amber-50"
                linearColor="#fbbf24"
              />
              <SummaryCard
                title="Followers"
                count={data?.Summary30Days?.followerCountCurrent || 0}
                data={(dailyChanges||[]).map((d) => ({ date: Date.parse(d.blockDate), value: d.followerCountChange }))}
                changePercent={(data?.Summary30Days?.followerCountChangePercentage || 0)}
                bgClass="bg-green-50"
                linearColor="#4ade80"
              />
              <SummaryCard
                title="Collect"
                count={data?.Summary30Days?.collectedCountCurrent || 0}
                data={(dailyChanges||[]).map((d) => ({ date: Date.parse(d.blockDate), value: d.collectedCountChange }))}
                changePercent={(data?.Summary30Days?.collectedCountChangePercentage || 0)}
                bgClass="bg-red-50"
                linearColor="#fca5a5"
              />
              <SummaryCard
                title="Reveune"
                count={data?.Summary30Days?.contentCountCurrent || 0}
                data={(dailyChanges||[]).map((d) => ({ date: Date.parse(d.blockDate), value: d.contentCountChange }))}
                changePercent={(data?.Summary30Days?.contentCountChangePercentage || 0)}
                bgClass="bg-violet-50"
                linearColor="#c4b5fd"
              />
            </div>
          </div>
          <div className="mt-12">
            <div className="flex leading-9 space-x-3 mb-8 border-b-4 border-green-400">
              <h4 className="inline text-2xl font-bold">{moment().format('MMM YYYY')}</h4>
            </div>
            <TopPostMonthly
              monthlyData={currentMonthlyData}
              publications={publications}
              loading={lensLoading}
              profileTopFollower={currentProfileTopFollower}
              followers={followers}
            />
          </div>
          <div className="mt-12">
            <div className="flex leading-9 space-x-2 mb-8 border-b-4 border-green-400">
              <h4 className="inline text-2xl font-bold">{moment().subtract(1, 'months').format('MMM YYYY')}</h4>
            </div>
            <TopPostMonthly
              monthlyData={lastMonthlyData}
              publications={publications}
              loading={lensLoading}
              profileTopFollower={lastProfileTopFollower}
              followers={followers}
            />
          </div>
        </div>
      </div>
  );
}
