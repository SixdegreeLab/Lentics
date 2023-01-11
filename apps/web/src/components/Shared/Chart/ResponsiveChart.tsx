import { ParentSize } from '@visx/responsive';

const ResponsiveChart =  ({ children }) => {
  return (
    <ParentSize className="min-h-80">{(parentSize) => (
      children({...parentSize})
    )}</ParentSize>
  )
}

export default ResponsiveChart;
