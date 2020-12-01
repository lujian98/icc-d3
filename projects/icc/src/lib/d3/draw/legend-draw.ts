import * as d3 from 'd3-selection';
import * as d3Dispatch from 'd3-dispatch';
import { IccScaleDraw } from './scale-draw';
import { IccD3Options } from '../model';

export class IccLegendDraw<T> {
  margin = { top: 5, right: 0, bottom: 5, left: 0 };
  private _height = 20;
  rightAlign = true;
  // maxKeyLength = 20; // default value for key lengths
  align = true;
  padding = 32; // define how much space between legend items. - recommend 32 for furious version

  set height(v: number) {
    this._height = v;
  }

  get height(): number {
    return this._height;
  }

  constructor(
    private svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
    private scale: IccScaleDraw<T>,
    private data: T[],
    private options: IccD3Options,
    private dispatch: d3Dispatch.Dispatch<{}>
  ) {
    this.svg.select('.legendDraw').append('g').attr('class', 'legendArea');
    this.drawLegend();
    this.update();
  }

  updateOptions(options: IccD3Options): void {
    this.options = options;
    this.update();
  }

  update(): void {
    this.height = this.options.legendHeight;
    this.setLegendAlign();
  }

  private getLegendColor(d, i): string {
    return d.color || this.scale.colors(this.options.drawColor(d, i));
  }

  private setLegendShape(data): void {
    this.svg.selectAll('.legend-symbol')
      .filter((d: any) => this.options.x0(d) === this.options.x0(data))
      .style('fill-opacity', (d: any, i) => !!d.disabled ? 0 : 1);
  }

  private drawLegend(): void {
    const data = this.options.chartType === 'pieChart' ? this.options.y0(this.data[0]) : this.data;
    const legendArea = this.svg.select('.legendArea').selectAll('g').data(data);
    const legendDraw = legendArea.enter().append('g').attr('class', 'legends');

    legendDraw.append('circle')
      .style('stroke-width', 2)
      .style('stroke', (d, i) => this.getLegendColor(d, i))
      .attr('class', 'legend-symbol')
      .attr('fill', (d, i) => this.getLegendColor(d, i))
      .style('fill-opacity', (d: any) => !!d.disabled ? 0 : 1)
      .attr('r', 5);

    legendDraw.append('text')
      .attr('text-anchor', 'start')
      .attr('class', 'legend-text')
      .attr('dy', '.32em')
      .attr('dx', '8')
      .attr('fill', (d, i) => this.getLegendColor(d, i))
      .text((d) => this.options.chartType === 'pieChart' ? this.options.x(d) : this.options.x0(d));

    legendDraw
      .on('click', (e, d: any) => {
        d.disabled = !d.disabled;
        this.setLegendShape(d);
        this.dispatch.call('legendClick', this, d);
      })
      .on('mouseover', (e, d) => this.dispatch.call('legendMouseover', this, d))
      .on('mouseout', (e, d) => this.dispatch.call('legendMouseout', this, d));
  }

  private setLegendAlign(): void {
    const availableWidth = this.options.drawWidth - this.margin.left - this.margin.right;
    const versPadding = 20;
    if (this.align) {
      const seriesWidths = [];
      const legendText = this.svg.select('.legendArea').selectAll('text');
      legendText.nodes().forEach((d: any, i) => {
        seriesWidths.push(d.getComputedTextLength() + this.padding);
      });
      let seriesPerRow = 0;
      let columnWidths = [];
      let legendWidth = 0;
      while (legendWidth < availableWidth && seriesPerRow < seriesWidths.length) {
        columnWidths[seriesPerRow] = seriesWidths[seriesPerRow];
        legendWidth += seriesWidths[seriesPerRow++];
      }
      if (seriesPerRow === 0) {
        seriesPerRow = 1;
      }
      while (legendWidth > availableWidth && seriesPerRow > 1) {
        columnWidths = [];
        seriesPerRow--;
        for (let k = 0; k < seriesWidths.length; k++) {
          if (seriesWidths[k] > (columnWidths[k % seriesPerRow] || 0)) {
            columnWidths[k % seriesPerRow] = seriesWidths[k];
          }
        }
        legendWidth = columnWidths.reduce((prev, cur, index, array) => {
          return prev + cur;
        });
      }
      const xPositions = [];
      for (let i = 0, curX = 0; i < seriesPerRow; i++) {
        xPositions[i] = curX;
        curX += columnWidths[i];
      }

      this.svg.selectAll('.legends')
        .attr('transform', (d, i) => `translate(${xPositions[i % seriesPerRow]},${(5 + Math.floor(i / seriesPerRow) * versPadding)})`);

      const legendArea = this.svg.select('.legendArea');
      const top = this.margin.top - this.height;
      if (this.rightAlign) {
        const right = (this.options.drawWidth - this.margin.right - legendWidth);
        legendArea.attr('transform', 'translate(' + right + ',' + top + ')');
      } else {
        legendArea.attr('transform', 'translate(0' + ',' + top + ')');
      }
      this.height = this.margin.top + this.margin.bottom + (Math.ceil(seriesWidths.length / seriesPerRow) * versPadding);
    }
  }
}

