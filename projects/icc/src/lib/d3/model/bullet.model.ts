import { IccD3Options } from './options.model';
import { IccD3Range } from './range.model';

export interface IccD3BulletChartData {
  range?: IccD3Range[]; // should this move to options
  measures?: any[];
  markerLines?: any[]; // should this move to options
}

export interface IccD3BulletChartOptions {
  type?: 'horizontal' | 'vertical';
  // valueMarkerColor?: string; // TODO not sure to use only one color for all value markers or value colors?
  markerLineWidth?: number;
}

export const DEFAULT_BULLET_CHART_OPTIONS: IccD3Options = {
  xScaleType: 'linear',
  yScaleType: 'linear',
  margin: { top: 0, right: 20, bottom: 20, left: 60 },
  y0: (d) => d.measures,
  x: (d) => d.value,
  y: (d) => d.label,
  bullet: {
    type: 'horizontal',
    markerLineWidth: 2,
  },
  legend: {
    enabled: false,
  },
  zoom: {
    enabled: true,
    horizontalOff: false,
    horizontalBrushShow: false,
    verticalOff: true,
    verticalBrushShow: false
  }
};

export const DEFAULT_VERTICAL_BULLET_CHART_OPTIONS: IccD3Options = {
  xScaleType: 'linear',
  yScaleType: 'linear',
  margin: { top: 20, right: 0, bottom: 40, left: 40 },
  y0: (d) => d.measures,
  x: (d) => d.label,
  y: (d) => d.value,
  bullet: {
    type: 'vertical',
    markerLineWidth: 2,
  },
  legend: {
    enabled: false,
  },
  zoom: {
    enabled: true,
    horizontalOff: true,
    horizontalBrushShow: false,
    verticalOff: false,
    verticalBrushShow: false
  }
};
