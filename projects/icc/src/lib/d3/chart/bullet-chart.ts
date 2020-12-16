import * as d3Array from 'd3-array';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccScaleLinear } from '../model';

export class IccbulletChart<T> extends IccAbstractDraw<T> {
  setRangeScale(data: any[]): void {
    const minv = d3Array.min(data[0].range, (d: any) => +d.value);
    const maxv = d3Array.max(data[0].range, (d: any) => +d.value);
    this.scale.x.domain([minv, maxv]);
    this.scale.x2.domain([minv, maxv]);
    this.svg.select('.axis--x').call(this.scale.xAxis);
  }

  drawContents(drawName: string, scaleX: IccScaleLinear, scaleY: IccScaleLinear): void {
    this.setRangeScale(this.data);
    this.createDrawElement('bulletMeasures', true);
    this.createDrawElement('bulletMarkers', true);
    this.createDrawElement('bulletMarkerLines', true);
    const drawContents = this.svg.select(drawName).selectAll('g').data(this.data).join('g');
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScaleLinear, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName).selectAll('g').selectAll('rect')
      .data((d: any) => d.range).join('rect')
      .attr('fill', (d, i) => this.getdrawColor(d, i))
      .style('fill-opacity', (d) => 1)
      .attr('width', (d: any) => {
        const width = scaleX(this.options.x(d)) - scaleX(scaleX.domain()[0]);
        return width > 0 ? width : 0;
      })
      .attr('height', this.options.drawHeight)
      .attr('x', 0);

    const measures = this.options.y0(this.data[0]); // TODO sort in the bullet chart
    this.svg.select('.bulletMeasures').selectAll('rect').data(measures).join('rect')
      .attr('fill', (d, i) => 'blue')
      .style('fill-opacity', (d) => 0.1)
      .attr('width', (d: any) => {
        return scaleX(this.options.x(d)) > 0 ? scaleX(this.options.x(d)) : 0;
      })
      .attr('height', this.options.drawHeight / 3)
      .attr('y', this.options.drawHeight / 3)
      .attr('x', 0);

    const h3 = this.options.drawHeight / 6;
    this.svg.select('.bulletMarkers').selectAll('path.markerTriangle').data(measures).join('path')
      .attr('class', 'markerTriangle')
      .attr('fill', (d, i) => 'cyan')
      .attr('transform', (d) => `translate(${scaleX(this.options.x(d))}, ${this.options.drawHeight / 2})`)
      .attr('d', `M0,${h3}L${h3},${-h3} ${-h3},${-h3}Z`);

    const markerLines = this.data[0]['markerLines'];
    this.svg.select('.bulletMarkerLines').selectAll('line.markerLine').data(markerLines).join('line')
      .attr('class', 'markerLine')
      .attr('stroke', (d, i) => 'black')
      .attr('cursor', '')
      .attr('stroke-width', 2)
      .attr('x1', (d: any) => scaleX(d))
      .attr('y1', 2)
      .attr('x2', (d: any) => scaleX(d))
      .attr('y2', this.options.drawHeight - 2);

    const yAxisDraw = this.svg.select('.yAxisDraw');
    yAxisDraw.selectAll('g').remove();
    const textSize = Math.round(this.options.drawHeight * 1 / 3);
    yAxisDraw.append('g').append('text').attr('class', 'axis bullet-label')
      .style('text-anchor', 'end')
      .style('font', `${textSize}px Courier`)
      .attr('y', this.options.drawHeight / 3 + 2)
      .attr('dx', -5)
      .text((d) => this.options.x0(this.data[0]));

    const textSize2 = Math.round(this.options.drawHeight * 1 / 4);
    yAxisDraw.append('g').append('text').attr('class', 'axis bullet-label-unit')
      .style('text-anchor', 'end')
      .style('font', `${textSize2}px Courier`)
      .attr('y', this.options.drawHeight * 2 / 3 + 2)
      .attr('dx', -5)
      .text(() => this.data[0]['unit']);
  }

  legendMouseover(e, data, mouseover: boolean): void { }
}

