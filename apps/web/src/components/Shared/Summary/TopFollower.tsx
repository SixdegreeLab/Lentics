import React from 'react';
import { LensFollower } from '@components/Shared/Summary/TopPostMonthly';
import { ProfileTopFollowerData } from '../../../pages/overview/[address]';
import getAttribute from '@lib/getAttribute';
import IconCloud from '@components/Shared/Icon/Cloud';
import IconSpin from '@components/Shared/Spin';
import { getAvatarFromLenster, getIPFSLink } from 'data';

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
    ? getAvatarFromLenster(getIPFSLink(
      follower?.picture?.original?.url ??
      follower?.picture?.uri ??
      `https://avatar.tobi.sh/${follower?.ownedBy}_${follower?.handle}.png`
    ))
    : '';
  return (
    <div className="overview-summary-top-container">
      <div className="overview-summary-top-item h-full">
        <div className="flex title space-x-2 leading-9">
          <h5>Top Followers</h5>
        </div>
        {
          loading ? loadingIcon : (
            !follower ? noDataIcon : (
              <>
                <div className="flex flex-col space-y-3 p-3 min-h-56">
                  <div className="flex gap-4">
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
                    <div className="break-all">
                      <h5>
                        <span className="text-green-400 mr-1">{profileTopFollower?.followerProfileFollowersCount ?? 0}</span>
                        Follower
                      </h5>
                      <h5>
                        <span className="text-green-400 mr-1">{profileTopFollower?.topFollowerFollowingCount ?? 0}</span>
                        Following
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
                <div className="flex flex-wrap gap-2 md:grid md:grid-flow-col md:auto-cols-max md:gap-8 items-stretch justify-center p-3">
                  {
                    getAttribute(follower?.attributes, 'website') && (
                      <a
                        className="grid grid-flow-col auto-cols-max gap-1 sm:gap-2 justify-center bg-green-200 text-sm leading-6 hover:text-current block py-1 px-2 sm:px-3"
                        href={`https://${getAttribute(follower?.attributes, 'website')
                          ?.replace('https://', '')
                          .replace('http://', '')}`}
                        target="_blank"
                        rel="noreferrer noopener me"
                      >
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${getAttribute(
                            follower?.attributes,
                            'website'
                          )
                            ?.replace('https://', '')
                            .replace('http://', '')}`}
                          className="w-6 h-6"
                          alt="Website"
                        />
                        <span>
                          {getAttribute(follower?.attributes, 'website')?.replace('https://', '').replace('http://', '')}
                        </span>
                      </a>
                    )
                  }

                  {
                    getAttribute(follower?.attributes, 'twitter') && (
                      <a
                        className="grid grid-flow-col auto-cols-max gap-1 sm:gap-2 justify-center bg-green-200 text-sm leading-6 hover:text-current block py-1 px-2 sm:px-3"
                        href={`https://twitter.com/${getAttribute(follower?.attributes, 'twitter')}`}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <img
                          src="/twitter-dark.svg"
                          className="w-6 h-6"
                          alt="Twitter Logo"
                        />
                        <span>
                          {getAttribute(follower?.attributes, 'twitter')?.replace('https://twitter.com/', '')}
                        </span>
                      </a>
                    )
                  }
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
