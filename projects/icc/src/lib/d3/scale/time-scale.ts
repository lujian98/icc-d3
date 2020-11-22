import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import { IccAbstractScale } from './abstract-scale';
import { IccScaleTime } from '../model/model';

export class IccTimeScale extends IccAbstractScale {

  getScale(range: [], reverse = false): IccScaleTime {
    return d3Scale.scaleTime().range(range);
  }

  updateRange(scale: IccScaleTime, range: [], reverse: boolean): void {
    scale.range(range);
  }

  setXDomain(scale: IccScaleTime, data: any[], type = null): void {
    const xdata = data.map((v) => v.values.map((d) => this.options.x(d)))[0];
    if (this.options.chartType === 'barChart') { // TODO options with add extra range for bar chart
      const max = d3Array.max(xdata);
      const addMax = new Date(max);
      const minD = d3Array.min(xdata);
      addMax.setDate(addMax.getDate() + 40);
      xdata.push(addMax);
      const addMin = new Date(minD);
      addMin.setDate(addMin.getDate() - 10);
      xdata.push(addMin);
    }
    scale.domain(d3Array.extent(xdata, (d: Date) => d));
  }

  setYDomain(scale: IccScaleTime, data: any[], type = null): void { // TODO
  }
}

