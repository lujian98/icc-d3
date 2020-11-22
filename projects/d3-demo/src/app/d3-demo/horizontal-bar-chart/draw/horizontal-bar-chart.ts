import { IccHorizontalBarChart, IccScale, IccScaleLinear } from 'icc';
import * as d3Transition from 'd3-transition';

export class AppHorizontalBarChart<T> extends IccHorizontalBarChart<T> {

  redrawContent(drawName: string, scaleX: IccScaleLinear, scaleY: IccScale): void {
    const drawContents = this.svg.select(drawName).selectAll('g').selectAll('rect')
      .data((d) => this.options.y0(d)).join('rect')
      .attr('class', 'horizontalbar draw')
      .attr('fill', (d: any, i) => this.getBarColor(d, i))
      .attr('y', (d) => scaleY(this.options.y(d)))
      .attr('height', this.scale.getYBarWidth(scaleY, this.data));

    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.drawMouseover(d, true))
        .on('mouseout', (e, d) => this.drawMouseover(d, false));

      this.svg.select(drawName).selectAll('g').selectAll('text')
        .data((d) => this.options.y0(d)).join('text')
        .style('font', 'bold 12px var(--sans-serif)')
        .style('color', 'black')
        .style('font-variant-numeric', 'tabular-nums')
        .attr('text-anchor', 'end')
        .attr('class', 'label')
        .attr('y', (d) => scaleY(this.options.y(d)) + this.scale.getYBarWidth(scaleY, this.data) / 2)
        .attr('x', (d, i) => scaleX(Math.abs(this.options.x(d))) - scaleX(0) - 6)
        .text((d: any) => {
          return d.name + ' ' + d.value;
        });
    }

    if (this.isAnimation && this.options.duration > 0) {
      drawContents
        .attr('x', (d, i) => scaleX(0))
        .attr('width', (d, i) => 0)
        .transition()
        .duration(this.options.duration)
        .attr('x', (d, i) => scaleX(Math.min(0, this.options.x(d))))
        .attr('width', (d, i) => scaleX(Math.abs(this.options.x(d))) - scaleX(0));
    } else {
      drawContents
        .attr('x', (d, i) => scaleX(Math.min(0, this.options.x(d))))
        .attr('width', (d, i) => scaleX(Math.abs(this.options.x(d))) - scaleX(0));
    }
  }
}

