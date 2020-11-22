import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccStackedData } from '../data/stacked-data';
import { IccScale, IccScaleLinear } from '../model/model';

export class IccStackedHorizontalBarChart<T> extends IccAbstractDraw<T> {
  drawData: T[];

  drawChart(data: T[]): void {
    this.drawData = data;
    this.isStacked = true;
    const stacked = new IccStackedData(this.svg, this.scale, this.options, this.chartType);
    const stackdata = data.length > 0 ? stacked.getStackedData(data, false) : [];
    if (data.length > 0) {
      stacked.setStackedXDomain(stackdata);
    }
    super.drawChart(stackdata);
  }

  drawContents(drawName: string, scaleX: IccScaleLinear, scaleY: IccScale): void {
    this.svg.select(drawName).selectAll('g').data(this.data).join('g')
      .attr('class', 'stackedhorizontalbar series')
      .attr('fill-opacity', 0.75)
      .attr('fill', (d, i) => this.getStackeddrawColor(d, i));
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScaleLinear, scaleY: IccScale): void {
    const drawContents = this.svg.select(drawName).selectAll('g').selectAll('rect')
      .data((d: any) => d).join('rect')
      .attr('class', 'stackedhorizontalbar draw')
      .attr('x', (d, i) => scaleX(d[0]))
      .attr('y', (d: any) => scaleY(this.options.y(d.data)))
      .attr('height', this.scale.getYBarWidth(scaleY, this.drawData))
      .attr('width', (d, i) => scaleX(d[1]) - scaleX(d[0]));

    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.drawMouseover(d, true))
        .on('mouseout', (e, d) => this.drawMouseover(d, false));
    }
  }

  legendMouseover(data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').selectAll('.draw')
      .style('fill-opacity', (d) => mouseover ? null : 0.75);

    this.svg.select(`.${this.chartType}`).selectAll('.series')
      .filter((d: any, i) => d.key === this.options.x0(data))
      .style('fill-opacity', (d) => mouseover ? 0.9 : null);
  }

  drawMouseover(data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').selectAll('.draw')
      .filter((d: any, i) => data.data && this.options.y(d.data) === this.options.y(data.data))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75);
  }
}

