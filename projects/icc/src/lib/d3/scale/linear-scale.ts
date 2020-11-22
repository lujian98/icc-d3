import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import { IccAbstractScale } from './abstract-scale';
import { IccScaleLinear } from '../model/model';

export class IccLinearScale extends IccAbstractScale {
  getScale(range: [], reverse = false): IccScaleLinear {
    return d3Scale.scaleLinear().range(range);
  }

  updateRange(scale: IccScaleLinear, range: [], reverse: boolean): void {
    scale.range(range);
  }

  setXDomain(scale: IccScaleLinear, data: [], type = null): void {
    let minv; let maxv;
    if (type === 'stacked') {
      minv = d3Array.min(data, (c) => d3Array.min(c, (d) => d[0]));
      maxv = d3Array.max(data, (c) => d3Array.max(c, (d) => d[1]));
    } else if (type === 'normalized') {
      minv = 0;
      maxv = 1;
    } else {
      minv = d3Array.min(data, (c) => d3Array.min(this.options.y0(c), (d) => +this.options.x(d)));
      maxv = d3Array.max(data, (c) => d3Array.max(this.options.y0(c), (d) => +this.options.x(d)));
    }
    if (this.options.chartType === 'horizontalBarChart' || this.options.chartType === 'groupedHorizontalBarChart') {
      minv = minv > 0 ? 0 : minv;
      maxv = maxv < 0 ? 0 : maxv;
    }
    scale.domain([minv, maxv]).nice();
  }

  setYDomain(scale: IccScaleLinear, data: [], type = null): void {
    let minv; let maxv;
    if (type === 'stacked') {
      minv = d3Array.min(data, (c) => d3Array.min(c, (d) => d[0]));
      maxv = d3Array.max(data, (c) => d3Array.max(c, (d) => d[1]));
    } else if (type === 'normalized') { // possible negative?
      minv = 0;
      maxv = 1;
    } else {
      minv = d3Array.min(data, (c) => d3Array.min(this.options.y0(c), (d) => +this.options.y(d)));
      maxv = d3Array.max(data, (c) => d3Array.max(this.options.y0(c), (d) => +this.options.y(d)));
    }
    if (this.options.chartType === 'barChart' || this.options.chartType === 'groupedBarChart') {
      minv = minv > 0 ? 0 : minv;
      maxv = maxv < 0 ? 0 : maxv;
    }
    scale.domain([minv, maxv]).nice();
  }
}

