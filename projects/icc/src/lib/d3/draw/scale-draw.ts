import * as d3Axis from 'd3-axis';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import { IccScaleFactory } from './../scale/scale-factory';
import { IccScale, IccScaleColor, IccScaleBand, IccScaleAxis, IccD3Options } from '../model';

export class IccScaleDraw<T> {

  xFactory: IccScaleFactory<T>;
  yFactory: IccScaleFactory<T>;

  colors: IccScaleColor;

  x: IccScale;
  xAxis: IccScaleAxis;
  xGroup: IccScaleBand;

  x2: IccScale;
  x2Axis: IccScaleAxis;
  x2Group: IccScaleBand;

  x3: IccScale;
  x3Group: IccScaleBand;

  y: IccScale;
  yAxis: IccScaleAxis;
  yGroup: IccScaleBand;

  y2: IccScale;
  y2Group: IccScaleBand;

  y3: IccScale;
  y3Axis: IccScaleAxis;
  y3Group: IccScaleBand;

  private options: IccD3Options;

  constructor() { }

  buildScales(options: IccD3Options): void {
    this.options = options;
    this.setXScale();
    this.setYScale();
    this.update(options);
    this.setXAxis();
    this.setYAxis();
  }

  update(options: IccD3Options): void {
    this.options = options;
    this.updateXScale();
    this.updateYScale();
  }

  updateXScale(): void {
    this.xFactory.updateRange(this.x, [0, this.options.drawWidth]);
    this.xFactory.updateRange(this.x2, [0, this.options.drawWidth]);
    this.xFactory.updateRange(this.x3, [0, this.options.brushYWidth]);
  }

  updateYScale(): void {
    const reverse = this.options.yScaleType === 'band';
    this.yFactory.updateRange(this.y, [this.options.drawHeight, 0], reverse);
    this.yFactory.updateRange(this.y2, [this.options.drawHeight2, 0], reverse);
    this.yFactory.updateRange(this.y3, [this.options.drawHeight, 0], reverse);
  }

  setDrawDomain(data: any[]): void {
    const drawData = data.filter((d: any) => !d.disabled);
    if (drawData.length > 0 && this.options.axisEnabled) {
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

  setXDomain(data: T[], type = null): void { // stacked / normalized / null
    this.xFactory.setXDomain(this.x, data, type);
    this.x2.domain(this.x.domain() as any);
    this.x3.domain(this.x.domain() as any);

    if (this.options.chartType === 'groupedBarChart') {
      const keys = data.map(d => this.options.x0(d));
      const xScale = this.x as IccScaleBand;
      this.xGroup.domain(keys).rangeRound([0, xScale.bandwidth()]);

      const x2Scale = this.x2 as IccScaleBand;
      const gmax = Math.max(10, x2Scale.bandwidth());
      this.x2Group.domain(keys).rangeRound([0, gmax]);

      const x3Scale = this.x3 as IccScaleBand;
      const gmax2 = Math.max(10, x3Scale.bandwidth()); // TODO min 10??
      this.x3Group.domain(keys).rangeRound([0, gmax2]);
    }
  }

  setYDomain(data: T[], type = null): void {
    this.yFactory.setYDomain(this.y, data, type);
    this.y2.domain(this.y.domain() as any);
    this.y3.domain(this.y.domain() as any);

    if (this.options.chartType === 'groupedHorizontalBarChart') {
      const keys = data.map(d => this.options.x0(d));
      const yScale = this.y as IccScaleBand;
      const y2Scale = this.y2 as IccScaleBand;
      const y3Scale = this.y3 as IccScaleBand;
      this.yGroup.domain(keys).rangeRound([0, yScale.bandwidth()]);
      this.y2Group.domain(keys).rangeRound([0, y2Scale.bandwidth()]);
      this.y3Group.domain(keys).rangeRound([0, y3Scale.bandwidth()]);
    }
  }

  setXAxis(): void {
    this.xAxis = d3Axis.axisBottom(this.x as any);
    this.x2Axis = d3Axis.axisBottom(this.x2 as any);
  }

  setYAxis(): void {
    this.yAxis = d3Axis.axisLeft(this.y as any);
    this.y3Axis = d3Axis.axisRight(this.y3 as any);
  }

  // TODO move this to scale factory
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

  initColor(data: T[], options: IccD3Options): void {
    if (options) {
      this.options = options;
    }
    this.setColors(this.options.colors || d3ScaleChromatic.schemeCategory10);
    this.setColorDomain(data);
  }

  public setColors(colors): void {
    this.colors = d3Scale.scaleOrdinal(colors);
  }

  public setColorDomain(data: any[]): void {
    let keys = data.map((d, i) => this.options.drawColor(d, i));
    if (this.options.chartType === 'barChart' || this.options.chartType === 'pieChart') {
      const values = this.options.y0(data[0]);
      keys = values.map((d, i) => this.options.drawColor(d, i));
    }
    // console.log( ' keys =', keys)
    this.colors.domain(keys);
  }
}

