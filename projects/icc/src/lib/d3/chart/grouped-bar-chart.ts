import * as d3 from 'd3-selection';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccGroupedData } from '../data/grouped-data';
import { IccScaleLinear, IccScaleBand } from '../model';

export class IccGroupedBarChart<T> extends IccAbstractDraw<T> {
  protected hoveredIndex = -1;
  protected isGrouped = true;

  drawChart(data: T[]): void {
    const grouped = new IccGroupedData(this.options);
    const groupeddata = grouped.getGroupedData(data, true);
    super.drawChart(groupeddata);
  }

  drawContents(drawName: string, scaleX: IccScaleBand, scaleY: IccScaleLinear, xGroup: IccScaleBand): void {
    this.options.useInteractiveGuideline = false;
    const groupName = drawName.replace('.', '');
    this.svg.select(drawName).selectAll('g').data(this.data).join('g').attr('class', `${groupName}Group`);
    this.redrawContent(drawName, scaleX, scaleY, xGroup);
  }

  redrawContent(drawName: string, scaleX: IccScaleBand, scaleY: IccScaleLinear, xGroup: IccScaleBand): void {
    if (drawName === `.${this.chartType}` && scaleX.bandwidth) { // only support band scale
      xGroup.rangeRound([0, scaleX.bandwidth()]);
    }

    this.svg.selectAll(`${drawName}Group`)
      .attr('transform', (d: any) => 'translate(' + scaleX(this.options.x(d)) + ',0)');

    const drawContents = this.svg.select(drawName).selectAll('g').selectAll('rect')
      .data((d) => this.options.y0(d)).join('rect')
      .attr('class', 'groupbar draw')
      .style('fill-opacity', 0.75)
      .attr('fill', (d, i) => this.getdrawColor(d, i))
      .attr('x', (d: any) => xGroup(this.options.x0(d)))
      .attr('y', (d: any) => scaleY(Math.max(0, this.options.y(d))))
      .attr('width', xGroup.bandwidth())
      .attr('height', (d: any) => scaleY(0) - scaleY(Math.abs(this.options.y(d))));

    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.legendMouseover(e, d, true))
        .on('mouseout', (e, d) => this.legendMouseover(e, d, false));
    }
  }

  legendMouseover(e, data, mouseover: boolean): void {
    if (e) {
      if (mouseover) {
        this.setHovered(e, data);
      } else {
        this.hoveredKey = null;
        this.hoveredIndex = -1;
      }
    }
    this.svg.select(`.${this.chartType}`).selectAll('g').selectAll('.draw')
      .filter((d: any) => this.options.x0(d) === this.options.x0(data) &&
        ((!this.options.y0(data) && this.options.y(d) === this.options.y(data)) || this.options.y0(data)))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75);
  }

  setHovered(e, d): any {
    const group = this.svg.select(`.${this.chartType}`).selectAll('g');
    const nodes = group.nodes();
    const data: any = group.data();
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
    const pd = data[i];
    const nd = this.options.y0(pd);
    this.hoveredIndex = i;
    this.hoveredKey = this.options.x0(nd[j]);
    // console.log( ' i =', i, ' j =', j, ' nd =', nd, ' pd =', pd);
    // console.log(' i=', i, '  this.hoveredIndex = ',  this.hoveredIndex, ' this.hoveredKey  = ', this.hoveredKey )
  }
}

