import React, { useContext, useEffect, useState } from 'react';
import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedBarSeries,
  XYChart,
  Tooltip,
  DataProvider,
  DataContext,
  AnimatedBarStack
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

export type Charts = {
  [key: string]: Lines[];
};

export type XYBarChartProps = {
  width: number;
  height: number;
  data: any;
};

const DEFAULT_MARGIN = { top: 50, right: 50, bottom: 50, left: 50 };

const CustomXYBarChart = (props: XYBarChartProps) => {
  let { width, height, data } = props
  let [numTicks, setNumTicks] = useState<number | undefined>(undefined);
  let [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice(('ontouchstart' in window));
    if (width < 450) {
      setNumTicks(2)
    } else if (width < 640) {
      setNumTicks(4)
    } else if (width < 940) {
      setNumTicks(5)
    } else {
      setNumTicks(undefined)
    }
  }, [width])

  let xScaleConfig: any = { type: 'band', paddingInner: 0.3 };
  let yScaleConfig: any = { type: 'linear' };
  const contextValue: any = useContext(DataContext);

  const colorAccessorFactoryForBar = (dataKey) => (() => (
    contextValue?.colorScale?.(dataKey)
  ));

  return (
    <XYChart width={width} height={height} xScale={{ type: 'band', paddingInner: 0.3 }} yScale={{ type: 'linear' }}>
      <DataProvider
        xScale={xScaleConfig}
        yScale={yScaleConfig}
        initialDimensions={{ width, height, margin: DEFAULT_MARGIN }}>
        <AnimatedAxis orientation="bottom" numTicks={numTicks}/>
        <AnimatedAxis orientation="left" numTicks={numTicks}/>
        <AnimatedBarStack>
          {
            (data ?? []).map((line) => (
              <AnimatedBarSeries
                key={`Bar ${line.title}`}
                dataKey={`${line.title}`}
                data={line.data}
                colorAccessor={colorAccessorFactoryForBar(line.title)}
                {...accessors} />
            ))
          }
        </AnimatedBarStack>
      </DataProvider>
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
                      background: colorScale?.(k),
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

export default function DailyChangesXYBarChart(props: XYBarChartProps) {
  let { width, height } = props
  let xScale: any = { type: 'band', paddingInner: 0.3 };
  let yScale: any = { type: 'linear' };

  return (
    <DataProvider
      xScale={xScale}
      yScale={yScale}
      initialDimensions={{ width, height, margin: DEFAULT_MARGIN }}>
      <CustomXYBarChart {...props}/>
    </DataProvider>
  );
}
