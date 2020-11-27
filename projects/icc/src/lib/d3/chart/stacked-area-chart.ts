import * as d3Shape from 'd3-shape';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccStackedData } from '../data/stacked-data';
import { IccScale, IccScaleLinear } from '../model';

export class IccStackedAreaChart<T> extends IccAbstractDraw<T> {

  getDrawData(idx, data): {} {
    const d = data[idx];
    const r: any = {
      key: data.key,
      isStacked: true,
      index: data.index,
      hovered: this.hoveredKey === data.key,
      value: d,
      cy: this.scale.y(data[idx][1]),
      color: null
    };
    if (d.data) {
      r.valueX = this.options.x(d.data);
      r.valueY = d[1] - d[0];
    }
    r.color = this.getStackeddrawColor(r, 0);
    return r;
  }

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
        .on('mouseover', (e, d) => this.legendMouseover(e, d, true))
        .on('mouseout', (e, d) => this.legendMouseover(e, d, false));
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

  legendMouseover(e, data, mouseover: boolean): void {
    if (e) {
      this.hoveredKey = mouseover ? data.key : null;
      // this.dispatch.call('drawMouseover', this, { event: e, indexData: mouseover ? data : null });
    }
    this.svg.select(`.${this.chartType}`).selectAll('g').select('.draw')
      .filter((d: any) => d.key === this.options.x0(data)) // key is from stacked data
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.5);
  }
}

