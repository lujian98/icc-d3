import { IccD3Options } from './options.model';
import { IccD3Range } from './range.model';

export interface IccD3BulletChartData { // TODO not sure why not work
  label?: string;
  unit?: string;
  range?: IccD3Range[];
  measures?: any[];
  markerLines?: any[];
}

export const DEFAULT_BULLET_CHART_OPTIONS: IccD3Options = {
  xScaleType: 'linear',
  maxDrawHeight: 40,
  margin: { top: 0, right: 20, bottom: 0, left: 60 },
  x0: (d) => d.label,
  y0: (d) => d.measures,
  x: (d) => d.x,
  y: (d) => d.label,
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
