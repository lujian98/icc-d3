import * as d3 from 'd3-selection';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccScale, IccScaleLinear } from '../model';

export class IccHorizontalBarChart<T> extends IccAbstractDraw<T> {
  protected hoveredIndex = -1;
  getInteractiveCy = (r: any) => null;

  getLinearData(idx, data): {} {
    const r: any = {};
    for (const [k, v] of Object.entries(data)) {
      if (!Array.isArray(data[k])) {
        r[k] = v;
      } else {
        r.value = data[k].filter((t, i) => i === idx);
        if (r.value.length > 0) {
          r.valueX = this.options.y(r.value[0]); // changed
          r.valueY = this.options.x(r.value[0]); // changed
          r.cy = this.getInteractiveCy(r);
          r.color = r.value[0].color || this.getdrawColor(r, idx);
        }
      }
    }
    r.key = this.options.x0(r);
    r.hovered = this.hoveredKey === r.key;
    r.hasSummary = this.isGrouped;
    return r;
  }

  setHovered(e, d): any {
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
    this.hoveredKey = this.options.x0(data[i]);
    this.hoveredIndex = j;
    // console.log( ' this.hoveredIndex= ', this.hoveredIndex, 'this.hoveredKey = ', this.hoveredKey )
  }

  drawContents(drawName: string, scaleX: IccScaleLinear, scaleY: IccScale): void {
    this.options.useInteractiveGuideline = false;
    const drawContents = this.svg.select(drawName).selectAll('g').data(this.data).join('g')
      .attr('fill', (d, i) => this.getdrawColor(d, i));

    if (drawName === `.${this.chartType}`) {
      drawContents.attr('class', 'horizontalbar series').style('fill-opacity', 0.75);
    }
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScaleLinear, scaleY: IccScale): void {
    const drawContents = this.svg.select(drawName).selectAll('g').selectAll('rect')
      .data((d) => this.options.y0(d)).join('rect')
      .attr('class', 'horizontalbar draw')
      .attr('fill', (d: any, i) => this.getBarColor(d, i))
      .attr('y', (d) => scaleY(this.options.y(d)))
      .attr('height', this.scale.getYBarWidth(scaleY, this.data));

    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e: any, d) => {
          this.drawMouseover(d, true);
          this.setHovered(e, d);
        })
        .on('mouseout', (e, d) => {
          this.drawMouseover(d, false);
          this.hoveredKey = null;
          this.hoveredIndex = -1;
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

  legendMouseover(e, data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').select('.draw')
      .style('fill-opacity', (d) => mouseover ? null : 0.75);

    this.svg.select(`.${this.chartType}`).selectAll('.series')
      .filter((d: any, i) => this.options.x0(d) === this.options.x0(data))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75);
  }

  drawMouseover(data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').selectAll('.draw')
      .filter((d: any) => this.options.y(d) === this.options.y(data))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75);
  }
}

