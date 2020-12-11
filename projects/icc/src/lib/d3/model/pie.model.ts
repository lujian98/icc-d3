export interface IccD3PieOptions {
  startAngle?: number;
  endAngle?: number;
  donut?: number;  // 0 - 0.95 R innerRadius(radius * Math.min(0.95, donut)
}

export interface IccPosition {
  x: number;
  y: number;
}