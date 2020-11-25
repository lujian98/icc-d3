import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import * as d3Format from 'd3-format';

export type IccScaleColor = d3Scale.ScaleOrdinal<string, {}>;
export type IccScaleLinear = d3Scale.ScaleLinear<number, number>;
export type IccScaleTime = d3Scale.ScaleTime<number, number>;
export type IccScaleBand = d3Scale.ScaleBand<string>;
export type IccScale = IccScaleLinear | IccScaleTime | IccScaleBand;
export type IccScaleAxis = d3Axis.Axis<d3Axis.AxisDomain>;

export interface IccMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface IccD3Zoom {
  enabled?: boolean;
  // scaleExtent?: [1, 10],
  // useFixedDomain?: boolean;
  // useNiceScale?: boolean;
  horizontalOff?: boolean;
  horizontalBrushShow?: boolean;
  verticalOff?: boolean;
  verticalBrushShow?: boolean;
  // unzoomEventType?: 'dblclick.zoom'
}
//         tickFormat: (d) => d3.format(',.2f')(d)
//       tooltip: {
//  keyFormatter: (d) => d3.time.format('%x')(new Date(d))
// }

export interface IccD3PopoverOptions {
  totalLable?: string;
  labelFormatter?: Function;
  keyFormatter?: Function;
  valueFormatter?: Function;
}

export interface IccD3Options {
  chartType?: string;
  useInteractiveGuideline?: boolean;
  margin?: IccMargin;
  width?: string | number;
  height?: string | number; // TODO not used yet
  xScaleType?: string;
  yScaleType?: string;

  x0?: Function;
  y0?: Function;
  x?: Function;
  y?: Function;

  colors?: string[];
  drawColor?: Function;
  barColor?: Function;
  duration?: number;

  popover?: IccD3PopoverOptions;
  zoom?: IccD3Zoom;

  brushYWidth?: number;
  legendHeight?: number;
  drawHeight?: number;
  drawWidth?: number;
  drawHeight2?: number; // bottom brush height
}

export const DEFAULT_CHART_OPTIONS: IccD3Options = {
  chartType: 'lineChart',
  useInteractiveGuideline: false,
  margin: { top: 10, right: 10, bottom: 20, left: 40 },
  width: '100%',
  // height: 500, // TODO not used yet
  brushYWidth: 50,
  drawHeight2: 50,
  xScaleType: 'time',
  yScaleType: 'linear',
  legendHeight: 20,
  x0: (d) => d.key,
  y0: (d) => d.values,
  x: (d) => d.x,
  y: (d) => d.y,
  drawColor: (d, i) => d.key,
  duration: 0,
  popover: {
    totalLable: 'Total',
    labelFormatter: (d) => d,
    keyFormatter: (d) => d,
    valueFormatter: (d) => d3Format.format(',.2f')(d)
  },
  zoom: {
    enabled: true,
    horizontalOff: false,
    horizontalBrushShow: true,
    verticalOff: false,
    verticalBrushShow: true
  }
};

