import * as d3Shape from 'd3-shape';
import { IccD3Options } from '../model';

export class IccPieData<T> {

  constructor(
    private options: IccD3Options,
  ) {
  }

  getPieData(data: T[]): any[] {
    const pie = d3Shape.pie()
      .padAngle(0.005) // TODO options?
      .sort(null)
      .value((d: any) => this.options.y(d))
      .startAngle(this.options.pie.startAngle)
      .endAngle(this.options.pie.endAngle);
    const mdata = this.options.y0(data[0]).filter((d) => !d.disabled);
    return pie([...mdata]);
  }
}

