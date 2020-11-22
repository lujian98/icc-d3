import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';

export type IccScaleColor = d3Scale.ScaleOrdinal<string, {}>;
export type IccScaleLinear = d3Scale.ScaleLinear<number, number>;
export type IccScaleTime = d3Scale.ScaleTime<number, number>;
export type IccScaleBand = d3Scale.ScaleBand<string>;
export type IccScale = IccScaleLinear | IccScaleTime | IccScaleBand;
export type IccScaleAxis = d3Axis.Axis<d3Axis.AxisDomain>;

export interface IccD3Options {
  chartType?: string;
  useInteractiveGuideline?: boolean;

  margin?: any;
  width?: string | number;
  height?: string | number;
  brushYWidth?: number;
  xScaleType?: string;
  yScaleType?: string;
  legendHeight?: number;
  x0?: any;
  y0?: any;
  x?: any;
  y?: any;
  colors?: string[];
  drawColor?: any;
  barColor?: any;
  duration?: number;
  zoom?: any;

  drawHeight?: number;
  drawWidth?: number;
  drawHeight2?: number;
}

export const DEFAULT_CHART_OPTIONS: IccD3Options = {
  chartType: 'lineChart',
  useInteractiveGuideline: false,
  margin: { top: 10, right: 10, bottom: 20, left: 40 },
  width: '100%',
  height: 500,
  brushYWidth: 50,
  xScaleType: 'time',
  yScaleType: 'linear',
  legendHeight: 20,
  x0: (d) => d.key,
  y0: (d) => d.values,
  x: (d) => d.x,
  y: (d) => d.y,
  drawColor: (d, i) => d.key,
  duration: 0,
  zoom: {
    enabled: true,
    // scaleExtent: [1, 10],
    // useFixedDomain: false,
    // useNiceScale: false,
    horizontalOff: false,
    horizontalBrushShow: true,
    verticalOff: false,
    verticalBrushShow: true
    // unzoomEventType: 'dblclick.zoom'
  }
};

