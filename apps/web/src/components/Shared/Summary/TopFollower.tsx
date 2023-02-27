import React from 'react';
import { LensFollower } from '@components/Shared/Summary/TopPostMonthly';
import { ProfileTopFollowerData } from '../../../pages/overview/[address]';
import getAttribute from '@lib/getAttribute';
import IconCloud from '@components/Shared/Icon/Cloud';
import IconSpin from '@components/Shared/Spin';
import { getIPFSLink } from 'data';
import Image from 'next/image'
import LensterLogo from '../../../../public/icon.svg';

export type TopFollowerProps = {
  profileTopFollower: ProfileTopFollowerData | null;
  follower: LensFollower;
  loading?: boolean;
}

const TopFollower: React.FC<TopFollowerProps> = ({ profileTopFollower, follower, loading=false }) => {
  const noDataIcon = (
    <div className="min-h-56 flex flex-col justify-center items-center">
      <IconCloud className="w-8 h-8" />
      <span>No Data</span>
    </div>
  );
  const loadingIcon = (
    <div className="min-h-56 flex justify-center items-center">
      <IconSpin className="w-8 h-8" />
    </div>
  )
  const followerAvatar = follower
    ? getIPFSLink(
      follower?.picture?.original?.url ??
      follower?.picture?.uri ??
      `https://avatar.tobi.sh/${follower?.ownedBy}_${follower?.handle}.png`
    )
    : '';
  return (
    <div className="overview-summary-top-container">
      <div className="overview-summary-top-item h-full">
        <div className="flex title space-x-2 leading-7">
          <h5 className="flex-grow">Top follower</h5>
          { follower && (
            <a href={`https://lenster.xyz/u/${follower?.handle}`} target="_blank" className="link">
              <Image
                className="w-5 h-5 inline"
                src={LensterLogo}
                height={30}
                alt="Lenster User"
                priority/>
            </a>
          )}
        </div>
        {
          loading ? loadingIcon : (
            !follower ? noDataIcon : (
              <>
                <div className="flex flex-col space-y-3 p-3 pb-0 min-h-56">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex flex-1 gap-4">
                      <div className="w-14 xl:w-20">
                        {followerAvatar && (
                          <img className="max-w-full max-h-full rounded-full" src={followerAvatar} alt="Avatar" />
                        )}
                        {!followerAvatar && (
                          <img className="max-w-full max-h-full rounded-full" src='/avatar.jpg' alt="Avatar" />
                        )}
                      </div>
                      <div className="flex flex-col space-y-1 min-w-min">
                        <h5>{follower?.name}</h5>
                        <div className="text-xs text-gray-500">@{follower?.handle}</div>
                        {
                          getAttribute(follower?.attributes, 'statusEmoji')
                          && getAttribute(follower?.attributes, 'statusMessage') && (
                            <div className="px-2 py-1 bg-green-100 text-xs text-green-500">
                              {getAttribute(follower?.attributes, 'statusEmoji')}
                              {getAttribute(follower?.attributes, 'statusMessage')}
                            </div>
                          )
                        }
                      </div>
                    </div>
                    <div>
                      <h5 className="flex gap-1">
                        <span className="min-w-[85px]">Follower</span>
                        <span className="text-green-400 mr-1">{follower?.stats?.totalFollowers ?? 0}</span>
                      </h5>
                      <h5 className="flex gap-1">
                        <span className="min-w-[85px]">Following</span>
                        <span className="text-green-400 mr-1">{follower?.stats?.totalFollowing ?? 0}</span>
                      </h5>
                    </div>
                  </div>
                  {
                    follower?.bio && (
                      <div className="text-sm">
                        <div className="font-bold">Bio</div>
                        <p>{follower.bio}</p>
                      </div>
                    )
                  }
                </div>
                <div className="flex gap-3 items-stretch p-3">
                  <span className="text-lg font-bold leading-9">Links</span>
                  <div className="flex flex-wrap gap-3 items-stretch justify-center">
                    {
                      getAttribute(follower?.attributes, 'website') && (
                        <a
                          className="grid grid-flow-col auto-cols-max gap-1 sm:gap-2 justify-center text-sm leading-6 hover:text-current block py-1 px-2"
                          href={`https://${getAttribute(follower?.attributes, 'website')
                            ?.replace('https://', '')
                            .replace('http://', '')}`}
                          target="_blank"
                          rel="noreferrer noopener me"
                        >
                          <img
                            src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=https://${getAttribute(
                              follower?.attributes,
                              'website'
                            )
                              ?.replace('https://', '')
                              .replace('http://', '')}`}
                            className="w-6 h-6"
                            alt="Website"
                          />
                        </a>
                      )
                    }

                    {
                      getAttribute(follower?.attributes, 'twitter') && (
                        <a
                          className="grid grid-flow-col auto-cols-max gap-1 sm:gap-2 justify-center text-sm leading-6 hover:text-current block py-1 px-2"
                          href={`https://twitter.com/${getAttribute(follower?.attributes, 'twitter')}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <img
                            src="/twitter-dark.svg"
                            className="w-6 h-6"
                            alt="Twitter Logo"
                          />
                        </a>
                      )
                    }
                  </div>
                </div>
              </>
            )
          )
        }
      </div>
    </div>
  )
};

export default TopFollower;
