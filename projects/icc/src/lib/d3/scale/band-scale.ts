import * as d3Scale from 'd3-scale';
import { IccAbstractScale } from './abstract-scale';
import { IccScaleBand } from '../model/model';

export class IccBandScale<T> extends IccAbstractScale {

  getScale(range: [], reverse = false): IccScaleBand {
    if (reverse) {
      range.reverse();
    }
    return d3Scale.scaleBand().rangeRound(range).paddingInner(0.1);
  }

  updateRange(scale: IccScaleBand, range: [], reverse: boolean): void {
    if (reverse) {
      range.reverse();
    }
    scale.rangeRound(range);
  }

  setXDomain(scale: IccScaleBand, data: any[], type = null): void {
    const xdomain = this.options.y0(data[0]).map((d) => this.options.x(d));
    scale.domain(xdomain);
  }

  setYDomain(scale: IccScaleBand, data: any[], type = null): void {
    const ydomain = this.options.y0(data[0]).map((d) => this.options.y(d));
    scale.domain(ydomain);
  }
}

