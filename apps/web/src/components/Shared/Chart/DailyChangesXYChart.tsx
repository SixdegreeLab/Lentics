import React, { useEffect, useState } from 'react';
import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  Tooltip
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

export type XYChartProps = {
  width: number;
  height: number;
  data: Lines[];
};

export default function DailyChangesXYChart({ width, height, data }: XYChartProps) {
  let [isTouchDevice, setIsTouchDevice] = useState(false);
  let [numTicks, setNumTicks] = useState<number | undefined>(undefined);
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
  return (
    <XYChart width={width} height={height} xScale={{ type: 'band', paddingInner: 0.3 }} yScale={{ type: 'linear' }}>
      <AnimatedAxis orientation="bottom" numTicks={numTicks}/>
      <AnimatedAxis orientation="left" numTicks={numTicks}/>
      <AnimatedGrid rows columns={false} numTicks={4} />
      {
        data.map((line) => (
          <AnimatedLineSeries key={`Line ${line.title}`} dataKey={`${line.title}`} data={line.data} {...accessors} />
        ))
      }
      <Tooltip
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs={!isTouchDevice}
        renderTooltip={({ tooltipData, colorScale }) => (
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
        )}
      />
    </XYChart>
  );
}
