import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccScale, IccScaleLinear } from '../model';

export class IccBarChart<T> extends IccAbstractDraw<T> {
  protected hoveredIndex = -1;

  setHovered(e, d): void {
    const index = this.getHoveredIndex(e);
    this.hoveredKey = this.options.x0(this.data[index.idx]);
    this.hoveredIndex = index.jdx;
  }

  drawContents(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName).selectAll('g').data(this.data).join('g')
      .attr('fill', (d, i) => this.getdrawColor(d, i));

    if (drawName === `.${this.chartType}`) {
      drawContents.attr('class', 'barChart series').style('fill-opacity', 0.75);
    }
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName).selectAll('g').selectAll('rect')
      .data((d) => this.options.y0(d)).join('rect')
      .attr('class', 'bar draw')
      .attr('fill', (d, i) => this.getBarColor(d, i))
      .attr('x', (d, i) => scaleX(this.options.x(d)))
      .attr('width', this.scale.getXBarWidth(scaleX, this.data));
    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.drawMouseover(e, d, true))
        .on('mouseout', (e, d) => this.drawMouseover(e, d, false));
    }
    if (this.isAnimation && this.options.duration > 0) {
      drawContents
        .attr('y', (d, i) => scaleY(0))
        .attr('height', (d, i) => 0)
        .transition()
        .duration(this.options.duration)
        .attr('y', (d, i) => scaleY(Math.max(0, this.options.y(d))))
        .attr('height', (d, i) => scaleY(0) - scaleY(Math.abs(this.options.y(d))));
    } else {
      drawContents
        .attr('y', (d, i) => scaleY(Math.max(0, this.options.y(d))))
        .attr('height', (d, i) => scaleY(0) - scaleY(Math.abs(this.options.y(d))));
    }
  }

  legendMouseover(e, data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').selectAll('.draw')
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
      .filter((d) => this.options.x(d) === this.options.x(data))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75);
  }
}

