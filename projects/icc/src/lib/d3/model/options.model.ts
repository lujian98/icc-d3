import * as d3Format from 'd3-format';
import { IccD3PopoverOptions } from './popover.model';
import { IccD3ZoomOptions } from './zoom.model';

export interface IccMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface IccD3Options {
  chartType?: string;
  useInteractiveGuideline?: boolean;
  margin?: IccMargin;
  width?: string | number;
  // height?: string | number; // TODO not used yet
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
  zoom?: IccD3ZoomOptions;

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
    axisFormatter: (d) => d,
    serieFormatter: (d) => d,
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
