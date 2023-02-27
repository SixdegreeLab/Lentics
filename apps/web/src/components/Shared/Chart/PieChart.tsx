/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import Pie, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie';
//import { Scale } from 'visx';
import { Group } from '@visx/group';
import { animated, useTransition, interpolate } from '@react-spring/web';

//const { scaleOrdinal } = Scale;

export type PieData = {
  symbol: string;
  count: number;
  fill: string;
};


// accessor functions
const getPieData = (d: PieData) => d.count;

const defaultMargin = { top: 0, right: 0, bottom: 0, left: 0 };

export type PieProps = {
  chartData: any;
  width: number;
  height: number;
  margin?: typeof defaultMargin;
  animate?: boolean;
};

export default function PieChart({
  chartData,
  width,
  height,
  margin = defaultMargin,
  animate = false,
}: PieProps) {

  //if (width < 10) return null;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const svgWidth = Math.min(width,height);
  const centerY = svgWidth / 2;
  const centerX = svgWidth / 2;
  const donutThickness = 0;
  //console.log(centerY + margin.top,centerX + margin.left);

  return (
    <svg width={svgWidth} height={svgWidth} className="inline">
      <Group top={centerY + margin.top} left={centerX + margin.left}>
        <Pie
          data={chartData}
          pieValue={getPieData}
          pieSortValues={() => -1}
          outerRadius={radius - donutThickness * 1.3}
        >
          {(pie) => (
            <AnimatedPie<PieData>
              {...pie}
              animate={animate}
              getKey={({ data: { symbol } }) => symbol}
              onClickDatum={({ data: { symbol } }) =>
                animate
              }
              getColor={({ data: { fill } }) => fill}
            />
          )}
        </Pie>
      </Group>
    </svg>
  );
}

// react-spring transition definitions
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number };

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean;
  getKey: (d: PieArcDatum<Datum>) => string;
  getColor: (d: PieArcDatum<Datum>) => string;
  onClickDatum: (d: PieArcDatum<Datum>) => void;
  delay?: number;
};

function AnimatedPie<Datum>({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
}: AnimatedPieProps<Datum>) {
  const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  });
  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

    return (
      <g key={key}>
        <animated.path
          // compute interpolated path d attribute from intermediate angle values
          d={interpolate([props.startAngle, props.endAngle], (startAngle, endAngle) =>
            path({
              ...arc,
              startAngle,
              endAngle,
            }),
          )}
          fill={getColor(arc)}
          onClick={() => onClickDatum(arc)}
          onTouchStart={() => onClickDatum(arc)}
        />
      </g>
    );
  });
}
