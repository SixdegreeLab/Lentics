import React from 'react';
import {
  ArrowsRightLeftIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  ViewColumnsIcon
} from '@heroicons/react/24/outline';
import { LensPublication } from '@components/Shared/Summary/TopPostMonthly';
import Image from 'next/image'
import LensterLogo from '../../../../public/icon.svg';

export type TopPostProps = {
  children?: React.ReactNode
  title: string;
  subTitle?: string;
  publication: LensPublication;
}

const TopPost = ({ children, title, subTitle='', publication }: TopPostProps) => {
  const {
    totalAmountOfComments = 0,
    totalAmountOfMirrors = 0,
    totalUpvotes = 0,
    totalAmountOfCollects = 0
  } = publication.stats || {};
  return (
    <div className="overview-summary-top-container">
      <div className="overview-summary-top-item h-full flex flex-col">
        <div className="flex title space-x-5 leading-7">
          <h5 className="flex-grow">{title}</h5>
          <span className="text-sm text-gray-500 leading-7">{subTitle}</span>
          { publication.stats && (
            <a href={`https://lenster.xyz/posts/${publication.id}`} target="_blank" className="link">
              <Image
                className="w-5 h-5 inline"
                src={LensterLogo}
                height={30}
                alt="Lenster Publication"
                priority/>
            </a>
          )}
        </div>
        <div className="px-3 py-6 flex-1">
          {children}
        </div>
        <div className="post-bottom flex font-black py-4">
          <div className="flex-auto space-x-2 text-center text-blue-600">
            <ChatBubbleLeftRightIcon className="inline w-6 h-6"/>
            <span>{totalAmountOfComments}</span>
          </div>
          <div className="flex-auto space-x-2 text-center text-purple-600">
            <ArrowsRightLeftIcon className="inline w-6 h-6"/>
            <span>{totalAmountOfMirrors}</span>
          </div>
          <div className="flex-auto space-x-2 text-center text-pink-600">
            <StarIcon className="inline w-6 h-6"/>
            <span>{totalUpvotes}</span>
          </div>
          <div className="flex-auto space-x-2 text-center text-red-600">
            <ViewColumnsIcon className="inline w-6 h-6"/>
            <span>{totalAmountOfCollects}</span>
          </div>
        </div>
      </div>
    </div>
  )
};

export default TopPost;
