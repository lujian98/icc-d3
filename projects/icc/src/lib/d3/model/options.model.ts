import * as d3Format from 'd3-format';
import { IccD3BulletChartOptions } from './bullet.model';
import { IccD3RadialGaugeOptions } from './gauge.model';
import { IccD3LegendOptions, DEFAULT_D3LEGEND_OPTIONS } from './legend.model';
import { IccD3PieChartOptions } from './pie.model';
import { IccD3PopoverOptions, DEFAULT_D3POPOVER_OPTIONS } from './popover.model';
import { IccD3ZoomOptions, DEFAULT_D3ZOOM_OPTIONS } from './zoom.model';
import { IccD3AxisOptions, DEFAULT_D3XAXIS_OPTIONS, DEFAULT_D3YAXIS_OPTIONS } from './axis.model';

export interface IccPosition {
  x: number;
  y: number;
}

export interface IccMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
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

  axisEnabled?: boolean;
  xAxis?: IccD3AxisOptions;
  yAxis?: IccD3AxisOptions;
  legend?: IccD3LegendOptions;
  bullet?: IccD3BulletChartOptions;
  pie?: IccD3PieChartOptions;
  radialGauge?: IccD3RadialGaugeOptions;
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
  margin: { top: 10, right: 10, bottom: 40, left: 50 },
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
  axisEnabled: true,
  xAxis: DEFAULT_D3XAXIS_OPTIONS,
  yAxis: DEFAULT_D3YAXIS_OPTIONS,
  legend: DEFAULT_D3LEGEND_OPTIONS,
  popover: DEFAULT_D3POPOVER_OPTIONS,
  zoom: DEFAULT_D3ZOOM_OPTIONS
};

