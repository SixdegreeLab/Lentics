import { ParentSize } from '@visx/responsive';

const ResponsiveChart =  ({ min_height="min-h-80", children }) => {
  return (
    <ParentSize className={min_height}>{(parentSize) => (
      children({...parentSize})
    )}</ParentSize>
  )
}

export default ResponsiveChart;
