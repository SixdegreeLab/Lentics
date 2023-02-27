import React from 'react';
import ResponsiveChart from '@components/Shared/Chart/ResponsiveChart';
import DailyPublicationBarChart from '@components/Shared/Chart/DailyPublicationBarChart';
import SummaryModalTip from '@components/Shared/Summary/SummaryModalTip';

export type AnalyticsChartProps = {
  title: string;
  titleHint: string;
  dayCount:number;
  count: number
  bgCollor?: string;
  barChartColor?: string;
  children?: React.ReactNode
  data: any;
}

export default ({ data, title, dayCount, count, titleHint, barChartColor='orange',
                  bgCollor='bg-yellow-50' }: AnalyticsChartProps) => {
  let avagCount = (count / dayCount).toFixed(1);

  return (
    <div className={`border rounded-lg ${bgCollor} p-3 border-blue-300 mt-4`}>
      <div className="text-sm font-medium">
        <div className="flex justify-between">
        <h2>{title}</h2>
        <div className="text-gray-500">
          <SummaryModalTip title={ title }>
            {titleHint}
          </SummaryModalTip>
        </div>
        </div>
        <h2 className="pl-1">{count}</h2>
      </div>
      <div className="">
        { data.length && (
          <>
            <ResponsiveChart min_height="min-h-[80px]">
              {({width, height}) => (
                <DailyPublicationBarChart
                  width={width}
                  height={height}
                  data={data}
                  barChartColor={barChartColor}
                />
              )}
            </ResponsiveChart>
          </>
        )}

        { !(data.length) && (
          <div className="italic font-light text-right py-6">No Data!</div>
        )}
      </div>
      <div className="text-gray-500 text-xs text-center">{`On average, you earned ${avagCount} ${title} per day`}</div>
    </div>
  )
}
