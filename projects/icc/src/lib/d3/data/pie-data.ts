import * as d3Shape from 'd3-shape';
import { IccD3Options } from '../model';

export class IccPieData<T> {

  constructor(
    private options: IccD3Options,
  ) {
  }

  getPieData(data: T[]): any[] {
    const pie = d3Shape.pie()
    .sort(null)
    .value((d: any) => this.options.y(d));
    const mdata = this.options.y0(data[0]);
    return pie([...mdata]);
  }
}

