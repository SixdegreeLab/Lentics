
import React, { useState } from 'react';
import IconSpin from '@components/Shared/Spin';
import { useRouter } from 'next/router';
import moment from 'moment';

import client from '../../../apollo';
import {
  MonthlyStatisticsQuery,
  ProfileTopFollowerQuery,
} from '@lib/apiGraphql';

import TopPostMonthly from '@components/Shared/Summary/TopPostMonthly';
import {
  SquaresPlusIcon
} from '@heroicons/react/24/outline';
//import { DEMO_USER_ADDRESS } from 'data/constants';
import { currentDate } from '../../../pages/overview/[address]';

export type MoreTopPostMonthlyProps = {
  profileId: string | number;
  fetchPublicationFn: any;
  fetchProfileFn: any;
}

const MoreTopPostMonthly: React.FC<MoreTopPostMonthlyProps> = ({
                                                         profileId,
                                                         fetchPublicationFn,
                                                         fetchProfileFn }) => {

  const [loading, setLoading] = useState(false);
  const [monthDis, setMonthDis] = useState(2);
  let initMoreData: any[] = [];
  const [moreData, setMoreData] = useState(initMoreData);

  const loadingIcon = (
    <div className="h-full flex justify-center items-center">
      <IconSpin className="w-8 h-8" />
    </div>
  );
 
  const loadMore = () => {
    setLoading(true);
    setMonthDis((prevMonthDis) => {
      return prevMonthDis + 1;
    });

    (async () => {
      let month = moment(currentDate).subtract(monthDis, 'months').format('YYYY-MM-DD');
      let { data: moreMonthlyData }: any = await client.query({
        query: MonthlyStatisticsQuery,
        variables: {
          profileId: Number(profileId),
          startDate: moment(month).startOf('month').format('YYYY-MM-DD'),
          endDate: moment(month).add(1, 'months').startOf('month').format('YYYY-MM-DD')
        }
      });

      let { data: moreProfileTopFollower }: any = await client.query({
        query: ProfileTopFollowerQuery,
        variables: {
          profileId: Number(profileId),
          startDate: moment(month).startOf('month').format('YYYY-MM-DD'),
          endDate: moment(month).add(1, 'months').startOf('month').format('YYYY-MM-DD')
        }
      });

      let posts = await fetchPublicationFn(moreMonthlyData.MonthlyStatistics, null);
      let followers = await fetchProfileFn(moreProfileTopFollower?.ProfileTopFollower, null);

      setMoreData((prevMoreData) => {
        prevMoreData.push({moreMonthlyData: moreMonthlyData, moreProfileTopFollower: moreProfileTopFollower?.ProfileTopFollower, monthDis: monthDis, publications: posts, followers: followers});
        return prevMoreData;
      });

      setLoading(false);
    })()
  }

  return (
    <>
      {moreData.map((item, i) => (
        <div className="mt-12" key={i}>
          <div className="flex leading-9 space-x-2 mb-8 border-b-4 border-green-400">
            <h4 className="inline text-2xl font-bold">{moment(currentDate).subtract(item.monthDis, 'months').format('MMM YYYY')}</h4>
          </div>
          <TopPostMonthly
            monthlyData={item.moreMonthlyData}
            publications={item.publications}
            loading={false}
            profileTopFollower={item.moreProfileTopFollower}
            followers={item.followers}
          />
        </div>
      ))}
      <div onClick={ loadMore } className="mt-12 mb-12 cursor-pointer flex-auto space-x-2 text-center text-purple-600">
        <SquaresPlusIcon className="inline w-6 h-6"/>
        <span>Load More </span>
        {
          loading ? loadingIcon : ''
        }
      </div>
    </>
  )
}

export default MoreTopPostMonthly;
