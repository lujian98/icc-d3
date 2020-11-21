import * as d3Scale from 'd3-scale';
import { IccAbstractScale } from './abstract-scale';

export class IccBandScale extends IccAbstractScale {

  getScale(range: any, reverse = false) {
    if (reverse) {
      range.reverse();
    }
    return d3Scale.scaleBand().rangeRound(range).paddingInner(0.1);
  }

  updateRange(scale: any, range: [], reverse: boolean) {
    if (reverse) {
      range.reverse();
    }
    scale.rangeRound(range);
  }

  setXDomain(scale: any, data: any[], type = null) {
    const xdomain = this.options.y0(data[0]).map((d) => this.options.x(d));
    scale.domain(xdomain);
  }

  setYDomain(scale: any, data: any[], type = null) {
    const ydomain = this.options.y0(data[0]).map((d) => this.options.y(d));
    scale.domain(ydomain);
  }
}

