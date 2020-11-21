import { IccAbstractDraw } from '../draw/abstract-draw';

export class IccCandleStickBarChart<T> extends IccAbstractDraw<T> {

  drawContents(drawName, scaleX, scaleY): void {
    this.svg.select(drawName).selectAll('g').data(this.data).join('g');
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName, scaleX, scaleY): void {
    const barWidth = this.getBarWidth(drawName, scaleX);

    this.svg.select(drawName).selectAll('g').selectAll('rect')
      .data((d) => this.options.y0(d)).join('rect')
      .attr('class', 'candlestick draw')
      .attr('x', (d, i) => scaleX(this.options.x(d)))
      .attr('y', (d: any) => scaleY(Math.max(d.open, d.close)))
      .attr('width', barWidth)
      .attr('height', (d: any) => {
        return (d.open === d.close) ? 1 :
          scaleY(Math.min(d.open, d.close)) - scaleY(Math.max(d.open, d.close));
      })
      .attr('fill', (d: any) => (d.open === d.close) ? 'silver' : (d.open > d.close) ? 'red' : 'green');

    this.svg.select(drawName).selectAll('g').selectAll('line')
      .data((d) => this.options.y0(d))
      .join('line')
      .attr('class', 'candlestick stem')
      .attr('x1', (d, i) => scaleX(this.options.x(d)) + barWidth / 2)
      .attr('x2', (d, i) => scaleX(this.options.x(d)) + barWidth / 2)
      .attr('y1', (d: any) => scaleY(d.high))
      .attr('y2', (d: any) => scaleY(d.low))
      .attr('stroke', (d: any) => (d.open === d.close) ? 'white' : (d.open > d.close) ? 'red' : 'green');
  }

  legendMouseover(data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').select('.draw')
      .filter((d: any) => this.options.x0(d) === this.options.x0(data) &&
        ((!this.options.y0(data) && this.options.y(d) === this.options.y(data)) || this.options.y0(data)))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75);
  }

  private getBarWidth(drawName, scaleX): number {
    if (this.data.length > 0) {
      const range = scaleX.range();
      const barWidth = (range[1] / this.options.y0(this.data[0]).length) * .45;
      let scale = 1;
      if (drawName === `.${this.chartType}`) {
        const xdomain = scaleX.domain();
        scale = (range[1] - range[0]) / (this.scale.x2(xdomain[1]) - this.scale.x2(xdomain[0]));
      }
      return Math.max(1, barWidth * scale);
    }
  }
}

