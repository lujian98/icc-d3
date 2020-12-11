import * as d3Shape from 'd3-shape';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccPieData } from '../data/pie-data';
import { IccScale, IccScaleLinear, IccD3Interactive, IccPosition } from '../model';

export class IccPieChart<T> extends IccAbstractDraw<T> {
  private sxy: IccPosition;
  private outterRadius: number;

  getDrawData(idx: number, data: T): IccD3Interactive[] {
    return this.options.y0(data).filter((d) => idx > -1 && !d.disabled)
      .map((d, i) => {
        return {
          key: this.options.x(d),
          value: d,
          color: d.color || this.getdrawColor(d, idx),
          valueX: null,
          valueY: this.options.y(d),
          cy: null,
          hovered: i === idx,
          hasSummary: true
        };
      });
  }

  drawChart(data: T[]): void {
    const pie = new IccPieData(this.options);
    pie.pieOptions = this.options.pie;
    this.sxy = pie.setPieScaleXY();
    this.outterRadius = Math.round(Math.min((Math.abs(this.sxy.x) + 1) * this.options.drawWidth,
      (Math.abs(this.sxy.y) + 1) * this.options.drawHeight) / 2);
    const piedata = pie.getPieData(data);
    super.drawChart(piedata);
  }

  drawContents(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName)
      .selectAll('g').data(this.data).join('g')
      .append('path')
      .attr('class', 'arc draw')
      .style('fill-opacity', 0.75);

    this.svg.select(`${drawName}Label`)
      .selectAll('g').data(this.data).join('g')
      .append('text')
      .attr('class', 'drawlabel');

    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const cx = (this.sxy.x + 1) * this.options.drawWidth / 2 + this.outterRadius * this.options.pie.centerOffsetX;
    const cy = (this.sxy.y + 1) * this.options.drawHeight / 2 + this.outterRadius * this.options.pie.centerOffsetY;
    const drawContents = this.svg.select(drawName).selectAll('g').select('.draw')
      .attr('transform', (d: any) => `translate(${cx}, ${cy})`)
      .attr('fill', (d: any, i) => this.getdrawColor(d.data, i))
      .attr('d', this.drawArc());
    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.drawMouseover(e, d, true))
        .on('mouseout', (e, d) => this.drawMouseover(e, d, false));
    }
    this.svg.select(`${drawName}Label`).selectAll('g').select('.drawlabel')
      .text((d: any) => this.options.x(d.data))
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('transform', (d: any) => {
        const center = this.drawArc().centroid(d);
        const avg = (d.startAngle + d.endAngle) / 2;
        const angle = avg - 2 * Math.PI * (Math.floor(avg / (2 * Math.PI)));
        const midAngle = angle < Math.PI ? angle : angle + Math.PI;
        center[0] = center[0] + cx;
        center[1] = center[1] + cy;
        return `translate(${center}) rotate(-90) rotate(${midAngle * 180 / Math.PI})`;
      });
  }

  drawArc(grow: number = 0): d3Shape.Arc<any, d3Shape.DefaultArcObject> {
    return d3Shape.arc()
      .innerRadius(this.outterRadius * Math.min(0.95, this.options.pie.donut))
      .outerRadius(this.outterRadius - 10 + grow);
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
      .attr('d', mouseover ? this.drawArc(7) : this.drawArc());
  }

  legendMouseover(e, data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').select('.draw')
      .filter((d: any) => [d.data].indexOf(data) !== -1)
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75)
      .attr('d', mouseover ? this.drawArc(5) : this.drawArc());
  }
}

