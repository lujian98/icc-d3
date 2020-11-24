import * as d3Shape from 'd3-shape';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccStackedData } from '../data/stacked-data';
import { IccScale, IccScaleLinear } from '../model';

export class IccStackedAreaChart<T> extends IccAbstractDraw<T> {

  drawChart(data: any[]): void {
    this.isStacked = true;
    const stacked = new IccStackedData(this.svg, this.scale, this.options, this.chartType);
    const stackdata = data.length > 0 ? stacked.getStackedData(data, true) : [];
    if (data.length > 0) {
      stacked.setStackedYDomain(stackdata);
    }
    super.drawChart(stackdata);
  }

  drawContents(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName).selectAll('g').data(this.data).join('g')
      .append('path')
      .attr('class', 'stackedarea draw')
      .attr('fill-opacity', 0.5);

    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.legendMouseover(d, true))
        .on('mouseout', (e, d) => this.legendMouseover(d, false));
    }
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContent = d3Shape.area()
      .x((d: any) => scaleX(this.options.x(d.data)))
      .y0((d: any) => scaleY(d[0]))
      .y1((d: any) => scaleY(d[1]));
    this.svg.select(drawName).selectAll('g').select('.draw')
      .attr('fill', (d, i) => this.getStackeddrawColor(d, i))
      .attr('d', drawContent);
  }

  legendMouseover(data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').select('.draw')
      .filter((d: any) => d.key === this.options.x0(data)) // key is from stacked data
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.5);
  }
}

