import React from 'react';
import IconCloud from '@components/Shared/Icon/Cloud';

export type PostProps = {
  data: any;
}

const Post = ({ data }: PostProps) => {
  const noDataIcon = (
    <div className="h-full flex flex-col justify-center items-center">
      <IconCloud className="w-8 h-8" />
      <span>No Data</span>
    </div>
  );
  return (
    <div className="w-full flex flex-col md:flex-row xl:flex-row bg-white border rounded-md border-gray-200 mb-1 p-4">
      <div className="flex-1 text-sm pr-4">
      {
        data?.metadata?.content ? (
          <div>
            <a href={`https://lenster.xyz/posts/${data.id}`} target="_blank">
              {data?.metadata?.content}
            </a>
          </div>
        ) : noDataIcon
      }
      </div>
      <div className="flex-grow-0 mt-4 md:mt-0 xl:mt-0 text-center md:text-left xl:text-left flex w-full md:w-[300px] xl:w-[300px]">
        {/*<div className="flex-1">{data?.stats?.totalAmountOfEngagement ?? 0}</div>*/}
        <div className="flex-1"><div>{data?.stats?.totalAmountOfComments ?? 0}</div><div className="block md:hidden xl:hidden text-gray-400">comment</div></div>
        <div className="flex-1"><div>{data?.stats?.totalAmountOfMirrors ?? 0}</div><div className="block md:hidden xl:hidden text-gray-400">mirror</div></div>
        <div className="flex-1"><div>{data?.stats?.totalAmountOfCollects ?? 0}</div><div className="block md:hidden xl:hidden text-gray-400">collect</div></div>
      </div>
    </div>
  )
};

export default Post;
