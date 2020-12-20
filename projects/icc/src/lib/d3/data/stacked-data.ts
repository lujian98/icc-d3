import * as d3 from 'd3-selection';
import * as d3Shape from 'd3-shape';
import { IccScaleDraw } from '../draw/scale-draw';
import { IccD3Options } from '../model';

export class IccStackedData<T> {
  offset = 'stackOffsetDiverging';
  normalized = false;

  constructor(
    private svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
    private scale: IccScaleDraw<T>,
    private options: IccD3Options,
    private chartType: string
  ) {
    if (this.chartType === 'stackedNormalizedAreaChart' || this.chartType === 'stackedNormalizedBarChart' ||
      this.chartType === 'stackedNormalizedHorizontalBarChart') {
      this.offset = 'stackOffsetExpand';
      this.normalized = true;
    } else if (this.chartType === 'stackedStreamAreaChart') {
      this.offset = 'stackOffsetWiggle';
    }
  }

  public getStackedData(data: T[], isStackedY): any[] {
    let ndata = [];
    data.forEach((d) => {
      ndata = this.options.y0(d).map((v, i) => {
        if (ndata.length === i) {
          ndata.push({});
        }
        const o = ndata[i];
        if (isStackedY) {
          for (const [key, value] of Object.entries(v)) {
            if (this.options.x(v) === value) {
              o[key] = value;
            }
          }
          o[this.options.x0(d)] = this.options.y(v);
        } else {
          for (const [key, value] of Object.entries(v)) {
            if (this.options.y(v) === value) {
              o[key] = value;
            }
          }
          o[this.options.x0(d)] = this.options.x(v);
        }
        return o;
      });
    });
    const keys = Object.getOwnPropertyNames(ndata[0]).slice(1); // TODO if [0] not include all keys? (d3.stackOffsetExpand)
    const stacks = d3Shape.stack().keys(keys);
    if (this.offset === 'stackOffsetDiverging') {
      stacks.offset(d3Shape.stackOffsetDiverging);
    } else if (this.offset === 'stackOffsetExpand') {
      stacks.offset(d3Shape.stackOffsetExpand);
    } else if (this.offset === 'stackOffsetWiggle') {
      stacks.offset(d3Shape.stackOffsetWiggle)
        .order(d3Shape.stackOrderInsideOut);
    }
    return stacks(ndata);
  }

  setStackedYDomain(data: T[]): void {
    this.scale.setYDomain(data, this.normalized ? 'normalized' : 'stacked');
    this.svg.select('.axis--y').call(this.scale.yAxis);
    this.svg.select('.axis--ygrid').call(this.scale.yGrid);
    this.svg.select('.contextBrushY').select('.axis--y').call(this.scale.y3Axis);
  }

  setStackedXDomain(data: T[]): void {
    this.scale.setXDomain(data, this.normalized ? 'normalized' : 'stacked');
    this.svg.select('.axis--x').call(this.scale.xAxis);
    this.svg.select('.axis--xgrid').call(this.scale.xGrid);
    this.svg.select('.context').select('.axis--x').call(this.scale.x2Axis);
  }
}

