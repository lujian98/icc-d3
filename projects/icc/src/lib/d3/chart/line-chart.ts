import * as d3Shape from 'd3-shape';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccScale, IccScaleLinear } from '../model';

export class IccLineChart<T> extends IccAbstractDraw<T> {

  drawContents(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName).selectAll('g').data(this.data).join('g')
      .append('path').attr('class', 'line draw');

    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.legendMouseover(e, d, true))
        .on('mouseout', (e, d) => this.legendMouseover(e, d, false));
    }
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawLine = d3Shape.line()
      .x((d: any) => scaleX(this.options.x(d)))
      .y((d: any) => scaleY(this.options.y(d)));
    const drawContent = (d) => drawLine(this.options.y0(d));
    this.svg.select(drawName).selectAll('g').select('.draw')
      .style('stroke', (d, i) => this.getdrawColor(d, i))
      .attr('d', drawContent);
  }

  legendMouseover(e, data, mouseover: boolean): void {
    if (e) {
      this.dispatch.call('drawMouseover', this, { event: e, indexData: mouseover ? data : null });
    }
    this.svg.select(`.${this.chartType}`).selectAll('g').select('.draw')
      .filter((d: any) => this.options.x0(d) === this.options.x0(data))
      .attr('stroke-width', (d) => mouseover ? 2.0 : 1.0);
  }
}

