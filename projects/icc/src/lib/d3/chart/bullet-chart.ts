import * as d3Array from 'd3-array';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccScaleLinear, IccD3Range, IccD3BulletChartData } from '../model';
import { IccUtils } from '../../utils/utils';

export class IccbulletChart<T> extends IccAbstractDraw<T> {

  setRangeScale(data: IccD3BulletChartData[]): void {
    const minv = d3Array.min(data, (c) => d3Array.min(c.range, (d) => d.value));
    const maxv = d3Array.max(data, (c) => d3Array.max(c.range, (d) => d.value));
    this.scale.x.domain([minv, maxv]);
    this.scale.x2.domain([minv, maxv]);
    this.svg.select('.axis--x').call(this.scale.xAxis);
  }

  private getRangeData(data: IccD3Range[]): IccD3Range[] {
    const range = IccUtils.dataSortByField(data, 'value', 'asc');
    return range.filter((d, i) => i > 0)
      .map((d, i) => {
        return {
          label: d.label,
          minv: range[i].value,
          maxv: d.value,
          color: d.color
        };
      });
  }

  drawContents(drawName: string, scaleX: IccScaleLinear, scaleY: IccScaleLinear): void {
    this.setRangeScale(this.data);
    this.createDrawElement('bulletMeasures', true);
    this.createDrawElement('bulletMarkers', true);
    this.createDrawElement('bulletMarkerLines', true);
    this.svg.select(drawName).selectAll('g').data(this.data).join('g');
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScaleLinear, scaleY: IccScaleLinear): void {
    const data: IccD3BulletChartData = this.data[0];
    const range = this.getRangeData(data.range);
    this.svg.select(drawName).selectAll('rect').data(range).join('rect')
      .attr('fill', (d, i) => this.getdrawColor(d, i))
      .style('fill-opacity', (d) => 1)
      .attr('width', (d: any) => {
        const width = scaleX(d.maxv) - scaleX(d.minv);
        return width > 0 ? width : 0;
      })
      .attr('height', this.options.drawHeight)
      .attr('x', (d) => scaleX(d.minv));

    const measures = IccUtils.dataSortByField(this.options.y0(data), this.options.x, 'desc');
    this.svg.select('.bulletMeasures').selectAll('rect').data(measures).join('rect')
      .attr('fill', this.options.bullet.valueBarColor) // TODO shall be different colors
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
      .attr('fill', this.options.bullet.valueMarkerColor) // TODO shall be different colors
      .attr('transform', (d, i) => {
        let dy = this.options.bullet.valueMarkerDy;
        if (i % 3 !== 0) {
          dy = i % 3 === 1 ? 0 : -this.options.bullet.valueMarkerDy;
        }
        return `translate(${scaleX(this.options.x(d))}, ${dy + this.options.drawHeight / 2})`;
      })
      .attr('d', `M0,${h3}L${h3},${-h3} ${-h3},${-h3}Z`);

    this.svg.select('.bulletMarkerLines').selectAll('line.markerLine').data(data.markerLines).join('line')
      .attr('class', 'markerLine')
      .attr('stroke', this.options.bullet.markerLineColor) // TODO shall be different colors
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
      .text((d) => this.options.bullet.label);

    const textSize2 = Math.round(this.options.drawHeight * 1 / 4);
    yAxisDraw.append('g').append('text').attr('class', 'axis bullet-label-unit')
      .style('text-anchor', 'end')
      .style('font', `${textSize2}px Courier`)
      .attr('y', this.options.drawHeight * 2 / 3 + 2)
      .attr('dx', -5)
      .text(() => `(${this.options.bullet.unit})`);
  }

  legendMouseover(e, data, mouseover: boolean): void { }
}

