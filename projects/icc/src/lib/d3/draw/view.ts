import { ElementRef } from '@angular/core';
import * as d3 from 'd3-selection';
import { IccD3Options } from '../model';

export class IccView {
  private height: number;
  private _svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>;

  get svg(): d3.Selection<d3.BaseType, {}, HTMLElement, any> {
    return this._svg;
  }

  set svg(v: d3.Selection<d3.BaseType, {}, HTMLElement, any>) {
    this._svg = v;
  }

  constructor(
    protected elementRef: ElementRef,
    private chartTypes: any[],
    private options: IccD3Options
  ) {
    this.clearElement();
    this.initSvg();
  }

  public clearElement(): void {
    d3.select(this.elementRef.nativeElement).select('g').remove();
  }

  update(options: IccD3Options): void {
    this.options = options;
    const elementRef = this.elementRef.nativeElement.firstChild;
    this.height = elementRef.clientHeight || 300;
    this.updateViewDimension();
  }

  private initSvg(): void {
    const drawID = Math.floor(Math.random() * 100000);
    this.svg = d3.select(this.elementRef.nativeElement).select('svg')
      .attr('class', `${this.options.chartType}Svg`).append('g');
    if (this.options.axisEnabled) {
      const xAxisDraw = this.svg.append('g').attr('class', 'xAxisDraw');
      const yAxisDraw = this.svg.append('g').attr('class', 'yAxisDraw');
    }
    let brushDraw: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
    if (this.options.zoom.enabled) {
      brushDraw = this.svg.append('g').attr('class', 'brushDraw');
    }
    const drawArea = this.svg.append('g').attr('class', 'drawArea');
    drawArea.append('defs').append('clipPath').attr('id', `clip${drawID}`).append('rect');
    if (this.options.zoom.enabled) {
      drawArea.append('rect').attr('class', 'zoom');
    }
    this.chartTypes.forEach((type) => {
      drawArea.append('g').attr('class', type).attr('clip-path', `url(#clip${drawID})`);
      // drawArea.append('g').attr('class', `${type}Label`).attr('clip-path', `url(#clip${drawID})`); // pie and gauge
      if (this.options.zoom.enabled) {
        brushDraw.append('g').attr('class', `${type}Brush`);
        brushDraw.append('g').attr('class', `${type}BrushY`);
      }
    });
    if (this.options.zoom.enabled) {
      brushDraw.append('g').attr('class', 'context');
      brushDraw.append('g').attr('class', 'contextBrushY');
    }
    drawArea.append('g').attr('class', 'interactiveDraw').attr('clip-path', `url(#clip${drawID})`);
  }

  updateViewDimension(): void {
    this.svg.attr('transform', `translate(${this.options.margin.left},${this.options.margin.top})`);
    const drawArea = this.svg.select('.drawArea');
    drawArea.select('clipPath').select('rect')
      .attr('width', this.options.drawWidth).attr('height', this.options.drawHeight)
      .attr('x', 0).attr('y', 0);
    drawArea.select('.zoom').attr('width', this.options.drawWidth).attr('height', this.options.drawHeight);
    const top = this.height - this.options.drawHeight2 - this.options.margin.bottom;
    const yBrushPos = this.options.drawWidth + 10; // 10 for the gap
    const brushDraw = this.svg.select('.brushDraw');
    this.chartTypes.forEach((type) => {
      brushDraw.select(`.${type}Brush`).attr('transform', `translate(0, ${top})`);
      brushDraw.select(`.${type}BrushY`).attr('transform', `translate(${yBrushPos}, 0)`);
    });
    brushDraw.select('.context').attr('transform', `translate(0, ${top})`);
    brushDraw.select('.contextBrushY').attr('transform', `translate(${yBrushPos}, 0)`);
  }
}

