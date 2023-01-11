import React from 'react';
import { extent, max, min } from 'd3-array';
import { curveLinear } from '@visx/curve';
import { Group } from '@visx/group';
import { LinePath } from '@visx/shape';
import { Scale } from 'visx';
import { MarkerCircle, MarkerLine } from '@visx/marker';
import { DateValue } from '@visx/mock-data/lib/generators/genDateValue';

export type CurveData = {
  date: number; //timestamp
  value: number;
}

export type CurveProps = {
  chartKey: string;
  data: CurveData[];
  width: number;
  height: number;
  color?: string;
  centralLineColor?: string
};

const { scaleTime, scaleLinear } = Scale;

export default function DailyChangesLinear({ chartKey, data, width, height, color='#333', centralLineColor='#333' }: CurveProps) {

  // data accessors
  const getX = (d: CurveData) => d.date;
  const getY = (d: CurveData) => d.value;

  // scales
  const xScale = scaleTime<number>({
    domain: extent(data, getX) as [Date, Date],
  });
  const yScale = scaleLinear<number>({
    domain: [0, max(data, getY) as number],
  });

  const centralDomain = (min(data, getY) + max(data, getY))/2 as number;
  const centralYScale = scaleLinear<number>({
    domain: [centralDomain, centralDomain],
  });
  
  // update scale output ranges
  xScale.clamp(true).range([0, width - 26]);
  yScale.clamp(true).range([height - 7, 4]);

  centralYScale.range([height, 0]);

  return (
    <div className="visx-curves">
      <svg width={width} height={height}>
        <MarkerCircle id={`marker-circle-${chartKey}`} fill={color} size={1.5} refX={2} />
        <MarkerLine id={`marker-line-${chartKey}`} fill={color} size={16} strokeWidth={1} />
        {width > 8 && (
          (
            <>
              <Group key={`line-${chartKey}`} top={0} left={13}>
                <LinePath<CurveData>
                  curve={curveLinear}
                  data={data}
                  x={(d) => xScale(getX(d)) ?? 0}
                  y={(d) => yScale(getY(d)) ?? 0}
                  stroke={color}
                  strokeWidth={2}
                  strokeOpacity={1}
                  shapeRendering="geometricPrecision"
                  markerMid={`url(#marker-circle-${chartKey})`}
                  markerStart={`url(#marker-circle-${chartKey})`}
                  markerEnd={`url(#marker-circle-${chartKey})`}
                />
              </Group>
              {/*<Group key={`central-line-${chartKey}`} top={0} left={13}>
                <LinePath<CurveData>
                  curve={curveLinear}
                  data={data}
                  x={(d) => xScale(getX(d)) ?? 0}
                  y={(d) => centralYScale(getY(d)) ?? 0}
                  stroke={centralLineColor}
                  strokeWidth={2}
                  strokeOpacity={1}
                  shapeRendering="geometricPrecision"
                />
              </Group>*/}
            </>
          )
        )}
      </svg>
    </div>
  );
}
