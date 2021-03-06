import * as d3Array from 'd3-array';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccScaleLinear, IccD3Range, IccD3BulletChartData } from '../model';
import { IccUtils } from '../../utils/utils';

export class IccbulletChart<T> extends IccAbstractDraw<T> {

  setRangeScale(data: IccD3BulletChartData[]): void {
    const minv = d3Array.min(data, (c) => d3Array.min(c.range, (d) => d.value));
    const maxv = d3Array.max(data, (c) => d3Array.max(c.range, (d) => d.value));
    if (this.options.bullet.type === 'horizontal') {
      this.scale.x.domain([minv, maxv]);
      this.scale.x2.domain([minv, maxv]);
      this.svg.select('.axis--x').call(this.scale.xAxis);
      this.svg.select('.axis--xgrid').call(this.scale.xGrid);
    } else if (this.options.bullet.type === 'vertical') {
      this.scale.y.domain([minv, maxv]);
      this.scale.y3.domain([minv, maxv]);
      this.svg.select('.axis--y').call(this.scale.yAxis);
      this.svg.select('.axis--ygrid').call(this.scale.yGrid);
    }
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

  private getMeasuredRange(data: IccD3Range[], optionX: Function, minv: number): IccD3Range[] {
    data = IccUtils.dataSortByField(data, optionX, 'asc');
    data.forEach((d, i) => {
      d.minv = i === 0 ? minv : optionX(data[i - 1]);
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
    if (this.options.bullet.type === 'horizontal') {
      this.drawHorizontalRange(drawName, scaleX, range);
      this.drawHorizontalMeasures(data, scaleX);
      this.drawHorizontalMakerLines(data.markerLines);
    } else if (this.options.bullet.type === 'vertical') {
      this.drawVerticalRange(drawName, scaleY, range);
      this.drawVerticalMeasures(data, scaleY);
      this.drawVerticalMakerLines(data.markerLines);
    }
  }

  private drawVerticalMakerLines(data: T[]): void {
    this.svg.select('.bulletMarkerLines').selectAll('line.markerLine')
      .data(data || []).join('line')
      .attr('class', 'markerLine')
      .attr('stroke', (d: any) => d.color)
      .attr('stroke-width', this.options.bullet.markerLineWidth)
      .attr('x1', 2)
      .attr('y1', (d) => this.scale.y(this.options.y(d)))
      .attr('x2', this.options.drawWidth - 2)
      .attr('y2', (d) => this.scale.y(this.options.y(d)));
  }

  private drawVerticalRange(drawName: string, scaleY: IccScaleLinear, range: IccD3Range[]): void {
    this.svg.select(drawName).selectAll('rect').data(range).join('rect')
      .attr('fill', (d, i) => this.getdrawColor(d, i))
      .attr('width', this.options.drawWidth)
      .attr('y', (d, i) => scaleY(d.maxv))
      .attr('height', (d, i) => scaleY(d.minv) - scaleY(d.maxv));
  }

  private drawVerticalMeasures(data: IccD3BulletChartData, scaleY: IccScaleLinear): void {
    const measures = this.getMeasuredRange(this.options.y0(data), this.options.y, scaleY.domain()[0]) || [];
    this.svg.select('.bulletMeasures').selectAll('rect').data(measures).join('rect')
      .attr('fill', (d) => d.color)
      .attr('width', this.options.drawWidth / 3)
      .attr('x', this.options.drawWidth / 3)
      .attr('y', (d) => scaleY(this.options.y(d)))
      .attr('height', (d) => {
        const h = scaleY(d.minv) - scaleY(this.options.y(d));
        return h > 0 ? h : 0;
      });
    const h3 = this.options.drawWidth / 6 - 1;
    this.svg.select('.bulletMarkers').selectAll('path.markerTriangle').data(measures).join('path')
      .attr('class', 'markerTriangle')
      .attr('fill', (d) => d.color)
      .attr('d', `M${h3},0L${-h3},${-h3} ${-h3},${h3}Z`)
      .attr('transform', (d, i) => {
        const dh = i % 2 === 0 ? 2 * (h3 + 0.5) : -2 * (h3 + 0.5);
        const r = i % 2 === 0 ? 180 : 0;
        return `translate(${dh + this.options.drawWidth / 2}, ${this.scale.y(this.options.y(d))}) rotate(${r})`;
      });
  }

  private drawHorizontalRange(drawName: string, scaleX: IccScaleLinear, range: IccD3Range[]): void {
    this.svg.select(drawName).selectAll('rect').data(range).join('rect')
      .attr('fill', (d, i) => this.getdrawColor(d, i))
      .attr('width', (d) => {
        const w = scaleX(d.maxv) - scaleX(d.minv);
        return w > 0 ? w : 0;
      })
      .attr('height', this.options.drawHeight)
      .attr('x', (d) => scaleX(d.minv));
  }

  private drawHorizontalMeasures(data: IccD3BulletChartData, scaleX: IccScaleLinear): void {
    const measures = this.getMeasuredRange(this.options.y0(data), this.options.x, scaleX.domain()[0]) || [];
    this.svg.select('.bulletMeasures').selectAll('rect').data(measures).join('rect')
      .attr('fill', (d) => d.color)
      .attr('width', (d) => {
        const w = scaleX(this.options.x(d)) - scaleX(d.minv);
        return w > 0 ? w : 0;
      })
      .attr('height', this.options.drawHeight / 3)
      .attr('y', this.options.drawHeight / 3)
      .attr('x', (d) => scaleX(d.minv));

    const h3 = this.options.drawHeight / 6 - 1;
    this.svg.select('.bulletMarkers').selectAll('path.markerTriangle').data(measures).join('path')
      .attr('class', 'markerTriangle')
      .attr('fill', (d) => d.color)
      .attr('d', `M0,${h3}L${h3},${-h3} ${-h3},${-h3}Z`)
      .attr('transform', (d, i) => {
        const dh = i % 2 === 0 ? 2 * (h3 + 0.5) : -2 * (h3 + 0.5);
        const r = i % 2 === 0 ? 180 : 0;
        return `translate(${this.scale.x(this.options.x(d))}, ${dh + this.options.drawHeight / 2}) rotate(${r})`;
      });
  }

  private drawHorizontalMakerLines(data: T[]): void {
    this.svg.select('.bulletMarkerLines').selectAll('line.markerLine')
      .data(data || []).join('line')
      .attr('class', 'markerLine')
      .attr('stroke', (d: any) => d.color)
      .attr('stroke-width', this.options.bullet.markerLineWidth)
      .attr('x1', (d) => this.scale.x(this.options.x(d)))
      .attr('y1', 2)
      .attr('x2', (d) => this.scale.x(this.options.x(d)))
      .attr('y2', this.options.drawHeight - 2);
  }

  legendMouseover(e, data, mouseover: boolean): void { }
}

