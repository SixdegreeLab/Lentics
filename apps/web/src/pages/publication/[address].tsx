import React, { useEffect, useState, forwardRef} from 'react';
import Navbar from '@components/Shared/Navbar';
import { getSession } from "next-auth/react";
import { apiQuery } from '../../apollo';
import { queryPublications, getHexLensPublicationIdWithBigNumber } from 'lens';
import { DailyChangeQuery, MonthlyStatisticsQuery, ProfileQuery, TopEngagementPostsQuery, TopCollectedPostsQuery, PostQuery } from '@lib/apiGraphql';
import DailyChangesXYBarChart from '@components/Shared/Chart/DailyChangesXYBarChart';
import DailyChangesXYChart from '@components/Shared/Chart/DailyChangesXYChart';
import ResponsiveChart from '@components/Shared/Chart/ResponsiveChart';
import toast from 'react-hot-toast';
import moment from 'moment';
import { ApiProfileAndPermission } from '@lib/checkPermission';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import IconSpin from '@components/Shared/Spin';
import Calendar from '@components/Shared/Icon/Calendar';
//import { useRouter } from 'next/router';
//import { DEMO_USER_ADDRESS } from 'data/constants';
import { Fragment } from 'react'
import { Tab } from '@headlessui/react';
import Post from '@components/Shared/publication/Post';
import AnalyticsChart from '@components/Shared/publication/AnalyticsChart';
import RevenueCard from '@components/Shared/Revenue/RevenueCard';
import CurrentViewingText from '@components/Shared/CurrentViewingText';

export type PublicationProps = {
  initSession: any;
  dailyChanges: any;
  postsData: any;
  error?: string;
  profileId: string | number;
  profileData: ApiProfileAndPermission;
}
const fetchPublicationData = async (profileId, startDate, endDate) => {
  const { data: dailyChanges } = await apiQuery({
    query: DailyChangeQuery,
    variables: {
      profileId: Number(profileId),
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD')
    }
  });

  return dailyChanges.DailyChange ?? defaultPublicationData(startDate, endDate);
};
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

const fetchPostDetails = async (profileId, startDate, endDate) => {

  if (!profileId){
    return {
      'statistics': {},
      'topCollectedPosts': {},
      'topEngagementPosts': {}
    };
  }
  let queryVariables = {
    profileId: Number(profileId),
    startDate: moment(startDate).format('YYYY-MM-DD'),
    endDate: moment(endDate).format('YYYY-MM-DD')
  }

  const { data: monthlyDatas } = await apiQuery({
    query: MonthlyStatisticsQuery,
    variables: queryVariables
  });
  let monthlyData = monthlyDatas?.MonthlyStatistics?? {};

  const { data: TopEngagementPosts } = await apiQuery({
    query: TopEngagementPostsQuery,
    variables: queryVariables
  });
  const { data: TopCollectedPosts } = await apiQuery({
    query: TopCollectedPostsQuery,
    variables: queryVariables
  });

  let postIds: number[] = [];
  let topEngagementPostsId: string[] = [];
  let topCollectedPostsId: string[] = [];
  for(let item of TopEngagementPosts.TopEngagementPosts){
    postIds.push(item.topPostId);
    topEngagementPostsId.push(getHexLensPublicationIdWithBigNumber(Number(profileId), item.topPostId));
  }
  for(let item of TopCollectedPosts.TopCollectedPosts){
    if (!postIds.includes(item.topPostId)) {
      postIds.push(item.topPostId);
    }
    topCollectedPostsId.push(getHexLensPublicationIdWithBigNumber(Number(profileId), item.topPostId));
  }
  let topCollectedPosts = {};
  let topEngagementPosts = {};
  if (postIds.length){
    try{
      const { data: publications } = await queryPublications(profileId, postIds);
      if (publications.publications?.items) {
        for (let post of publications.publications.items) {
          if(!post.hidden){
            if(topEngagementPostsId.indexOf(post.id)!=-1){
              topEngagementPosts[post.id] = post;
            }
            if(topCollectedPostsId.indexOf(post.id)!=-1){
              topCollectedPosts[post.id] = post;
            }
          }
        }
      }//console.log(profileId,postIds,publications);
    }
    catch(e){}
  }
  return {
    'posts': postIds,
    'statistics': monthlyData,
    'topCollectedPosts': topCollectedPosts,
    'topEngagementPosts': topEngagementPosts
  };
};

const defaultPublicationData = (start_date, end_date) => {
  let days = moment(end_date).diff(moment(start_date), "days");
  let data: any[] = [];
  for(let i=0; i<days; i++){
    data.push(
      {
        profileId: i,
        blockDate: moment(start_date).add(i, "days").format('YYYY-MM-DD'),
        contentCountChange:0,
        engagementScoreChange:0,
        publicationCountChange:0,
        followerCountChange:0,
        commentedCountChange:0,
        mirroredCountChange:0,
        collectedCountChange:0,
        publicationPostCountChange:0,
        publicationCommentCountChange:0,
        publicationMirrorCountChange:0,
        revenueCountChange:0,
        revenueCollectPostCountChange:0,
        revenueCollectMirroredCountChange:0,
        revenueFollowProfileCountChange:0,
      }
    );
  }
  return data
};
const totalEngagements = (data) => {
  let total = 0;
  if(data){
    for(let item of data){
      total += item.engagementScoreChange;
    }
  }
  return total;
}

const loadingIcon = (
  <div className="h-full fixed inset-2/4 absolute items-center">
    <IconSpin className="w-8 h-8" />
  </div>
)
const CalendarCustomInput = React.forwardRef(({value, onClick}:any, ref) => {
  return (
    <div className="text-sm border overflow-hidden truncate border-gray-200 rounded-md w-[30px] md:w-[200px] xl:w-[200px] p-2 leading-5" onClick={onClick}>
      <Calendar className={'w-4 h-4 inline-block pr-1 mr-1 md:mr-0 xl:mr-0'} />
      <span>{value}</span>
    </div>
  );
});

export default function Publication({ dailyChanges, postsData = {
  'posts': {},
  'topCollectedPost': {},
  'topCommentedPost': {}
}, error, profileData, profileId }: PublicationProps) {
  // Render data...
  useEffect(() => {
    if (error) {
      toast.error(error);
      //return;
    }
  }, [])

  let [dailyChangesData, setDailyChangesData] = useState(dailyChanges);
  let [engagementTotal, setEngagementTotal] = useState(totalEngagements(dailyChanges));
  let [dayCount, setDayCount] = useState(30);
  let [posts, setPost] = useState(postsData);//console.log(postsData);
  let [loading, setLoading] = useState(false);
  let [engagementTotalChangeData, setEngagementTotalChangeData] = useState(getEngagementTotalChangeData(dailyChanges||[]));

  //const { query } = useRouter();
  //const address = query.address == null ? DEMO_USER_ADDRESS : query.address;
  let [startDate, setStartDate] = useState(moment().subtract(1, 'months').toDate());
  let [endDate, setEndDate] = useState(moment().toDate());


  const changeDateRange = (range) => {
    let [start_date, end_date] = range;
    setStartDate(start_date);
    setEndDate(end_date);
    if(end_date){
      setDayCount(moment(end_date).diff(moment(start_date), "days"));

      setLoading(true);
      (async () => {
        let startDate = moment(start_date).format('YYYY-MM-DD');
        let endDate = moment(end_date).format('YYYY-MM-DD');
        let dailyChange  = await fetchPublicationData(profileId, startDate, endDate);
        setDailyChangesData(dailyChange);
        setEngagementTotal(totalEngagements(dailyChange));
        setEngagementTotalChangeData(getEngagementTotalChangeData(dailyChange||[]));
        let posts = await fetchPostDetails(profileId, startDate, endDate);
        setPost(posts);//console.log(posts);
        setLoading(false);
      })()
    }
    
  }

  return (
    <div className="page_content">
      <Navbar />
      <div className="py-1 mt-2 md:mt-12 xl:mt-12 md:px-4 xl:px-4">
        <CurrentViewingText profileData={profileData} />
        { loading && loadingIcon}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-3 xl:gap-32">   
          <RevenueCard
            title="Total Revenue"
            cardCollor="yellow"
            count={(engagementTotalChangeData.totalRevenueCountChange).toFixed(2)} icon="currency"
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
        <div className="flex leading-9 mt-12">
          <h1 className="text-2xl font-bold flex-grow">Engagement By Time</h1>
          <div className="flex-grow-0">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              customInput={<CalendarCustomInput />}
              className="text-sm border border-gray-200 rounded-md w-[200px]"
              onChange={(update) => {
                changeDateRange(update);
              }}
            />
          </div>
        </div>
        <div>
          <ResponsiveChart>
            {({width, height}) => (
              <DailyChangesXYChart
                width={width}
                height={height}
                data={[
                  {
                    title: 'Engagement',
                    data: (dailyChangesData||[]).map((d) => ({ date: d.blockDate, value: d.engagementScoreChange }))
                  }
                ]}
              />
            )}
          </ResponsiveChart>
        </div>
        <div className="border rounded-md border-gray-200 p-2 bg-white">
          <div className="flex leading-9">
            <div className="flex-grow">Your publications earned <span className="font-bold">{engagementTotal} Engagements</span> over <span className="font-bold">{dayCount} days</span></div>
          </div>
          <div>
            <ResponsiveChart>
              {({width, height}) => (
                <DailyChangesXYBarChart
                  width={width}
                  height={height}
                  data={[
                    {
                      title: 'Post',
                      data: (dailyChangesData||[]).map((d) => ({ date: d.blockDate, value: d.publicationPostCountChange }))
                    },
                    {
                      title: 'Followers',
                      data: (dailyChangesData||[]).map((d) => ({ date: d.blockDate, value: d.followerCountChange }))
                    },
                    {
                      title: 'Comments',
                      data: (dailyChangesData||[]).map((d) => ({ date: d.blockDate, value: d.publicationCommentCountChange }))
                    },
                    {
                      title: 'Commented',
                      data: (dailyChangesData||[]).map((d) => ({ date: d.blockDate, value: d.commentedCountChange }))
                    },
                    {
                      title: 'Mirrors',
                      data: (dailyChangesData||[]).map((d) => ({ date: d.blockDate, value: d.publicationMirrorCountChange }))
                    },
                    {
                      title: 'Mirrored',
                      data: (dailyChangesData||[]).map((d) => ({ date: d.blockDate, value: d.mirroredCountChange }))
                    },
                    {
                      title: 'Collect',
                      data: (dailyChangesData||[]).map((d) => ({ date: d.blockDate, value: d.collectCountChange }))
                    },
                    {
                      title: 'Collected',
                      data: (dailyChangesData||[]).map((d) => ({ date: d.blockDate, value: d.collectedCountChange }))
                    }
                  ]}
                />
              )}
            </ResponsiveChart>
          </div>
        </div>
        <div className="mt-12 flex flex-col-reverse md:grid md:grid-cols-3 xl:grid xl:grid-cols-3 gap-4">
          <div className="col-span-2 pb-8">
            <Tab.Group>
              <Tab.List className="w-full flex bg-white border rounded-md border-gray-200 mb-2 p-4">
                <div className="flex-grow">
                  <Tab as={Fragment}>
                  {({ selected }) => (
                    <button className={ selected ? 
                        'border-b-4 border-green-600 text-green-600 px-4' : 
                        'text-black px-4'
                      }
                    >Top Post</button>
                  )}
                  </Tab>
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
                  <>
                    {Object.keys(posts.topEngagementPosts).map((k) => (
                      <Post key={`topCollectedPost${k}`} data={posts.topEngagementPosts[k]}/>
                    ))}
                    {!Object.keys(posts.topEngagementPosts).length && (
                      <Post key="topCollectedPost0" data={{}}/>
                    )}
                  </>
                </Tab.Panel>
                <Tab.Panel>
                  <>
                    {Object.keys(posts.topCollectedPosts).map((k) => (
                      <Post key={`topCollectedPost${k}`} data={posts.topCollectedPosts[k]}/>
                    ))}
                    {!Object.keys(posts.topCollectedPosts).length && (
                      <Post key="topCollectedPost0" data={{}}/>
                    )}
                  </>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
          <div className="col-span-1 h-full">
            <div className="md:h-full xl:h-full md:pl-5 xl:pl-5 ml-1 md:border-l-2 md:border-dashed md:pb-8 xl:border-l-2 xl:border-dashed xl:pb-8">
              <h3 className="font-semibold mb-4">Analytics</h3>
              <AnalyticsChart data={[
                      {
                        title: 'Publication',
                        data: (dailyChangesData||[]).map((d) => ({ date: d.blockDate, value: d.publicationCountChange }))
                      }
                    ]}
                    bgCollor={'bg-yellow-50'}
                    barChartColor={'orange'}
                    title={'Publication'}
                    titleHint={"Count of new post published in current time period."}
                    dayCount={dayCount}
                    count={posts.statistics?.publicationCount ?? 0}>
              </AnalyticsChart>
              <AnalyticsChart data={[
                      {
                        title: 'Comments',
                        data: (dailyChangesData||[]).map((d) => ({ date: d.blockDate, value: d.commentedCountChange }))
                      }
                    ]}
                    bgCollor={'bg-blue-50'}
                    barChartColor={'cornflowerblue'}
                    title={'Comments'}
                    titleHint={"Count of new comments published in current time period."}
                    dayCount={dayCount}
                    count={posts.statistics?.commentedCount ?? 0}>
              </AnalyticsChart>
              <AnalyticsChart data={[
                      {
                        title: 'Mirrors',
                        data: (dailyChangesData||[]).map((d) => ({ date: d.blockDate, value: d.mirroredCountChange }))
                      }
                    ]}
                    bgCollor={'bg-pink-100'}
                    barChartColor={'coral'}
                    title={'Mirrors'}
                    titleHint= {"Count of new mirrors created in current time period."}
                    dayCount={dayCount}
                    count={posts.statistics?.mirroredCount ?? 0}>
              </AnalyticsChart>
              <AnalyticsChart data={[
                      {
                        title: 'Collects',
                        data: (dailyChangesData||[]).map((d) => ({ date: d.blockDate, value: d.collectedCountChange }))
                      }
                    ]}
                    bgCollor={'bg-indigo-50'}
                    barChartColor={'darkcyan'}
                    title={'Collects'}
                    titleHint={"Summary of collected times for all publications in current time perod."}
                    dayCount={dayCount}
                    count={posts.statistics?.collectedCount ?? 0}>
              </AnalyticsChart>
            </div>
          </div>
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
  const pageTitle = 'Lentics - Publication';
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

  const publicationData = await fetchPublicationData(profileId, startDate, endDate);

  const posts = await fetchPostDetails(profileId, startDate, endDate);
 
  return {
    props: {
      pageTitle: pageTitle,
      initSession: await getSession(context),
      dailyChanges: publicationData,
      postsData: posts,
      profileData: profileData.Profile,
      profileId: profileData.Profile?.profile?.profileId,
      error: publicationData ? null : "The current profile doesn't have any activity in the period."
    },
  }
}
