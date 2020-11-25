import * as d3Shape from 'd3-shape';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccScale, IccScaleLinear } from '../model';

export class IccAreaChart<T> extends IccAbstractDraw<T> {

  drawContents(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName).selectAll('g').data(this.data).join('g')
      .append('path')
      .attr('stroke-width', 1.0)
      .attr('class', 'area draw')
      .attr('fill-opacity', 0.5);
    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.legendMouseover(e, d, true))
        .on('mouseout', (e, d) => this.legendMouseover(e, d, false));
    }
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawArea = d3Shape.area()
      .curve(d3Shape.curveLinear)
      .defined((d, i) => !isNaN(this.options.y(d)) && this.options.y(d) !== null)
      .x((d: any) => scaleX(this.options.x(d)))
      .y0((d) => scaleY.domain()[0] < 0 ? scaleY(0) : scaleY.range()[0])
      .y1((d: any) => scaleY(this.options.y(d)));
    const drawContent = (d) => drawArea(this.options.y0(d));
    this.svg.select(drawName).selectAll('g').select('.draw')
      .attr('fill', (d, i) => this.getdrawColor(d, i))
      .attr('fill', (d, i) => this.getdrawColor(d, i))
      .attr('d', drawContent);
  }

  legendMouseover(e, data, mouseover: boolean): void {
    if (e) {
      this.dispatch.call('drawMouseover', this, { event: e, indexData: mouseover ? data : null });
    }
    this.svg.select(`.${this.chartType}`).selectAll('g').select('.draw')
      .filter((d: any) => this.options.x0(d) === this.options.x0(data))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.5);
  }
}

