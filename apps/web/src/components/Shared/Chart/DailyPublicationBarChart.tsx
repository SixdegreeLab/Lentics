import React, { useEffect, useState } from 'react';
import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedBarSeries,
  XYChart,
  Tooltip,
  AnimatedBarGroup
} from '@visx/xychart';


const accessors = {
  xAccessor: (d) => d.date,
  yAccessor: (d) => d.value,
};

export type LineSeriesData = {
  date: string;
  value: number;
}

export type Lines = {
  title: string;
  data: LineSeriesData[];
};

export type BarChartProps = {
  width: number;
  height: number;
  barChartColor: string;
  data: any;
};

const DEFAULT_MARGIN = { top: 2, right: 50, bottom: 20, left: 50 };

export default function DailyPublicationBarChart(props: BarChartProps) {
  let { width, height, data, barChartColor } = props
  let [numTicks, setNumTicks] = useState<number | undefined>(-1);
  useEffect(() => {
    if (width < 450) {
      setNumTicks(1)
    } else if (width < 640) {
      setNumTicks(4)
    } else if (width < 940) {
      setNumTicks(5)
    } else {
      setNumTicks(undefined)
    }
  }, [width])

  const colorAccessorFactoryForBar = () => (() => (
    barChartColor
  ));

  return (
    <XYChart width={width} height={height} margin={DEFAULT_MARGIN} xScale={{ type: 'band', paddingInner: 0.1 }} yScale={{ type: 'linear' }}>
      <AnimatedAxis orientation="bottom" numTicks={numTicks} hideTicks stroke={"rgb(156, 163, 175)"}/>
      <AnimatedBarGroup>
        {
          (data ?? []).map((line) => (
            <AnimatedBarSeries
              key={`Bar ${line.title}`}
              dataKey={`${line.title}`}
              data={line.data}
              colorAccessor={colorAccessorFactoryForBar()}
              {...accessors} />
          ))
        }
      </AnimatedBarGroup>
      <Tooltip
        showHorizontalCrosshair
        showVerticalCrosshair
        renderTooltip={({ tooltipData, colorScale }) => {
          return (
            <div className="text-sm font-light">
              <div className="mb-2">
                {accessors.xAccessor(tooltipData?.nearestDatum?.datum)}
              </div>
              {
                Object.keys(tooltipData?.datumByKey ?? {}).map((k) => (
                  <div className="lg:min-w-32 flex gap-4 justify-between leading-4" key={`Tool Tip ${k}`}>
                    <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 rounded-full" style={{
                      background: barChartColor,
                      textDecoration:
                        tooltipData?.nearestDatum?.key === k ? 'underline' : undefined,
                    }} />
                      {k}
                    </div>
                    <div className="font-medium">
                      {accessors.yAccessor(tooltipData?.datumByKey[k]?.datum)}
                    </div>
                  </div>
                ))
              }
            </div>
          )
        }}
      />
    </XYChart>
  );
}
