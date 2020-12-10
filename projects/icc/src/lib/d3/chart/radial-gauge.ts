import * as d3Shape from 'd3-shape';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccPieData } from '../data/pie-data';
import { IccScale, IccScaleLinear, IccD3Interactive } from '../model';

export class IccRadialGauge<T> extends IccAbstractDraw<T> {
  private sx = 0;
  private sy = 0;
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

  private setPieScaleXY(): void {
    const dAngle = Math.abs(this.options.pie.endAngle - this.options.pie.startAngle);
    if (dAngle <= Math.PI) {
      const sinStart = +Math.sin(this.options.pie.startAngle).toFixed(4);
      const sinEnd = +Math.sin(this.options.pie.endAngle).toFixed(4);
      const cosStart = +Math.cos(this.options.pie.startAngle).toFixed(4);
      const cosEnd = +Math.cos(this.options.pie.endAngle).toFixed(4);
      if (dAngle <= Math.PI / 2) {
        if (sinStart <= 0 && cosStart >= 0 && sinEnd <= 0 && cosEnd >= 0) {
          this.sx = 1;
          this.sy = 1;
        } else if (sinStart >= 0 && cosStart >= 0 && sinEnd >= 0 && cosEnd >= 0) {
          this.sx = -1;
          this.sy = 1;
        } else if (sinStart >= 0 && cosStart <= 0 && sinEnd >= 0 && cosEnd <= 0) {
          this.sx = -1;
          this.sy = -1;
        } else if (sinStart <= 0 && cosStart <= 0 && sinEnd <= 0 && cosEnd <= 0) {
          this.sx = 1;
          this.sy = -1;
        }
      } else {
        if (cosStart >= 0 && cosEnd >= 0 && sinEnd > sinStart) {
          this.sy = 1 / 2;
        } else if (cosStart <= 0 && cosEnd <= 0 && sinEnd < sinStart) {
          this.sy = - 1 / 4;
        } else if (sinStart >= 0 && sinEnd >= 0 && cosEnd < cosStart) {
          this.sx = -1 / 2;
        } else if (sinStart <= 0 && sinEnd <= 0 && cosEnd > cosStart) {
          this.sx = 1 / 2;
        }
      }
    }
  }

  drawChart(data: T[]): void {
    this.setPieScaleXY();
    const pie = new IccPieData(this.options);
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
    const xt = (this.sx + 1) * this.options.drawWidth / 2;
    const yt = (this.sy + 1) * this.options.drawHeight / 2;
    const drawContents = this.svg.select(drawName).selectAll('g').select('.draw')
      .attr('transform', (d: any) => `translate(${xt}, ${yt})`)
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
        center[0] = center[0] + xt;
        center[1] = center[1] + yt;
        return `translate(${center}) rotate(-90) rotate(${midAngle * 180 / Math.PI})`;
      });
  }

  drawArc(grow: number = 0): d3Shape.Arc<any, d3Shape.DefaultArcObject> {
    const radius = Math.min((Math.abs(this.sx) + 1) * this.options.drawWidth, (Math.abs(this.sy) + 1) * this.options.drawHeight) / 2;
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
      .attr('d', mouseover ? this.drawArc(7) : this.drawArc());
  }

  legendMouseover(e, data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').select('.draw')
      .filter((d: any) => [d.data].indexOf(data) !== -1)
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75)
      .attr('d', mouseover ? this.drawArc(5) : this.drawArc());
  }
}

