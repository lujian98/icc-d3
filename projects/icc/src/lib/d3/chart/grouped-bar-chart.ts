import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccGroupedData } from '../data/grouped-data';
import { IccScaleLinear, IccScaleBand } from '../model';

export class IccGroupedBarChart<T> extends IccAbstractDraw<T> {
  protected hoveredIndex = -1;
  protected isGrouped = true;

  setHovered(e, d): void {
    const index = this.getHoveredIndex(e);
    const pd = this.data[index.idx];
    const nd = this.options.y0(pd);
    this.hoveredIndex = index.idx;
    this.hoveredKey = this.options.x0(nd[index.jdx]);
  }

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
      .attr('transform', (d) => 'translate(' + scaleX(this.options.x(d)) + ',0)');

    const drawContents = this.svg.select(drawName).selectAll('g').selectAll('rect')
      .data((d) => this.options.y0(d)).join('rect')
      .attr('class', 'groupbar draw')
      .style('fill-opacity', 0.75)
      .attr('fill', (d, i) => this.getdrawColor(d, i))
      .attr('x', (d) => xGroup(this.options.x0(d)))
      .attr('y', (d) => scaleY(Math.max(0, this.options.y(d))))
      .attr('width', xGroup.bandwidth())
      .attr('height', (d) => scaleY(0) - scaleY(Math.abs(this.options.y(d))));

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
      .filter((d) => this.options.x0(d) === this.options.x0(data) &&
        ((!this.options.y0(data) && this.options.y(d) === this.options.y(data)) || this.options.y0(data)))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75);
  }
}

