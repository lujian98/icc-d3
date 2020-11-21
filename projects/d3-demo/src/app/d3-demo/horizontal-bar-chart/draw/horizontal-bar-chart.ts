import { IccAbstractDraw } from 'icc';
import * as d3Transition from 'd3-transition';

export class AppHorizontalBarChart<T> extends IccAbstractDraw<T> {

  drawContents(drawName, scaleX, scaleY): void {
    const drawContents = this.svg.select(drawName).selectAll('g').data(this.data).join('g')
      .attr('fill', (d, i) => this.getdrawColor(d, i));

    if (drawName === `.${this.chartType}`) {
      drawContents.attr('class', 'horizontalbar series').style('fill-opacity', 0.75);
    }
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName, scaleX, scaleY) {
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
          // console.log( ' d =', d);
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

  public legendMouseover(data, mouseover: boolean) {
    this.svg.select(`.${this.chartType}`).selectAll('g').select('.draw')
      .style('fill-opacity', (d) => mouseover ? null : 0.75);

    this.svg.select(`.${this.chartType}`).selectAll('.series')
      .filter((d: any, i) => this.options.x0(d) === this.options.x0(data))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75);
  }

  private drawMouseover(data, mouseover: boolean) {
    this.svg.select(`.${this.chartType}`).selectAll('g').selectAll('.draw')
      .filter((d: any) => this.options.y(d) === this.options.y(data))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75);
  }
}

