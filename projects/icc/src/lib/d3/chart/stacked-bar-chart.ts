import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccStackedData } from '../data/stacked-data';
import { IccScale, IccScaleLinear } from '../model';

export class IccStackedBarChart<T> extends IccAbstractDraw<T> {
  drawData: T[];

  drawChart(data: T[]): void {
    this.drawData = data;
    this.isStacked = true;
    const stacked = new IccStackedData(this.svg, this.scale, this.options, this.chartType);
    const stackdata = data.length > 0 ? stacked.getStackedData(data, true) : [];
    if (data.length > 0) {
      stacked.setStackedYDomain(stackdata);
    }
    super.drawChart(stackdata);
  }

  drawContents(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    this.svg.select(drawName).selectAll('g').data(this.data).join('g')
      .attr('class', 'stackedbar series')
      .attr('fill-opacity', 0.75)
      .attr('fill', (d, i) => this.getStackeddrawColor(d, i));
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName).selectAll('g').selectAll('rect')
      .data((d: any) => d).join('rect')
      .attr('class', 'stackedbar draw')
      .attr('x', (d: any) => scaleX(this.options.x(d.data)))
      .attr('y', d => scaleY(d[1]))
      .attr('height', d => scaleY(d[0]) - scaleY(d[1]))
      .attr('width', this.scale.getXBarWidth(scaleX, this.drawData));

    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.drawMouseover(d, true))
        .on('mouseout', (e, d) => this.drawMouseover(d, false));
    }
  }

  legendMouseover(e, data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').selectAll('.draw')
      .style('fill-opacity', (d) => mouseover ? null : 0.75);

    this.svg.select(`.${this.chartType}`).selectAll('.series')
      .filter((d: any, i) => d.key === this.options.x0(data)) // key is from stacked data
      .style('fill-opacity', (d) => mouseover ? 0.9 : null);
  }

  drawMouseover(data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').selectAll('.draw')
      .filter((d: any, i) => data.data && this.options.x(d.data) === this.options.x(data.data))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75);
  }
}

