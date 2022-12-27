import ParentSize from '@visx/responsive/lib/components/ParentSize';
import InfoCircle from '@components/Shared/Icon/InfoCircle';
import CurveLinearClosed, { CurveData } from '@components/Shared/Chart/DailyChangesLinear';
import ArrowSmallUp from '@components/Shared/Icon/ArrowSmallUp';
import ArrowSmallDown from '@components/Shared/Icon/ArrowSmallDown';

export type SummaryCardProps = {
  title: string;
  count: number
  data: CurveData[];
  changePercent?: number;
  bgClass?: string;
  linearColor?: string;
  centralLineColor?: string
}

export default ({ title,
                  count,
                  data,
                  changePercent=0,
                  bgClass='bg-cyan-50',
                  linearColor='#22d3ee',
                  centralLineColor='#9ca3af' }: SummaryCardProps) => {
  let changePercentClassName = 'flex text-green-500 text-sm font-bold';
  if (changePercent < 0) {
    changePercentClassName = 'flex text-red-500 text-sm font-bold'
  }
  return (
    <div className={`border rounded-lg border-cyan-200 p-3 ${bgClass}`}>
      <div className="flex justify-between">
        <span className="text-md font-bold">{title}</span>
        <span className="text-gray-500">
          <InfoCircle />
        </span>
      </div>
      <div className="flex h-24">
        <div className="w-1/3 h-full font-bold text-3xl overflow-hidden break-all leading-9 pt-6">
          { count ?? 0 }
        </div>
        <div className="w-2/3 h-full pt-10">
          <ParentSize>{({ width, height }) => (
            <CurveLinearClosed
              chartKey={title.toLowerCase()}
              data={data}
              width={width}
              height={height}
              color={linearColor}
              centralLineColor={centralLineColor} />
          )}</ParentSize>
        </div>
      </div>
      <div className={`${changePercentClassName} ${changePercent ? '' : 'hidden'}`}>
        {
          changePercent < 0 && (
            <ArrowSmallDown className="w-5 h-5 mr-2" />
          )
        }

        {
          changePercent > 0 && (
            <ArrowSmallUp className="w-5 h-5 mr-2" />
          )
        }
        <span>{Math.abs(changePercent).toFixed(2)}%</span>
      </div>
    </div>
  )
}
