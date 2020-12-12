import * as d3Shape from 'd3-shape';
import { IccD3Options, IccPosition, IccD3PieOptions } from '../model';

export class IccPieData {
  pieOptions: IccD3PieOptions;
  constructor(
    private options: IccD3Options,
  ) { }

  getPieData(data: any[], withRange: boolean = false): any[] {
    const pie = d3Shape.pie()
      .padAngle(this.pieOptions.padAngle)
      .sort(null)
      .value((d) => withRange ? this.options.y(d) - this.options.x(d) : this.options.y(d))
      .startAngle(this.pieOptions.startAngle)
      .endAngle(this.pieOptions.endAngle);
    const mdata = data.filter((d) => !d.disabled);
    return pie([...mdata]);
  }

  setPieScaleXY(): IccPosition {
    const dAngle = Math.abs(this.pieOptions.endAngle - this.pieOptions.startAngle);
    const sxy: IccPosition = { x: 0, y: 0 };
    if (dAngle <= Math.PI) {
      const sinStart = +Math.sin(this.pieOptions.startAngle).toFixed(4);
      const sinEnd = +Math.sin(this.pieOptions.endAngle).toFixed(4);
      const cosStart = +Math.cos(this.pieOptions.startAngle).toFixed(4);
      const cosEnd = +Math.cos(this.pieOptions.endAngle).toFixed(4);
      if (dAngle <= Math.PI / 2) {
        if (sinStart <= 0 && cosStart >= 0 && sinEnd <= 0 && cosEnd >= 0) {
          sxy.x = 1;
          sxy.y = 1;
        } else if (sinStart >= 0 && cosStart >= 0 && sinEnd >= 0 && cosEnd >= 0) {
          sxy.x = -1;
          sxy.y = 1;
        } else if (sinStart >= 0 && cosStart <= 0 && sinEnd >= 0 && cosEnd <= 0) {
          sxy.x = -1;
          sxy.y = -1;
        } else if (sinStart <= 0 && cosStart <= 0 && sinEnd <= 0 && cosEnd <= 0) {
          sxy.x = 1;
          sxy.y = -1;
        }
      } else {
        if (cosStart >= 0 && cosEnd >= 0 && sinEnd > sinStart) {
          sxy.y = 1 / 2;
        } else if (cosStart <= 0 && cosEnd <= 0 && sinEnd < sinStart) {
          sxy.y = - 1 / 4;
        } else if (sinStart >= 0 && sinEnd >= 0 && cosEnd < cosStart) {
          sxy.x = -1 / 2;
        } else if (sinStart <= 0 && sinEnd <= 0 && cosEnd > cosStart) {
          sxy.x = 1 / 2;
        }
      }
    }
    return sxy;
  }
}
