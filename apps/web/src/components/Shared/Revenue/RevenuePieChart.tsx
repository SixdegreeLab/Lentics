
import ResponsiveChart from '@components/Shared/Chart/ResponsiveChart';
import PieChart from '@components/Shared/Chart/PieChart';

export type RevenueAmountToken = {
  symbol: string;
  paidAmountUsd: number;
  fill?: string;
  count?: number;
}

export type RevenueSummaryData = {
  supporterCount: number;
  paidAmountUsd: number;
  revenueAmountByToken: RevenueAmountToken[];
}

export type RevenuePieChartProps = {
  title: string;
  cardCollor?: string;
  revenueSummary: RevenueSummaryData;
}

export default ({ revenueSummary, title,
                  cardCollor='yellow' }: RevenuePieChartProps) => {
  const colorVariants = {
    green: {
      border: 'border-green-300',
      bg50: 'bg-green-50',
      bg600: 'bg-green-600',
      text: 'text-green-600'
    },
    red: {
      border: 'border-red-300',
      bg50: 'bg-red-50',
      bg600: 'bg-red-600',
      text: 'text-red-600'
    },
    yellow: {
      border: 'border-yellow-300',
      bg50: 'bg-yellow-50',
      bg600: 'bg-yellow-600',
      text: 'text-yellow-600'
    },
  };
  //test data
  /*if(!revenueSummary){
    revenueSummary = {
      supporterCount: 80,
      paidAmountUsd: 100,
      revenueAmountByToken: [
        {
          symbol: 'USDT',
          paidAmountUsd: 30
        },
        {
          symbol: 'WETH',
          paidAmountUsd: 60
        },
        {
          symbol: 'MATIC',
          paidAmountUsd: 10
        },
      ]
    }
  }*/
  const chartColor = ['green', 'orange', 'blue', 'pink', 'yellow', 'purple'];
  const labelColor = ['bg-[green]', 'bg-[orange]', 'bg-[blue]', 'bg-[pink]', 'bg-[yellow]', 'bg-[purple]'];
  let pieData: RevenueAmountToken[] = [];
  if(revenueSummary?.revenueAmountByToken.length){
    (revenueSummary.revenueAmountByToken).forEach(function(item, index){  
      pieData.push({
        symbol: item.symbol,
        paidAmountUsd: item.paidAmountUsd,
        fill: chartColor[index % 6],
        count: item.paidAmountUsd / revenueSummary.paidAmountUsd
      });
    });
  }
  return (
    <div className={`h-full border rounded-lg ${colorVariants[cardCollor].bg50} p-3 ${colorVariants[cardCollor].border}`}>
      <div className="text-md font-bold">{title}</div>
      <div className="grid grid-cols-2 gap-2">
        { revenueSummary?.revenueAmountByToken && (
          <>
            <ResponsiveChart min_height="min-h-[90px]">
              {({width, height}) => (
                <div className="text-right">
                  <PieChart
                    chartData={pieData}
                    width={width}
                    height={height}
                  />
                </div>
              )}
            </ResponsiveChart>
            <div className="grid grid-cols-1 text-xs place-content-center">
              {(revenueSummary?.revenueAmountByToken ?? []).map((item, i) => (
                <div className="flex-1" key={i}>
                  <div className={`inline-block rounded-full w-[12px] h-[12px] ${labelColor[i]}`}></div>
                  <div className="inline-block align-top uppercase pl-1">{item.symbol}</div>
                </div>
              ))}
            </div>
          </>
        )}

        { !(revenueSummary?.revenueAmountByToken) && (
          <div className="italic font-light text-right py-6">No Data!</div>
        )}
      </div>
    </div>
  )
}
