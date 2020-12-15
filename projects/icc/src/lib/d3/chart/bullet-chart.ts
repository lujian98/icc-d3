import * as d3Shape from 'd3-shape';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccScale, IccScaleLinear } from '../model';

export class IccbulletChart<T> extends IccAbstractDraw<T> {
  measures = [250, 215, 145, 142, 140];
  markerLines = [100, 230];
  drawContents(drawName: string, scaleX: IccScaleLinear, scaleY: IccScaleLinear): void {
    this.createDrawElement('bulletMeasures');
    this.createDrawElement('bulletMarkers');
    this.createDrawElement('bulletMarkerLines');
    const drawContents = this.svg.select(drawName).selectAll('g').data(this.data).join('g');
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScaleLinear, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName).selectAll('g').selectAll('rect')
      .data((d) => this.options.y0(d)).join('rect')
      .attr('fill', (d, i) => this.getdrawColor(d, i))
      .style('fill-opacity', (d) => 1)
      .attr('width', (d: any) => {
        const width = scaleX(this.options.x(d)) - scaleX(scaleX.domain()[0]);
        return width > 0 ? width : 0;
      })
      .attr('height', this.options.drawHeight)
      .attr('x', 0);

    this.svg.select('.bulletMeasures').selectAll('rect').data(this.measures).join('rect')
      .attr('fill', (d, i) => 'blue')
      .style('fill-opacity', (d) => 0.1)
      .attr('width', (d: any) => {
        return scaleX(d) > 0 ? scaleX(d) : 0;
      })
      .attr('height', this.options.drawHeight / 3)
      .attr('y', this.options.drawHeight / 3)
      .attr('x', 0);

    const h3 = this.options.drawHeight / 6;
    this.svg.select('.bulletMarkers').selectAll('path.markerTriangle').data(this.measures).join('path')
      .attr('class', 'markerTriangle')
      .attr('fill', (d, i) => 'cyan')
      .attr('transform', (d) => `translate(${scaleX(d)}, ${this.options.drawHeight / 2})`)
      .attr('d', `M0,${h3}L${h3},${-h3} ${-h3},${-h3}Z`);

    this.svg.select('.bulletMarkerLines').selectAll('line.markerLine').data(this.markerLines).join('line')
      .attr('class', 'markerLine')
      .attr('stroke', (d, i) => 'black')
      .attr('cursor', '')
      .attr('stroke-width', 2)
      .attr('x1', (d) => scaleX(d))
      .attr('y1', 2)
      .attr('x2', (d) => scaleX(d))
      .attr('y2', this.options.drawHeight - 2);

    const yAxisDraw = this.svg.select('.yAxisDraw');
    yAxisDraw.selectAll('g').remove();
    const textSize = Math.round(this.options.drawHeight * 1 / 3);
    yAxisDraw.append('g').append('text').attr('class', 'axis bullet-label')
      .style('text-anchor', 'end')
      .style('font', `${textSize}px Courier`)
      .attr('y', this.options.drawHeight / 3 + 2)
      .attr('dx', -5)
      .text(() => 'Power');

    const textSize2 = Math.round(this.options.drawHeight * 1 / 4);
    yAxisDraw.append('g').append('text').attr('class', 'axis bullet-label-unit')
      .style('text-anchor', 'end')
      .style('font', `${textSize2}px Courier`)
      .attr('y', this.options.drawHeight * 2 / 3 + 2)
      .attr('dx', -5)
      .text(() => '(kw)');
  }

  legendMouseover(e, data, mouseover: boolean): void { }
}

