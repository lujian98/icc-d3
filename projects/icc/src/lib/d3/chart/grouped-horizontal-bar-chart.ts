import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccGroupedData } from '../data/grouped-data';
import { IccScaleLinear, IccScaleBand, IccD3Interactive } from '../model';

export class IccGroupedHorizontalBarChart<T> extends IccAbstractDraw<T> {
  protected hoveredIndex = -1;
  protected isGrouped = true;

  setHovered(e, d): void {
    const index = this.getHoveredIndex(e);
    const pd = this.data[index.idx];
    const nd = this.options.y0(pd);
    this.hoveredIndex = index.idx;
    this.hoveredKey = this.options.x0(nd[index.jdx]);
  }

  setValueXY(r: IccD3Interactive, idx: number): void {
    r.valueX = this.options.y(r.value[0]);
    r.valueY = this.options.x(r.value[0]);
  }

  drawChart(data: T[]): void {
    const grouped = new IccGroupedData(this.options);
    const groupeddata = grouped.getGroupedData(data, false);
    super.drawChart(groupeddata);
  }

  drawContents(drawName: string, scaleX: IccScaleLinear, scaleY: IccScaleBand, xGroup: IccScaleBand, yGroup: IccScaleBand): void {
    this.options.useInteractiveGuideline = false;
    const groupName = drawName.replace('.', '');
    this.svg.select(drawName).selectAll('g').data(this.data).join('g').attr('class', `${groupName}Group`);
    this.redrawContent(drawName, scaleX, scaleY, xGroup, yGroup);
  }

  redrawContent(drawName: string, scaleX: IccScaleLinear, scaleY: IccScaleBand, xGroup: IccScaleBand, yGroup: IccScaleBand): void {
    if (drawName === `.${this.chartType}` && scaleY.bandwidth) { // only support band scale
      yGroup.rangeRound([0, scaleY.bandwidth()]);
    }

    this.svg.selectAll(`${drawName}Group`)
      .attr('transform', (d: any) => 'translate(0, ' + scaleY(this.options.y(d)) + ')');

    const drawContents = this.svg.select(drawName).selectAll('g').selectAll('rect')
      .data((d) => this.options.y0(d)).join('rect')
      .attr('class', 'groupbar draw')
      .style('fill-opacity', 0.75)
      .attr('fill', (d, i) => this.getdrawColor(d, i))
      .attr('y', (d: any) => yGroup(this.options.x0(d))) /// MUST BE this.options.x0(d)
      .attr('x', (d: any) => scaleX(Math.min(0, this.options.x(d))))
      .attr('height', yGroup.bandwidth())
      .attr('width', (d: any) => scaleX(Math.abs(this.options.x(d))) - scaleX(0));

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
    this.svg.select('.groupedHorizontalBarChart').selectAll('g').selectAll('.draw')
      .filter((d: any) => this.options.x0(d) === this.options.x0(data) &&
        ((!this.options.y0(data) && this.options.x(d) === this.options.x(data)) || this.options.y0(data)))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75);
  }
}

