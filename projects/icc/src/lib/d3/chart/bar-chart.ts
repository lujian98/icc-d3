import * as d3 from 'd3-selection';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccScale, IccScaleLinear, IccD3Popover } from '../model';

export class IccBarChart<T> extends IccAbstractDraw<T> {

  drawContents(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName).selectAll('g').data(this.data).join('g')
      .attr('fill', (d, i) => this.getdrawColor(d, i));

    if (drawName === `.${this.chartType}`) {
      drawContents.attr('class', 'barChart series').style('fill-opacity', 0.75);
    }
    this.redrawContent(drawName, scaleX, scaleY);
  }

  getInteractiveCy(r: any): number {
    return null;
  }

  getPopoverData(e, d): any {
    const group = this.svg.select(`.${this.chartType}`).selectAll('g');
    const nodes = group.nodes();
    const data = group.data();
    const node = d3.select(e.target).node();
    let i = -1;
    let j = -1;
    nodes.forEach((n, k) => {
      if (j === -1) {
        const pnodes = d3.select(n).selectAll('rect').nodes();
        j = pnodes.indexOf(node);
        if (j > -1) {
          i = k;
        }
      }
    });
    const pcolor = this.getBarColor(d, j) || this.getdrawColor(data[i], i);
    const pd = {
      value: this.options.popover.axisFormatter(this.options.x(d)),
      series: [
        {
          key: this.options.popover.serieFormatter(this.options.x0(data[i])),
          value: this.options.popover.valueFormatter(this.options.y(d)),
          color: pcolor
        }
      ]
    };
    return { idx: i, jdx: j };
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
        .on('mouseover', (e: any, d) => {
          this.drawMouseover(d, true);
          const index = this.getPopoverData(e, d); // TODO clean up here
          const data = this.data[index.idx];
          this.hoveredKey = this.options.x0(data);
          this.dispatch.call('drawMouseover', this, { event: e, index: index.jdx });
        })
        .on('mouseout', (e, d) => {
          this.drawMouseover(d, false);
          this.hoveredKey = null;
          this.dispatch.call('drawMouseout', this, { event: e, index: -1 });
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

  legendMouseover(e, data, mouseover: boolean): void {
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

