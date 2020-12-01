import * as d3 from 'd3-selection';
import { IccScaleDraw } from './scale-draw';
import { IccD3Options } from '../model';

export class IccAxisDraw<T> {
  private drawID: number;

  constructor(
    private svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
    private scale: IccScaleDraw<T>,
    private options: IccD3Options,
  ) {
    if (this.options.chartType !== 'pieChart') {
      this.drawID = Math.floor(Math.random() * 100000);
      this.init();
      this.update();
    }
  }

  init(): void {
    this.drawXAxis();
    this.drawYAxis();
  }

  updateOptions(options: IccD3Options): void {
    this.options = options;
    this.update();
  }

  update(): void {
    this.updateXAxis();
    this.updateYAxis();
  }

  updateXAxis(): void {
    const xAxisDraw = this.svg.select('.xAxisDraw');
    xAxisDraw.select('.axis--x')
      .attr('transform', 'translate(0,' + this.options.drawHeight + ')')
      .call(this.scale.xAxis)
      .call(this.scale.xAxis.tickSize(-this.options.drawHeight));

    if (this.options.xScaleType === 'band') {
      xAxisDraw.select('clipPath').select('rect')
        .attr('width', this.options.drawWidth)
        .attr('height', this.options.drawHeight + this.options.margin.top + this.options.margin.bottom)
        .attr('x', 0).attr('y', 0);
    }
  }

  updateYAxis(): void {
    const yAxisDraw = this.svg.select('.yAxisDraw');
    yAxisDraw.select('.axis--y')
      .call(this.scale.yAxis)
      .call(this.scale.yAxis.tickSize(-this.options.drawWidth));

    if (this.options.yScaleType === 'band') {
      yAxisDraw.select('clipPath').select('rect')
        .attr('width', this.options.drawWidth + this.options.margin.left)
        .attr('height', this.options.drawHeight)
        .attr('x', -this.options.margin.left).attr('y', 0);
    }
  }

  private drawXAxis(): void {
    const xAxisDraw = this.svg.select('.xAxisDraw');
    if (this.options.xScaleType === 'band') {
      xAxisDraw.append('defs').append('clipPath').attr('id', `clip-axis--x${this.drawID}`).append('rect');
      xAxisDraw.attr('clip-path', `url(#clip-axis--x${this.drawID})`);
    }
    xAxisDraw.append('g').attr('class', 'axis axis--x');
  }

  private drawYAxis(): void {
    const yAxisDraw = this.svg.select('.yAxisDraw');
    if (this.options.yScaleType === 'band') {
      yAxisDraw.append('defs').append('clipPath').attr('id', `clip-axis--y${this.drawID}`).append('rect');
      yAxisDraw.attr('clip-path', `url(#clip-axis--y${this.drawID})`);
    }
    yAxisDraw.append('g').attr('class', 'axis axis--y');
  }
}

