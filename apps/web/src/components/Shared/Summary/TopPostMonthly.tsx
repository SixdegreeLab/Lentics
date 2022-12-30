import React from 'react';
import IconCloud from '@components/Shared/Icon/Cloud';
import IconSpin from '@components/Shared/Spin';
import SummaryMonthlyStats, { MonthlyData } from '@components/Shared/Summary/SummaryMonthlyStats';
import TopPost from '@components/Shared/Summary/TopPost';
import { IPFS_GATEWAY } from 'data';
import TopFollower from '@components/Shared/Summary/TopFollower';
import { ProfileTopFollowerData } from '../../../pages/overview/[address]';

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
export type TopPostMonthlyProps = {
  monthlyData: MonthlyData;
  publications: PublicationsData;
  profileTopFollower: ProfileTopFollowerData | null;
  followers: FollowersData;
  loading: boolean;
}

const getPostByProfileIdAndPubId = (profileId, pubId, posts={}): LensPublication => (
  posts[`0x0${(profileId || 0).toString(16)}-0x0${(pubId || 0).toString(16)}`] || {}
)

const getPostImage = (post: any={}): string => {
  let image = post?.metadata?.image || '';
  if (image && image.includes('ipfs://')) {
    image = `${IPFS_GATEWAY}${image.split('/').pop()}`;
  }
  return image;
}

const getFollowerByHandle = (handle, followers={}): LensFollower => (
  followers[handle] || null
)

const TopPostMonthly: React.FC<TopPostMonthlyProps> = ({
                                                         monthlyData,
                                                         publications,
                                                         profileTopFollower,
                                                         followers,
                                                         loading }) => {
  monthlyData = monthlyData || {};
  const topEngagementPost = getPostByProfileIdAndPubId(
    monthlyData?.profileId,
    monthlyData?.topEngagementPostId,
    publications);
  const topCommentedPost = getPostByProfileIdAndPubId(
    monthlyData?.profileId,
    monthlyData?.topCommentedPostId,
    publications);
  const topMirroredPost = getPostByProfileIdAndPubId(
    monthlyData?.profileId,
    monthlyData?.topMirroredPostId,
    publications);
  const topCollectedPost = getPostByProfileIdAndPubId(
    monthlyData?.profileId,
    monthlyData?.topCollectedPostId,
    publications);
  const noDataIcon = (
    <div className="h-full flex flex-col justify-center items-center">
      <IconCloud className="w-8 h-8" />
      <span>No Data</span>
    </div>
  );
  const loadingIcon = (
    <div className="h-full flex justify-center items-center">
      <IconSpin className="w-8 h-8" />
    </div>
  )
  return (
    <>
      <SummaryMonthlyStats monthlyData={monthlyData} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 overview-summary-top">
        <TopPost
          title="Top engagement post"
          publication={topEngagementPost}
        >
          {
            loading ? loadingIcon : (topEngagementPost?.metadata?.description ?? noDataIcon)
          }
        </TopPost>
        <TopFollower
          profileTopFollower={profileTopFollower}
          follower={getFollowerByHandle(profileTopFollower?.followerProfileHandle, followers)}
          loading={loading}
        />
        <TopPost
          title="Top commented"
          publication={topCommentedPost}
        >
          {
            loading ? loadingIcon : (topCommentedPost?.metadata?.description ? (
              <div className="flex space-x-4">
                <div className="w-2/5">
                  <img
                    className="max-w-full"
                    src={getPostImage(topCommentedPost)}
                    alt="icon" />
                </div>
                <div className="w-3/5 overflow-hidden">
                  {topCommentedPost?.metadata?.description}
                </div>
              </div>
            ) : noDataIcon)
          }
        </TopPost>
        <TopPost
          title="Top mirrorred"
          publication={topMirroredPost}
        >
          {
            loading ? loadingIcon : (topMirroredPost?.metadata?.description ? (
              <div className="flex space-x-4">
                <div className="w-2/5">
                  <img
                    className="max-w-full"
                    src={getPostImage(topMirroredPost)}
                    alt="icon" />
                </div>
                <div className="w-3/5 overflow-hidden">
                  {topMirroredPost?.metadata?.description}
                </div>
              </div>
            ) : noDataIcon)
          }
        </TopPost>
        <TopPost
          title="Top collected"
          publication={topCollectedPost}
        >
          {
            loading ? loadingIcon : (topCollectedPost?.metadata?.description ? (
              <div className="flex space-x-4">
                <div className="w-2/5">
                  <img
                    className="max-w-full"
                    src={getPostImage(topCollectedPost)}
                    alt="icon" />
                </div>
                <div className="w-3/5 overflow-hidden">
                  {topCollectedPost?.metadata?.description}
                </div>
              </div>
            ) : noDataIcon)
          }
        </TopPost>
      </div>
    </>
  )
}

export default TopPostMonthly;
