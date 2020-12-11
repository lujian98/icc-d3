import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';
import { IccD3Options } from '../model';

export class IccPieData<T> {

  constructor(
    private options: IccD3Options,
  ) {
  }

  getPieData(data: T[]): any[] {
    const cScale = d3Scale.scaleLinear().domain([0, 6])
    .range([-120 * (Math.PI / 180), 120 * (Math.PI / 180)]);

    const pie = d3Shape.pie()
      .padAngle(0.005) // TODO options?
      .sort(null)
      .value((d: any) => this.options.y(d))
      .startAngle((d) => {
        // console.log( ' ssss d =', d)
        // cScale[d[0]];
        return this.options.pie.startAngle;
      })
      .endAngle(this.options.pie.endAngle);

      // .startAngle(this.options.pie.startAngle)
     // .endAngle(this.options.pie.endAngle);
    const mdata = this.options.y0(data[0]).filter((d) => !d.disabled);
    return pie([...mdata]);
  }
}

