import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccScale, IccScaleLinear } from '../model/model';

export class IccBarChart<T> extends IccAbstractDraw<T> {

  drawContents(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName).selectAll('g').data(this.data).join('g')
      .attr('fill', (d, i) => this.getdrawColor(d, i));

    if (drawName === `.${this.chartType}`) {
      drawContents.attr('class', 'barChart series').style('fill-opacity', 0.75);
    }
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName).selectAll('g').selectAll('rect')
      .data((d) => this.options.y0(d)).join('rect')
      .attr('class', 'bar draw')
      .attr('fill', (d: any, i) => this.getBarColor(d, i))
      .attr('x', (d, i) => scaleX(this.options.x(d)))
      .attr('width', this.scale.getXBarWidth(scaleX, this.data));

    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e: MouseEvent, d) => {
          this.drawMouseover(d, true);
          this.dispatch.call('drawMouseover', this, { event: e, data: d });
        })
        .on('mouseout', (e, d) => {
          this.drawMouseover(d, false);
          this.dispatch.call('drawMouseout', this, { event: e, data: d });
        });
    }
    if (this.isAnimation && this.options.duration > 0) {
      drawContents
        .attr('y', (d, i) => scaleY(0))
        .attr('height', (d, i) => 0)
        .transition()
        .duration(this.options.duration)
        .attr('y', (d, i) => scaleY(Math.max(0, this.options.y(d))))
        .attr('height', (d, i) => scaleY(0) - scaleY(Math.abs(this.options.y(d))));
    } else {
      drawContents
        .attr('y', (d, i) => scaleY(Math.max(0, this.options.y(d))))
        .attr('height', (d, i) => scaleY(0) - scaleY(Math.abs(this.options.y(d))));
    }
  }

  legendMouseover(data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').selectAll('.draw')
      .style('fill-opacity', (d) => mouseover ? null : 0.75);

    this.svg.select(`.${this.chartType}`).selectAll('.series')
      .filter((d: any, i) => this.options.x0(d) === this.options.x0(data))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75);
  }

  drawMouseover(data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').selectAll('.draw')
      .filter((d: any) => this.options.x(d) === this.options.x(data))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75);
  }
}

