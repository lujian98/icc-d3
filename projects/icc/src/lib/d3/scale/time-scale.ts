import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import { IccAbstractScale } from './abstract-scale';

export class IccTimeScale extends IccAbstractScale {

  getScale(range: any[], reverse = false) {
    return d3Scale.scaleTime().range(range);
  }

  updateRange(scale: any, range: [], reverse: boolean) {
    scale.range(range);
  }

  setXDomain(scale: any, data: any[], type = null) {
    const xdata = data.map((v) => v.values.map((d) => this.options.x(d)))[0];
    // console.log(' this.options =', this.options)
    if (this.options.chartType === 'barChart') { // TODO options with add extra range for bar chart
      const max = d3Array.max(xdata);
      const addMax = new Date(max);
      const minD = d3Array.min(xdata);
      addMax.setDate(addMax.getDate() + 40);
      xdata.push(addMax);
      const addMin = new Date(minD);
      addMin.setDate(addMin.getDate() - 10);
      xdata.push(addMin);
      // console.log( ' scale =', scale)
    }
    scale.domain(d3Array.extent(xdata, (d: Date) => d));
  }

  setYDomain(scale: any, data: any[], type = null) { // TODO
    // const ydomain = this.options.y0(this.data[0]).map((d) => this.options.y(d));
    // console.log(' ywwwwwdomain =', ydomain);
    // scale.domain(ydomain);
  }
}

