import * as d3Shape from 'd3-shape';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccPieData } from '../data/pie-data';
import { IccScale, IccScaleLinear, IccD3Interactive } from '../model';

export class IccPieChart<T> extends IccAbstractDraw<T> {

  getDrawData(idx: number, data: T): IccD3Interactive[] {
    return this.options.y0(data).map((d, i) => {
      return {
        key: this.options.x(d),
        value: d,
        color: d.color || this.getdrawColor(d, idx),
        valueX: null,
        valueY: this.options.y(d),
        cy: null,
        hovered: i === idx,
        hasSummary: null
      };
    });
  }

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
      .innerRadius(radius * Math.min(0.95, this.options.pie.donut))
      .outerRadius(radius - 10 + grow);
  }

  drawMouseover(e, data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').select('.draw')
      .filter((d: any) => {
        if (d.index === data.index) {
          if (mouseover) {
            this.hoveredKey = this.options.x(d.data);
            this.hoveredIndex = d.index;
          } else {
            this.hoveredKey = null;
            this.hoveredIndex = -1;
          }
          return true;
        }
      })
      .transition().duration(50)
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75)
      .attr('d', mouseover ? this.drawArc(5) : this.drawArc());
  }

  legendMouseover(e, data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').select('.draw')
      .filter((d: any) => [d.data].indexOf(data) !== -1)
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75)
      .attr('d', mouseover ? this.drawArc(5) : this.drawArc());
  }
}

