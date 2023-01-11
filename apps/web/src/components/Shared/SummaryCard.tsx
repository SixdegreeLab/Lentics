import { useState } from "react";
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import InfoCircle from '@components/Shared/Icon/InfoCircle';
import CurveLinearClosed, { CurveData } from '@components/Shared/Chart/DailyChangesLinear';
import ArrowSmallUp from '@components/Shared/Icon/ArrowSmallUp';
import ArrowSmallDown from '@components/Shared/Icon/ArrowSmallDown';
import { Popover } from '@headlessui/react'
import { usePopper } from 'react-popper'
import Link from 'next/link';

const MyPopover = ({ children }) => {
  let [referenceElement, setReferenceElement]: any = useState(null);
  let [popperElement, setPopperElement]: any = useState(null);
  const [isShowing, setIsShowing] = useState(false)
  let { styles, attributes }  = usePopper(referenceElement, popperElement, {
    placement: "auto",
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 5],
        },
      },
    ]
  })

  return (
    <Popover>
      <Popover.Button
        onMouseEnter={() => setIsShowing(true)}
        onMouseLeave={() => setIsShowing(false)}
        onTouchStartCapture={() => setIsShowing(true)}
        onTouchEndCapture={() => setIsShowing(false)}
        ref={setReferenceElement}>
        <InfoCircle />
      </Popover.Button>

      {
        isShowing && (
          <Popover.Panel
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
            static
          >
            <div className="p-3 max-w-40 text-sm font-light text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm">
              {children}
            </div>
          </Popover.Panel>
        )
      }
    </Popover>
  )
};

export type SummaryCardProps = {
  title: string;
  count: number | string;
  data: CurveData[];
  changePercent?: number;
  bgClass?: string;
  linearColor?: string;
  centralLineColor?: string;
  titleHint?: string;
  url?: string;
}

export default ({ title,
                  count,
                  data,
                  changePercent=0,
                  bgClass='bg-cyan-50',
                  linearColor='#22d3ee',
                  centralLineColor='#9ca3af',
                  titleHint='',
                  url='#' }: SummaryCardProps) => {
  let changePercentClassName = 'flex text-green-500 text-sm font-bold';
  if (changePercent < 0) {
    changePercentClassName = 'flex text-red-500 text-sm font-bold'
  }
  return (
    <div className={`border rounded-lg border-cyan-200 p-3 ${bgClass}`}>
      <div className="flex justify-between">
        <div className="text-md font-bold">{title}</div>
        {
          titleHint && (
            <div className="text-gray-500">
              <MyPopover>
                {titleHint}
              </MyPopover>
            </div>
          )
        }
      </div>
      <div className="flex h-24">
        <div className="w-1/3 h-full font-bold text-3xl overflow-hidden break-all leading-9 pt-6">
          { count ?? 0 }
        </div>
        <div className="w-2/3 h-full pt-10">
          <Link className="w-full h-full block" href={url}>
            <ParentSize>{({ width, height }) => (
              <CurveLinearClosed
                chartKey={title.toLowerCase()}
                data={data}
                width={width}
                height={height}
                color={linearColor}
                centralLineColor={centralLineColor} />
            )}</ParentSize>
          </Link>
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
