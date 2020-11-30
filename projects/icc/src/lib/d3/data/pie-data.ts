import * as d3Shape from 'd3-shape';
import { IccD3Options } from '../model';

export class IccPieData<T> {

  constructor(
    private options: IccD3Options,
  ) {
  }

  getPieData(data: T[]): any[] {  // default 0pi - 2pi
    const pie = d3Shape.pie()
      .padAngle(0.005) // TODO options?
      .sort(null)
      .value((d: any) => this.options.y(d))
      .startAngle(Math.PI * -0) // TODO options?
      .endAngle(Math.PI * 2);   // TODO options?
    const mdata = this.options.y0(data[0]);
    return pie([...mdata]);
  }
}

