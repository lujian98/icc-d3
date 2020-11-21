import { ElementRef } from '@angular/core';
import * as d3 from 'd3-selection';
import { IccLegendDraw } from './legend-draw';

export class IccDraw {
  private _svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>;

  get svg(): d3.Selection<d3.BaseType, {}, HTMLElement, any> {
    return this._svg;
  }

  set svg(v: d3.Selection<d3.BaseType, {}, HTMLElement, any>) {
    this._svg = v;
  }

  width: number;
  height: number;
  getOptions(): void {
    return this.options;
  }

  constructor(
    protected elementRef: ElementRef,
    private options: any,
    private chartTypes: any[]
  ) {
    this.clearElement();
    this.initSvg();
    this.update();
  }

  public clearElement(): void {
    // !!!!Caution!!!
    // Make sure not to do;
    //     d3.select('svg').remove();
    // That will clear all other SVG elements in the DOM
    // d3.select(this.hostElement).select('svg').remove();
    d3.select(this.elementRef.nativeElement).select('g').remove();
  }

  update(): void {
    this.setDrawDimension();
    this.updateDrawDimension();
  }

  private setDrawDimension(): void {
    this.setZoomOptions();
    const margin = this.options.margin;
    this.width = this.elementRef.nativeElement.clientWidth;
    // console.log( ' this.width =', this.width)
    this.height = this.elementRef.nativeElement.clientHeight;
    const zoom = this.options.zoom;
    const drawDimension = {
      drawWidth: this.width - margin.left - margin.right - (zoom.verticalBrushShow ? 80 : 0),
      drawHeight: this.height - margin.top - margin.bottom - (zoom.horizontalBrushShow ? 80 : 0),
      drawHeight2: 50 // TODO in the options
    };
    this.options = { ...this.options, ...drawDimension };
  }

  private setZoomOptions(): void {
    const zoom = this.options.zoom;
    zoom.horizontalOff = !zoom.enabled ? true : zoom.horizontalOff;
    zoom.horizontalBrushShow = !zoom.enabled || zoom.horizontalOff ? false : zoom.horizontalBrushShow;
    zoom.verticalOff = !zoom.enabled ? true : zoom.verticalOff;
    zoom.verticalBrushShow = !zoom.enabled || zoom.verticalOff ? false : zoom.verticalBrushShow;
  }

  private initSvg(): void {
    const drawID = Math.floor(Math.random() * 100000);
    this.svg = d3.select(this.elementRef.nativeElement).select('svg').append('g');
    const xAxisDraw = this.svg.append('g').attr('class', 'xAxisDraw');
    const yAxisDraw = this.svg.append('g').attr('class', 'yAxisDraw');
    const brushDraw = this.svg.append('g').attr('class', 'brushDraw');
    this.svg.append('g').attr('class', 'legendDraw');

    const drawArea = this.svg.append('g').attr('class', 'drawArea');
    drawArea.append('defs').append('clipPath').attr('id', `clip${drawID}`).append('rect');
    drawArea.append('rect').attr('class', 'zoom');

    this.chartTypes.forEach((type) => {
      drawArea.append('g').attr('class', type).attr('clip-path', `url(#clip${drawID})`);
      brushDraw.append('g').attr('class', `${type}Brush`);
      brushDraw.append('g').attr('class', `${type}BrushY`);
    });

    brushDraw.append('g').attr('class', 'context');
    brushDraw.append('g').attr('class', 'contextBrushY');
    drawArea.append('g').attr('class', 'interactiveDraw').attr('clip-path', `url(#clip${drawID})`);
  }

  updateDrawDimension(): void {
    const legendH = this.options.legendHeight - 10;
    const dtop = this.options.margin.top + legendH;
    this.options.drawHeight -= legendH;
    this.svg.attr('transform', 'translate(' + this.options.margin.left + ',' + dtop + ')');

    const drawArea = this.svg.select('.drawArea');
    drawArea.select('clipPath').select('rect')
      .attr('width', this.options.drawWidth).attr('height', this.options.drawHeight)
      .attr('x', 0).attr('y', 0);

    drawArea.select('.zoom').attr('width', this.options.drawWidth).attr('height', this.options.drawHeight);

    const left = 0; // this.options.margin.left - this.options.margin.left;
    const top = this.height - this.options.margin.top - this.options.legendHeight +
      (this.options.legendHeight === 20 ? 10 : 0) - 70;
    const yBrushPos = this.options.drawWidth + 10;

    const brushDraw = this.svg.select('.brushDraw');
    this.chartTypes.forEach((type) => {
      brushDraw.select(`.${type}Brush`).attr('transform', `translate(${left}, ${top})`);
      brushDraw.select(`.${type}BrushY`).attr('transform', `translate(${yBrushPos}, 0)`);
    });

    brushDraw.select('.context').attr('transform', `translate(${left}, ${top})`);
    brushDraw.select('.contextBrushY').attr('transform', `translate(${yBrushPos}, 0)`);
  }

  drawLegend(scale: any, data: any[]): void {
    const drawLegend = new IccLegendDraw(this.svg, scale, data, this.options);
    const legendHeight = drawLegend.height;
    if (legendHeight - 10 !== this.options.legendHeight) {
      this.options.legendHeight = legendHeight - 10;
      this.update();
      drawLegend.updateOptions(this.options);
    }
  }
}

