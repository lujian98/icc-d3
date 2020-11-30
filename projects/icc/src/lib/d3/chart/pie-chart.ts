import * as d3Shape from 'd3-shape';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccPieData } from '../data/pie-data';
import { IccScale, IccScaleLinear } from '../model';

export class IccPieChart<T> extends IccAbstractDraw<T> {

  drawChart(data: T[]): void {
    const pie = new IccPieData(this.options);
    const piedata = pie.getPieData(data);
    super.drawChart(piedata);
  }

  drawContents(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName)
      .attr('stroke', 'white')
      .selectAll('g').data(this.data).join('g')
      .append('path')
      .attr('transform', (d: any) => `translate(${this.options.drawWidth / 2}, ${this.options.drawHeight / 2})`)
      .attr('class', 'arc draw')
      .style('fill-opacity', 0.75);
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName).selectAll('g').select('.draw')
      .attr('fill', (d: any, i) => this.getdrawColor(d.data, i))
      .attr('d', this.drawArc());
    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.drawMouseover(e, d, true))
        .on('mouseout', (e, d) => this.drawMouseover(e, d, false));
    }
  }

  drawArc(grow: number = 0): d3Shape.Arc<any, d3Shape.DefaultArcObject> {
    const radius = Math.min(this.options.drawWidth, this.options.drawHeight) / 2;
    return d3Shape.arc()
      .innerRadius(radius * 0.67) // TODO options
      .outerRadius(radius - 10 + grow);
  }

  drawMouseover(e, data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').select('.draw')
      .attr('fill', (d: any, i) => this.getdrawColor(d.data, i))
      .filter((d: any) => d.index === data.index)
      .transition().duration(50)
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75)
      .attr('d', mouseover ? this.drawArc(5) : this.drawArc());
  }

  legendMouseover(e, data, mouseover: boolean): void {
    if (e) {
      // this.hoveredKey = mouseover ? this.options.x0(data) : null;
    }

    this.svg.select(`.${this.chartType}`).selectAll('g').select('.draw')
      .attr('fill', (d: any, i) => this.getdrawColor(d.data, i))
      .filter((d: any) => [d.data].indexOf(data) !== -1)
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75)
      .attr('d', mouseover ? this.drawArc(5) : this.drawArc());
  }
}

