import { IccD3PieOptions } from './pie.model';

export interface IccD3RadialGaugeOptions extends IccD3PieOptions {
  startAngle?: number;
  endAngle?: number;
  donut?: number;  // 0 - 0.95 R innerRadius(radius * Math.min(0.95, donut)
}

