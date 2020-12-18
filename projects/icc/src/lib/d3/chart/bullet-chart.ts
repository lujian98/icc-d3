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
    this.svg.select('.axis--x').call(this.scale.xAxis).call(this.scale.xAxis.tickSize(2));
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

  private getMeasuredRange(data: IccD3Range[]): IccD3Range[] {
    data = IccUtils.dataSortByField(data, this.options.x, 'asc');
    data.forEach((d, i) => {
      d.minv = i === 0 ? this.scale.x.domain()[0] : this.options.x(data[i - 1]);
    });
    return data;
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
      .attr('width', (d) => {
        const w = scaleX(d.maxv) - scaleX(d.minv);
        return w > 0 ? w : 0;
      })
      .attr('height', this.options.drawHeight)
      .attr('x', (d) => scaleX(d.minv));

    const measures = this.getMeasuredRange(this.options.y0(data)) || [];
    this.svg.select('.bulletMeasures').selectAll('rect').data(measures).join('rect')
      .attr('fill', (d) => d.color)
      .attr('width', (d) => {
        const w = scaleX(this.options.x(d)) - scaleX(d.minv);
        return w > 0 ? w : 0;
      })
      .attr('height', this.options.drawHeight / 3)
      .attr('y', this.options.drawHeight / 3)
      .attr('x', (d) => scaleX(d.minv));

    const h3 = this.options.drawHeight / 6;
    this.svg.select('.bulletMarkers').selectAll('path.markerTriangle').data(measures).join('path')
      .attr('class', 'markerTriangle')
      .attr('fill', this.options.bullet.valueMarkerColor) // TODO shall be different colors
      .attr('d', `M0,${h3}L${h3},${-h3} ${-h3},${-h3}Z`)
      .attr('transform', (d, i) => {
        const dy = i % 2 === 0 ? this.options.bullet.valueMarkerDy : -this.options.bullet.valueMarkerDy;
        const r = i % 2 === 0 ? 180 : 0;
        return `translate(${scaleX(this.options.x(d))}, ${dy + this.options.drawHeight / 2}) rotate(${r})`;
      });

    this.svg.select('.bulletMarkerLines').selectAll('line.markerLine')
      .data(data.markerLines || []).join('line')
      .attr('class', 'markerLine')
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', this.options.bullet.markerLineWidth)
      .attr('x1', (d) => scaleX(this.options.x(d)))
      .attr('y1', 2)
      .attr('x2', (d) => scaleX(this.options.x(d)))
      .attr('y2', this.options.drawHeight - 2);

    const yAxisDraw = this.svg.select('.yAxisDraw');
    yAxisDraw.selectAll('g').remove();
    const textSize = Math.round(this.options.drawHeight * 1 / 3);
    yAxisDraw.append('g').append('text').attr('class', 'axis bullet-label')
      .style('text-anchor', 'end')
      .style('font', `${textSize}px Courier`)
      .attr('y', this.options.drawHeight / 3 + 2)
      .attr('dx', -5)
      .text(this.options.bullet.label);

    const textSize2 = Math.round(this.options.drawHeight * 1 / 4);
    yAxisDraw.append('g').append('text').attr('class', 'axis bullet-label-unit')
      .style('text-anchor', 'end')
      .style('font', `${textSize2}px Courier`)
      .attr('y', this.options.drawHeight * 2 / 3 + 2)
      .attr('dx', -5)
      .text(`(${this.options.bullet.unit})`);
  }

  legendMouseover(e, data, mouseover: boolean): void { }
}

