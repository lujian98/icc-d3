import * as d3 from 'd3-selection';
import * as d3Axis from 'd3-axis';
import { IccD3Options, IccScaleLinear } from '../model';
import { IccScaleDraw } from './scale-draw';

export class IccAxisDraw<T> {
  private drawID: number;

  constructor(
    private svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
    private scale: IccScaleDraw<T>,
    private options: IccD3Options,
  ) {
    if (this.options.axisEnabled) {
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
    const y0 = this.options.xAxis.position === 'top' ? 0 : this.options.drawHeight;
    xAxisDraw.select('.axis--x')
      .attr('transform', `translate(0, ${y0})`)
      .call(this.scale.xAxis.tickSize(this.options.xAxis.tickSize)
        .tickPadding(this.options.xAxis.tickPadding));
    if (this.options.xAxis.enableGrid) {
      xAxisDraw.select('.axis--xgrid')
        .attr('transform', `translate(0, ${y0})`)
        .call(this.scale.xGrid.tickSize(-this.options.drawHeight));
    }
    if (this.options.xScaleType === 'band') {
      xAxisDraw.select('clipPath').select('rect')
        .attr('width', this.options.drawWidth)
        .attr('height', this.options.drawHeight + this.options.margin.top + this.options.margin.bottom)
        .attr('x', 0).attr('y', 0);
    }

    const anchorX = this.options.xAxis.textAnchor;
    const x = anchorX === 'middle' ? this.options.drawWidth / 2 : anchorX === 'end' ? this.options.drawWidth : 0;
    const y = this.options.xAxis.axisLabelDistance;
    xAxisDraw.select('.xAxis--label')
      .attr('transform', `translate(0, ${y0}) rotate(${this.options.xAxis.rotate}, ${x}, ${y}) `)
      .style('text-anchor', anchorX)
      .attr('x', x)
      .attr('dy', this.options.xAxis.axisLabelDistance)
      .text(this.options.xAxis.axisLabel);
  }

  updateYAxis(): void {
    const yAxisDraw = this.svg.select('.yAxisDraw');
    const x0 = this.options.yAxis.position === 'left' ? 0 : this.options.drawWidth;
    yAxisDraw.select('.axis--y')
      .attr('transform', `translate(${x0}, 0)`)
      .call(this.scale.yAxis.tickSize(this.options.yAxis.tickSize)
        .tickPadding(this.options.yAxis.tickPadding));
    if (this.options.xAxis.enableGrid) {
      yAxisDraw.select('.axis--ygrid')
        .attr('transform', `translate(${x0}, 0)`)
        .call(this.scale.yGrid.tickSize(-this.options.drawWidth));
    }
    if (this.options.yScaleType === 'band') {
      yAxisDraw.select('clipPath').select('rect')
        .attr('width', this.options.drawWidth + this.options.margin.left)
        .attr('height', this.options.drawHeight)
        .attr('x', -this.options.margin.left).attr('y', 0);
    }

    const anchorY = this.options.yAxis.textAnchor;
    const y = anchorY === 'start' ? this.options.drawHeight : anchorY === 'middle' ? this.options.drawHeight / 2 : 0;
    yAxisDraw.select('.yAxis--label')
      .attr('transform', `translate(${x0}, 0) rotate(${this.options.yAxis.rotate}, ${this.options.yAxis.axisLabelDistance}, ${y})`)
      .style('text-anchor', anchorY)
      .attr('y', anchorY === 'end' ? y + 15 : y) // TODO not sure for this 15 for font size
      .attr('dx', this.options.yAxis.axisLabelDistance)
      .text(this.options.yAxis.axisLabel);
  }

  private drawXAxis(): void {
    const xAxisDraw = this.svg.select('.xAxisDraw');
    if (this.options.xScaleType === 'band') {
      xAxisDraw.append('defs').append('clipPath').attr('id', `clip-axis--x${this.drawID}`).append('rect');
      xAxisDraw.attr('clip-path', `url(#clip-axis--x${this.drawID})`);
    }
    xAxisDraw.append('g').attr('class', 'axis axis--x');
    xAxisDraw.append('g').attr('class', 'axis axis--xgrid');
    xAxisDraw.append('g').append('text').attr('class', 'xAxis--label');
  }

  private drawYAxis(): void {
    const yAxisDraw = this.svg.select('.yAxisDraw');
    if (this.options.yScaleType === 'band') {
      yAxisDraw.append('defs').append('clipPath').attr('id', `clip-axis--y${this.drawID}`).append('rect');
      yAxisDraw.attr('clip-path', `url(#clip-axis--y${this.drawID})`);
    }
    yAxisDraw.append('g').attr('class', 'axis axis--y');
    yAxisDraw.append('g').attr('class', 'axis axis--ygrid');
    yAxisDraw.append('g').append('text').attr('class', 'yAxis--label');
  }
}

