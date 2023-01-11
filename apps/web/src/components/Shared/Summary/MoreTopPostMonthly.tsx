
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
import { DEMO_USER_ADDRESS } from 'data/constants';

export enum LensProfileMediaType {
  LensMediaSet = "MediaSet",
  LensNftImage = "NftImage",
}
export type LensMedia = {
  url: string;
}
export type LensProfileMedia = {
  __typename: LensProfileMediaType.LensNftImage | LensProfileMediaType.LensMediaSet;
  uri?: string; // nft image
  original?: LensMedia; // media set
}
export type LensAttribute = {
  displayType: string | null;
  traitType: string | null;
  key: string;
  value: string;
}
export type LensFollower = {
  id: string;
  name: string | null;
  handle: string | null;
  ownedBy: string;
  bio: string | null;
  picture: LensProfileMedia
  attributes: LensAttribute[];
}

export type LensStats = {
  totalAmountOfComments: number;
  totalAmountOfMirrors: number;
  totalUpvotes: number;
  totalAmountOfCollects: number;
}
export type LenMetaData = {
  description: string | null;
  image: string | null;
}
export type LensPublication = {
  stats: LensStats;
  metadata: LenMetaData;
  
}
export type PublicationsData = {
  [key: string]: LensPublication;
}
export type FollowersData = {
  [key: string]: LensFollower;
}
export type MoreTopPostMonthlyProps = {
  fetchPublicationFn: any;
  fetchProfileFn: any;
}

const MoreTopPostMonthly: React.FC<MoreTopPostMonthlyProps> = ({
                                                         fetchPublicationFn,
                                                         fetchProfileFn }) => {

  const [loading, setLoading] = useState(false);
  const [monthDis, setMonthDis] = useState(1);
  //const [moreMonthlyData, setMoreMonthlyData] = useState({});
  //const [moreProfileTopFollower, setMoreProfileTopFollower] = useState({});
  const [publications, setPublications] = useState({});
  const [followers, setFollowers] = useState({});
  let initMoreData: any[] = [];
  const [moreData, setMoreData] = useState(initMoreData);
  const { query } = useRouter();
  const address = query.address == null ? DEMO_USER_ADDRESS : query.address;
  const currentDate = '2022-12-01';

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
      let { data: moreMonthlyData }: any = await client.query({
        query: MonthlyStatisticsQuery,
        variables: { "address": address, date: moment(currentDate).subtract(monthDis, 'months').format('YYYY-MM-DD') }
      });
      //setMoreMonthlyData(moreMonthlyData);
    
      let { data: moreProfileTopFollower }: any = await client.query({
        query: ProfileTopFollowerQuery,
        variables: { "address": address, date: moment(currentDate).subtract(monthDis, 'months').format('YYYY-MM-DD') }
      });
      //setMoreProfileTopFollower(moreProfileTopFollower);

      setMoreData((prevMoreData) => {
        // TODO: 性能问题，先屏蔽
        //prevMoreData.push({"moreMonthlyData": moreMonthlyData, "moreProfileTopFollower": moreProfileTopFollower});
        prevMoreData.push({moreMonthlyData: moreMonthlyData, moreProfileTopFollower: null});
        return prevMoreData;
      });
      let posts = await fetchPublicationFn(moreMonthlyData, null);
      setPublications(posts);
      // TODO: 性能问题，先屏蔽
      //let followers = await fetchProfileFn(moreProfileTopFollower, null);
      //setFollowers(followers);
      //setFollowers({ ProfileTopFollower: null });

      setLoading(false);
    })()
  }

  return (
    <>
      {moreData.map((item, i) => (
        <div className="mt-12" key={i}>
          <div className="flex leading-9 space-x-2 mb-8 border-b-4 border-green-400">
            <h4 className="inline text-2xl font-bold">{moment(currentDate).subtract(monthDis, 'months').format('MMM YYYY')}</h4>
          </div>
          <TopPostMonthly
            monthlyData={item.moreMonthlyData}
            publications={publications}
            loading={false}
            profileTopFollower={item.moreProfileTopFollower}
            followers={followers}
          />
        </div>
      ))}
      <div onClick={ loadMore } className="mt-12 mb-12 cursor-pointer flex-auto space-x-2 text-center text-purple-600" title="Under Construction…">
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
