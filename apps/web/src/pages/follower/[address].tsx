import React, { useEffect } from 'react';
import Navbar from '@components/Shared/Navbar';
import { getSession } from "next-auth/react";
import { apiQuery } from '../../apollo';
import { DailyChangeQuery, ProfileQuery, FollowersQuery } from '@lib/apiGraphql';
import DailyChangesXYChart from '@components/Shared/Chart/DailyChangesXYChart';
import ResponsiveChart from '@components/Shared/Chart/ResponsiveChart';
import toast from 'react-hot-toast';
import moment from 'moment';
//import { currentDate } from '../overview/[address]';
import { ApiProfileAndPermission } from '@lib/checkPermission';
import RevenueCard from '@components/Shared/Revenue/RevenueCard';
import { queryProfiles } from 'lens';
import FollowersList from '@components/Shared/Followers/FollowersList';
import CurrentViewingText from '@components/Shared/CurrentViewingText';

export type FollowerProps = {
  initSession: any;
  dailyChanges: any;
  error?: string;
  profileData: ApiProfileAndPermission;
  followers: any;
}
const setDefaultDailyChangesData = () => {
  let start_date = moment().subtract(1, 'months').format('YYYY-MM-DD');
  let end_date = moment().format('YYYY-MM-DD'); 
  let days = moment(end_date).diff(moment(start_date), "days");
  let data: any[] = [];
  for(let i=0; i<days; i++){
    data.push(
      {
        profileId: i,
        blockDate: moment(start_date).add(i, "days").format('YYYY-MM-DD'),
        followerCountChange:0
      }
    );
  }
  return data
};

export default function Follower({ dailyChanges, error, profileData, followers }: FollowerProps) {
  // Render data...
  useEffect(() => {
    if (error) {
      toast.error(error);
      return;
    }
  }, [])
  if(typeof(dailyChanges)=="undefined"){
    dailyChanges = setDefaultDailyChangesData();
  }
  //console.log(followers);

  return (
    <div className="page_content">
      <Navbar />
      <div className="md:p-1 xl:p-1 mt-2 md:mt-12 xl:mt-12">
        <CurrentViewingText profileData={profileData} />
        {/*<div className="grid grid-cols-2 gap-8">   
          <RevenueCard
            title="Total Followers"
            cardCollor="yellow"
            count={100} icon="users"
          />
          <RevenueCard
            title="Total Following"
            cardCollor="green"
            count={200} icon="users"
          />
      </div>*/}
        <h1 className="text-2xl font-bold mt-12">Follower By Time</h1>
        <div>
          <ResponsiveChart>
            {({width, height}) => (
              <DailyChangesXYChart
                width={width}
                height={height}
                data={[
                  {
                    title: 'Followers',
                    data: (dailyChanges||[]).map((d) => ({ date: d.blockDate, value: d.followerCountChange }))
                  }
                ]}
              />
            )}
          </ResponsiveChart>
        </div>
        <FollowersList data={followers?.profiles?.items ?? []} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const authSession = await getSession(context);
  const { address } = context?.params ?? '';
  const pageTitle = 'Lentics - Follower';
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
      profileId: Number(profileId),
      startDate: startDate,
      endDate: endDate
    }
  });

  const { data: followers } = await apiQuery({
    query: FollowersQuery,
    variables: {
      profileId: Number(profileId),
      startDate: startDate,
      endDate: endDate,
      paginate: {
        offset: 0,
        limit: 10
      }
    }
  });
  let followersHandle = (followers?.Followers || []).map(
    (item) => item.followerHandle
  );
  //followersHandle = ['jimmythevillain.lens','metaversemusic.lens','verbal.lens','liquidape.lens']; // test data
  let followersData: any[] = [];
  if(followersHandle.length){
    try{
      let { data: profiles } = await queryProfiles(followersHandle);
      followersData = profiles;
    }
    catch(e){
      
    }
  }

  //const { data: followers } = await queryFollowers(profileData.Profile.profile.profileId,10);

  return {
    props: {
      pageTitle: pageTitle,
      initSession: await getSession(context),
      dailyChanges: dailyChanges.DailyChange,
      profileData: profileData.Profile,
      followers: followersData,
      error: dailyChanges.DailyChange ? null : "The current profile doesn't have any activity in the period."
    },
  }
}
