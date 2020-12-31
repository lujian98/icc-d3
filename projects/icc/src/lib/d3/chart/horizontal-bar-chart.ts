import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccScale, IccScaleLinear, IccD3Interactive } from '../model';

export class IccHorizontalBarChart<T> extends IccAbstractDraw<T> {
  protected hoveredIndex = -1;

  setHovered(e, d): void {
    const index = this.getHoveredIndex(e);
    this.hoveredKey = this.options.x0(this.data[index.idx]);
    this.hoveredIndex = index.jdx;
  }

  setValueXY(r: IccD3Interactive, idx: number): void {
    r.valueX = this.options.y(r.value[0]);
    r.valueY = this.options.x(r.value[0]);
  }

  drawContents(drawName: string, scaleX: IccScaleLinear, scaleY: IccScale): void {
    this.options.useInteractiveGuideline = false;
    const drawContents = this.svg.select(drawName).selectAll('g').data(this.data).join('g')
      .attr('fill', (d, i) => this.getdrawColor(d, i));

    if (drawName === `.${this.chartType}`) {
      drawContents.attr('class', 'horizontalbar series').style('fill-opacity', 0.75);
    }
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScaleLinear, scaleY: IccScale): void {
    const drawContents = this.svg.select(drawName).selectAll('g').selectAll('rect')
      .data((d) => this.options.y0(d)).join('rect')
      .attr('class', 'horizontalbar draw')
      .attr('fill', (d, i) => this.getBarColor(d, i))
      .attr('y', (d) => scaleY(this.options.y(d)))
      .attr('height', this.scale.getYBarWidth(scaleY, this.data));

    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.drawMouseover(e, d, true))
        .on('mouseout', (e, d) => this.drawMouseover(e, d, false));
    }

    if (this.isAnimation && this.options.duration > 0) {
      drawContents
        .attr('x', (d, i) => scaleX(0))
        .attr('width', (d, i) => 0)
        .transition()
        .duration(this.options.duration)
        .attr('x', (d, i) => scaleX(Math.min(0, this.options.x(d))))
        .attr('width', (d, i) => scaleX(Math.abs(this.options.x(d))) - scaleX(0));
    } else {
      drawContents
        .attr('x', (d, i) => scaleX(Math.min(0, this.options.x(d))))
        .attr('width', (d, i) => scaleX(Math.abs(this.options.x(d))) - scaleX(0));
    }
  }

  legendMouseover(e, data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').select('.draw')
      .style('fill-opacity', (d) => mouseover ? null : 0.75);

    this.svg.select(`.${this.chartType}`).selectAll('.series')
      .filter((d, i) => this.options.x0(d) === this.options.x0(data))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75);
  }

  drawMouseover(e, data, mouseover: boolean): void {
    if (mouseover) {
      this.setHovered(e, data);
    } else {
      this.hoveredKey = null;
      this.hoveredIndex = -1;
    }
    this.svg.select(`.${this.chartType}`).selectAll('g').selectAll('.draw')
      .filter((d) => this.options.y(d) === this.options.y(data))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75);
  }
}

