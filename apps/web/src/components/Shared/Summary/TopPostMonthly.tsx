import React, { useState } from 'react';
import IconCloud from '@components/Shared/Icon/Cloud';
import IconSpin from '@components/Shared/Spin';
import SummaryMonthlyStats, { MonthlyData } from '@components/Shared/Summary/SummaryMonthlyStats';
import TopPost from '@components/Shared/Summary/TopPost';
import { IPFS_GATEWAY } from 'data';
import TopFollower from '@components/Shared/Summary/TopFollower';
import { ProfileTopFollowerData } from '../../../pages/overview/[address]';
import { getHexLensPublicationIdWithBigNumber } from 'lens';
import Image from 'next/image'

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
export type LensProfileStats = {
  totalFollowers: number;
  totalFollowing: number;
}
export type LensFollower = {
  id: string;
  name: string | null;
  handle: string | null;
  ownedBy: string;
  bio: string | null;
  picture: LensProfileMedia
  attributes: LensAttribute[];
  stats: LensProfileStats;
}

export type LensStats = {
  totalAmountOfComments: number;
  totalAmountOfMirrors: number;
  totalUpvotes: number;
  totalAmountOfCollects: number;
}
export type LenMetaData = {
  description: string | null;
  content: string | null;
  image: string | null;
}
export type LensPublication = {
  id: string;
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

const getPostByProfileIdAndPubId = (profileId, pubId, posts={}): LensPublication => {
  const lensPublicationId = getHexLensPublicationIdWithBigNumber(profileId ?? 0, pubId ?? 0)
  return posts[lensPublicationId] ?? {}
}

const getPostImage = (post: any={}): string => {
  let image = ''
  let media: any = post?.metadata?.media[0];
  if (media) {
    let mimeType: any = media?.original?.mimeType?.split('/') || [];
    if (mimeType[0]?.toLowerCase() === 'image' && media?.original?.url) {
      image = media.original.url
    }
  }
  
  if (!image) {
    image = post?.metadata?.image ?? ''
  }

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
  
  const [errorImages, setErrorImages] = useState<string[]>([]);
  const handleImageError = (imgKey) => (() => {
    setErrorImages([...errorImages, imgKey])
  })
  return (
    <>
      <SummaryMonthlyStats monthlyData={monthlyData} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 overview-summary-top">
        <TopPost
          title="Top engagement post"
          publication={topEngagementPost}
        >
          <div className="line-clamp-10">
            {
              loading ? loadingIcon : (
                topEngagementPost?.metadata?.content ? (
                  <div className="whitespace-pre-line">
                    {topEngagementPost?.metadata?.content}
                  </div>
                ) : noDataIcon)
            }
          </div>
        </TopPost>
        {
          profileTopFollower && (
            <TopFollower
              profileTopFollower={profileTopFollower}
              follower={getFollowerByHandle(profileTopFollower?.followerProfileHandle, followers)}
              loading={loading}
            />
          )
        }
        <TopPost
          title="Top commented"
          publication={topCommentedPost}
        >
          {
            loading ? loadingIcon : (topCommentedPost?.metadata?.content ? (
              <div className="flex space-x-4 min-h-48">
                {
                  getPostImage(topCommentedPost) && !errorImages.includes(topCommentedPost.id) && (
                    <div className="w-2/5 relative">
                      <Image className="max-w-full object-scale-down object-top"
                             src={getPostImage(topCommentedPost)}
                             placeholder="blur"
                             blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkkI39DwACGgF7lpEkjAAAAABJRU5ErkJggg=="
                             fill
                             onError={handleImageError(topCommentedPost.id)}
                             alt={getPostImage(topCommentedPost)}
                             priority/>
                    </div>
                  )
                }
                <div className={getPostImage(topCommentedPost) && !errorImages.includes(topCommentedPost.id) ? `w-3/5` : 'w-full'}>
                  <div className="line-clamp-10 whitespace-pre-line">
                    {topCommentedPost?.metadata?.content}
                  </div>
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
            loading ? loadingIcon : (topMirroredPost?.metadata?.content ? (
              <div className="flex space-x-4 min-h-48">
                {
                  getPostImage(topMirroredPost) && !errorImages.includes(topMirroredPost.id) && (
                    <div className="w-2/5 relative">
                      <Image className="max-w-full object-scale-down object-top"
                             src={getPostImage(topMirroredPost)}
                             placeholder="blur"
                             blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkkI39DwACGgF7lpEkjAAAAABJRU5ErkJggg=="
                             fill
                             onError={handleImageError(topMirroredPost.id)}
                             alt={getPostImage(topMirroredPost)}
                             priority/>
                    </div>
                  )
                }
                <div className={getPostImage(topMirroredPost) && !errorImages.includes(topMirroredPost.id) ? `w-3/5` : 'w-full'}>
                  <div className="line-clamp-10 whitespace-pre-line">
                    {topMirroredPost?.metadata?.content}
                  </div>
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
            loading ? loadingIcon : (topCollectedPost?.metadata?.content ? (
              <div className="flex space-x-4 min-h-48">
                {
                  getPostImage(topCollectedPost) && !errorImages.includes(topCollectedPost.id) && (
                    <div className="w-2/5 relative">
                      <Image className="max-w-full object-scale-down object-top"
                             src={getPostImage(topCollectedPost)}
                             placeholder="blur"
                             blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkkI39DwACGgF7lpEkjAAAAABJRU5ErkJggg=="
                             fill
                             onError={handleImageError(topCollectedPost.id)}
                             alt={getPostImage(topCollectedPost)}
                             priority/>
                    </div>
                  )
                }
                <div className={getPostImage(topCollectedPost) && !errorImages.includes(topCollectedPost.id) ? `w-3/5` : 'w-full'}>
                  <div className="line-clamp-10 whitespace-pre-line">
                    {topCollectedPost?.metadata?.content}
                  </div>
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
