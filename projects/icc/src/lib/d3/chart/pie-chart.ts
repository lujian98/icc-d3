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
      .attr('class', 'arc draw');
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawArc: any = d3Shape.arc()
      .innerRadius(50)
      .outerRadius(Math.min(this.options.drawWidth, this.options.drawHeight) / 2 - 10);

    this.svg.select(drawName).selectAll('g').select('.draw')
      .attr('fill', (d: any, i) => this.getdrawColor(d.data, i))
      .attr('d', drawArc);
  }

  legendMouseover(e, data, mouseover: boolean): void {
    if (e) {
      // this.hoveredKey = mouseover ? this.options.x0(data) : null;
    }
    /*
    this.svg.select(`.${this.chartType}`).selectAll('g').select('.draw')
      .filter((d: any) => this.options.x0(d) === this.options.x0(data))
      .attr('stroke-width', (d) => mouseover ? 2.0 : 1.0); */
  }
}

