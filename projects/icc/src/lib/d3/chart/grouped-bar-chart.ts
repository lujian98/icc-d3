import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccGroupedData } from '../data/grouped-data';

export class IccGroupedBarChart<T> extends IccAbstractDraw<T> {

  drawChart(data: any[]): void {
    const grouped = new IccGroupedData(this.options);
    const groupeddata = grouped.getGroupedData(data, true);
    super.drawChart(groupeddata);
  }

  drawContents(drawName, scaleX, scaleY, xGroup): void {
    const groupName = drawName.replace('.', '');
    this.svg.select(drawName).selectAll('g').data(this.data).join('g').attr('class', `${groupName}Group`);
    this.redrawContent(drawName, scaleX, scaleY, xGroup);
  }

  redrawContent(drawName, scaleX, scaleY, xGroup): void {
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
        .on('mouseover', (e, d) => this.legendMouseover(d, true))
        .on('mouseout', (e, d) => this.legendMouseover(d, false));
    }
  }

  legendMouseover(data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').selectAll('.draw')
      .filter((d: any) => this.options.x0(d) === this.options.x0(data) &&
        ((!this.options.y0(data) && this.options.y(d) === this.options.y(data)) || this.options.y0(data)))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75);
  }
}

