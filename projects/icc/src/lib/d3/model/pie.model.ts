import { IccD3Options } from './options.model';

export interface IccD3PieOptions {
  startAngle?: number;
  endAngle?: number;
  donut?: number;  // 0 - 0.95 R innerRadius(radius * Math.min(0.95, donut)
}

export const DEFAULT_PIE_CHART_OPTIONS: IccD3Options = {
  pie: {
    startAngle: 0,
    endAngle: Math.PI * 2,
    donut: 0.0
  },
  zoom: {
    enabled: false
  }
};

