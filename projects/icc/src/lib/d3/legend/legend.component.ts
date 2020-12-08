import { Component, ElementRef, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Dispatch from 'd3-dispatch';
import { IccScaleDraw } from '../draw/scale-draw';
import { IccD3Options } from '../model';

@Component({
  selector: 'icc-d3-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class IccD3LegendComponent<T> implements OnInit, OnChanges {
  @Input() options: IccD3Options;
  @Input() data: T[];
  @Input() scale: IccScaleDraw<T>;
  @Input() dispatch: d3Dispatch.Dispatch<{}>;
  availableWidth = 0;
  columnWidths = [];
  legendData: any[][];

  @HostBinding('style.display') get display(): string {
    return this.getData() && this.columnWidths.length === this.getData().length ? 'flex' : null;
  }

  constructor(
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
    this.setLegendData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options && this.availableWidth !== this.options.drawWidth - this.options.margin.left) {
      if (this.options.drawWidth <= 0) {
        this.options.drawWidth = 300;
      }
      this.availableWidth = this.options.drawWidth - this.options.margin.left;
      this.setLegendData();
    }
  }

  getData(): any[] {
    return this.options.chartType === 'pieChart' ? this.options.y0(this.data[0]) : this.data;
  }

  setLegendData(): void {
    const data = this.getData();
    if (data) {
      this.legendData = [];
      if (this.options.legend.position !== 'right') {
        const seriesPerRow = this.getSeriesPerRow();
        let nd = [];
        data.forEach((d, i) => {
          if (i !== 0 && i % seriesPerRow === 0) {
            this.legendData.push(nd);
            nd = [];
          }
          nd.push(d);
        });
        this.legendData.push(nd);
      } else {
        this.legendData.push(data);
      }
      setTimeout(() => {
        this.dispatch.call('legendResize', this, data);
      }, 1);
    }
  }

  getSeriesPerRow(): number {
    let seriesPerRow = 0;
    this.columnWidths = [];
    const legendText = d3.select(this.elementRef.nativeElement).selectAll('.legend');
    const seriesWidths = [];
    legendText.nodes().forEach((d: any, i) => seriesWidths.push(d.getBoundingClientRect().width));
    let legendWidth = 0;
    while (legendWidth < this.availableWidth && seriesPerRow < seriesWidths.length) {
      this.columnWidths[seriesPerRow] = seriesWidths[seriesPerRow];
      legendWidth += seriesWidths[seriesPerRow++];
    }
    if (seriesPerRow === 0) {
      seriesPerRow = 1;
    }
    while (legendWidth > this.availableWidth && seriesPerRow > 1) {
      this.columnWidths = [];
      seriesPerRow--;
      for (let k = 0; k < seriesWidths.length; k++) {
        if (seriesWidths[k] > (this.columnWidths[k % seriesPerRow] || 0)) {
          this.columnWidths[k % seriesPerRow] = seriesWidths[k];
        }
      }
      legendWidth = this.columnWidths.reduce((prev, cur, index, array) => prev + cur);
    }
    return seriesPerRow;
  }

  legendWidth(i: number): string {
    if (this.columnWidths.length > 0 && this.columnWidths.length !== this.getData().length) {
      return `${this.columnWidths[i]}px`;
    }
  }

  legendStyles(): any {
    const right = 10 + this.options.margin.right + (this.options.zoom.verticalBrushShow ? 80 : 0);
    let marginRight = `${right}px`;
    let marginLeft = `${this.options.margin.left}px`;
    if (this.options.legend.align === 'right' && this.columnWidths.length === this.getData().length) {
      marginLeft = 'auto';
    } else if (this.options.legend.position === 'right') {
      marginLeft = 'auto';
    }
    if (this.options.legend.align !== 'right' || this.options.legend.position === 'right') {
      marginRight = 'auto';
    }
    return {
      display: this.options.legend.position !== 'right' ? 'flex' : null,
      'margin-right': marginRight,
      'margin-left': marginLeft
    };
  }

  legendText(d: T): string {
    return d && this.options.chartType === 'pieChart' ? this.options.x(d) : this.options.x0(d);
  }

  legendColor(d, i): string {
    if (d && this.scale && this.scale.colors) {
      return d.color || this.scale.colors(this.options.drawColor(d, i));
    }
  }

  iconStyles(d, i): any {
    const color = this.legendColor(d, i);
    return {
      'background-color': !d.disabled ? color : null,
      'border-color': color
    };
  }

  itemClick(event, d: any): void {
    d.disabled = !d.disabled;
    this.dispatch.call('legendClick', this, d);
  }

  itemMouseOver(event, d: T): void {
    this.dispatch.call('legendMouseover', this, d);
  }

  itemMouseOut(event, d: T): void {
    this.dispatch.call('legendMouseout', this, d);
  }
}
