
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Scale from 'd3-scale';
import { IccScaleFactory } from './../scale/scale-factory';

export class IccScaleDraw {

  x = null;
  xAxis = null;
  xGroup = null;

  x2 = null;
  x2Axis = null;
  x2Group = null;

  x3 = null;
  x3Group = null;

  y = null;
  yAxis = null;
  yGroup = null;

  y2 = null;
  y2Group = null;

  y3 = null;
  y3Axis = null;
  y3Group = null;

  colors = null;
  dispatch = null;

  xFactory: any;
  yFactory: any;

  private options: any;

  constructor() { }

  buildScales(options: any): void {
    this.options = options;
    this.setXScale();
    this.setYScale();
    this.update(options);
    this.setXAxis();
    this.setYAxis();
  }

  update(options: any): void {
    this.options = options;
    this.updateXScale();
    this.updateYScale();
  }

  updateXScale(): void {
    this.xFactory.updateRange(this.x,  [0, this.options.drawWidth]);
    this.xFactory.updateRange(this.x2, [0, this.options.drawWidth]);
    this.xFactory.updateRange(this.x3, [0, this.options.brushYWidth]);
  }

  updateYScale(): void {
    const reverse = this.options.yScaleType === 'band';
    this.yFactory.updateRange(this.y,  [this.options.drawHeight,  0], reverse);
    this.yFactory.updateRange(this.y2, [this.options.drawHeight2, 0], reverse);
    this.yFactory.updateRange(this.y3, [this.options.drawHeight,  0], reverse);
  }

  setDrawDomain(data: any[]): void {
    const drawData = data.filter((d: any) => !d.disabled);
    if (drawData.length > 0) {
      this.setXDomain(drawData);
      this.setYDomain(drawData);
    }
  }

  private setXScale(): void {
    this.xFactory = new IccScaleFactory(this.options.xScaleType, this.options);
    this.x = this.xFactory.getScale([0, this.options.drawWidth]);
    this.x2 = this.xFactory.getScale([0, this.options.drawWidth]);
    this.x3 = this.xFactory.getScale([0, this.options.brushYWidth]);

    if (this.options.chartType === 'groupedBarChart') { // TODO check again here???
      this.xGroup = d3Scale.scaleBand().padding(0.05);
      this.x2Group = d3Scale.scaleBand().padding(0.05);
      this.x3Group = d3Scale.scaleBand().padding(0.05);
    }
  }

  private setYScale(): void {
    this.yFactory = new IccScaleFactory(this.options.yScaleType, this.options);
    const reverse = this.options.yScaleType === 'band';
    this.y = this.yFactory.getScale([this.options.drawHeight, 0], reverse);
    this.y2 = this.yFactory.getScale([this.options.drawHeight2, 0], reverse);
    this.y3 = this.yFactory.getScale([this.options.drawHeight, 0], reverse);

    if (this.options.chartType === 'groupedHorizontalBarChart') {
      this.yGroup = d3Scale.scaleBand().padding(0.05);
      this.y2Group = d3Scale.scaleBand().padding(0.05);
      this.y3Group = d3Scale.scaleBand().padding(0.05);
    }
  }

  setXDomain(data, type = null): void { // stacked / normalized / null
    this.xFactory.setXDomain(this.x, data, type);
    this.x2.domain(this.x.domain());
    this.x3.domain(this.x.domain());

    if (this.options.chartType === 'groupedBarChart') {
      const keys = data.map(d => this.options.x0(d));
      this.xGroup.domain(keys).rangeRound([0, this.x.bandwidth()]);

      const gmax = Math.max(10, this.x2.bandwidth());
      this.x2Group.domain(keys).rangeRound([0, gmax]);

      const gmax2 = Math.max(10, this.x3.bandwidth()); // TODO min 10??
      this.x3Group.domain(keys).rangeRound([0, gmax2]);
    }
  }

  setYDomain(data, type = null): void {
    this.yFactory.setYDomain(this.y, data, type);
    this.y2.domain(this.y.domain());
    this.y3.domain(this.y.domain());

    if (this.options.chartType === 'groupedHorizontalBarChart') {
      const keys = data.map(d => this.options.x0(d));
      this.yGroup.domain(keys).rangeRound([0, this.y.bandwidth()]);
      this.y2Group.domain(keys).rangeRound([0, this.y2.bandwidth()]);
      this.y3Group.domain(keys).rangeRound([0, this.y3.bandwidth()]);
    }
  }

  setXAxis(): void {
    this.xAxis = d3Axis.axisBottom(this.x);
    this.x2Axis = d3Axis.axisBottom(this.x2);
  }

  setYAxis(): void {
    this.yAxis = d3Axis.axisLeft(this.y);
    this.y3Axis = d3Axis.axisRight(this.y3);
  }

  getXBarWidth(scale, data: any[], isFirst: boolean = false): number {
    if (scale.bandwidth) {
      return Math.max(1, scale.bandwidth());
    } else if (data.length > 0) {
      const length = this.options.y0(data[0]).length; // TODO pass in or better get data length
      if (length > 0) {
        const range = scale.range();
        const barWidth = Math.floor((range[1] - (length - 1) * 0.1) / (length) - 1.0);
        let scaleBar = 1;
        if (!isFirst) {
          const xdomain = scale.domain();
          scaleBar = (range[1] - range[0]) / (this.x2(xdomain[1]) - this.x2(xdomain[0]));
        }
        return Math.max(1, Math.floor(scaleBar * barWidth));
      }
    }
  }

  getYBarWidth(scale, data: any[], isFirst: boolean = false): number {
    if (scale.bandwidth) {
      return Math.max(1, scale.bandwidth());
    } else if (data.length > 0) {
      const length = this.options.y0(data[0]).length; // TODO pass in or better get data length
      const range = scale.range();
      const barWidth = Math.floor((range[1] - (length - 1) * 0.1) / (length) - 1.0);
      let scaleBar = 1;
      if (!isFirst) {
        const xdomain = scale.domain();
        scaleBar = (range[1] - range[0]) / (this.y2(xdomain[1]) - this.y2(xdomain[0]));
      }
      return Math.max(1, Math.floor(scaleBar * barWidth));
    }
  }
}

