
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import { IccScaleDraw } from './scale-draw';

export class IccColorDraw<T> {

  constructor(private scale: IccScaleDraw<T>, private data: any[], private options: any) {
    this.setColors(this.options.colors || d3ScaleChromatic.schemeCategory10);
    this.setDomain(this.data);
  }

  public setColors(colors): void {
    this.scale.colors = d3Scale.scaleOrdinal(colors);
  }

  public setDomain(data: any[]): void {
    let keys = data.map((d) => this.options.drawColor(d));

    if (this.options.chartType === 'barChart') { // TODO all array data to get unique keys
      const values = this.options.y0(data[0]);
      keys = values.map((d) => this.options.drawColor(d));
    }
    this.scale.colors.domain(keys);
  }
}

