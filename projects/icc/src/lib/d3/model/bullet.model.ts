import { IccD3Options } from './options.model';
import { IccD3Range } from './range.model';

export interface IccD3BulletChartData {
  range?: IccD3Range[]; // should this move to options
  measures?: any[];
  markerLines?: any[]; // should this move to options
}

export interface IccD3BulletChartOptions {
  label?: string;
  unit?: string;
  valueMarkerColor?: string;
  valueMarkerDy?: number;
  markerLineWidth?: number;
}

export const DEFAULT_BULLET_CHART_OPTIONS: IccD3Options = {
  xScaleType: 'linear',
  maxDrawHeight: 40,
  margin: { top: 0, right: 20, bottom: 0, left: 60 },
  y0: (d) => d.measures,
  x: (d) => d.x,
  y: (d) => d.label,
  bullet: {
    label: '',
    unit: '',
    valueMarkerColor: 'yellow',
    valueMarkerDy: 12,
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
