import { ElementRef, Injectable } from '@angular/core';
import { DEFAULT_CHART_OPTIONS, IccD3Options } from './model';

export class IccD3Config {
  private _options: IccD3Options;

  get options(): IccD3Options {
    return this._options;
  }

  set options(v: IccD3Options) {
    this._options = v;
  }

  constructor(
    private elementRef: ElementRef,
  ) { }

  initOptions(v: IccD3Options): void {
    this.options = v;
    this.init();
    this.setZoomOptions();
  }

  setViewDimension(): void {
    const margin = this.options.margin;
    const elRef = this.elementRef.nativeElement.firstChild;
    const width = elRef.clientWidth || 300;
    const height = elRef.clientHeight || 300;
    const zoom = this.options.zoom;
    const drawDimension = {
      drawWidth: width - margin.left - margin.right
        - (zoom.verticalBrushShow ? this.options.brushYWidth + 30 : 0),
      drawHeight: height - margin.top - margin.bottom
        - (zoom.horizontalBrushShow ? this.options.drawHeight2 + 30 : 0)
    };
    this.options = { ...this.options, ...drawDimension };
  }

  flexDirection(): string {
    switch (this.options.legend.position) {
      case 'top': return 'column-reverse';
      case 'bottom': return 'column';
      case 'right':
      case 'default': return '';
    }
  }

  private init(): void {
    for (const [key, value] of Object.entries(this.options)) {
      if (key === 'zoom') {
        this.options.zoom = { ...DEFAULT_CHART_OPTIONS.zoom, ...this.options.zoom };
      } else if (key === 'pie') {
        this.options.pie = { ...DEFAULT_CHART_OPTIONS.pie, ...this.options.pie };
      } else if (key === 'legend') {
        this.options.legend = { ...DEFAULT_CHART_OPTIONS.legend, ...this.options.legend };
      } else if (key === 'popover') {
        this.options.popover = { ...DEFAULT_CHART_OPTIONS.popover, ...this.options.popover };
      }
    }
    this.options = { ...DEFAULT_CHART_OPTIONS, ...this.options };
  }

  private setZoomOptions(): void {
    const zoom = this.options.zoom;
    zoom.horizontalOff = !zoom.enabled ? true : zoom.horizontalOff;
    zoom.horizontalBrushShow = !zoom.enabled || zoom.horizontalOff ? false : zoom.horizontalBrushShow;
    zoom.verticalOff = !zoom.enabled ? true : zoom.verticalOff;
    zoom.verticalBrushShow = !zoom.enabled || zoom.verticalOff ? false : zoom.verticalBrushShow;
  }

  getChartTypes<T>(data: T[]): string[] {
    const chartTypes = [this.options.chartType];
    if (data) {
      data.forEach((d: any) => {
        if (d.chartType && chartTypes.filter((type) => type === d.chartType).length === 0) {
          chartTypes.push(d.chartType);
        }
      });
    }
    return chartTypes;
  }

  checkData<T>(data: T[]): any[] {
    return data && this.options.chartType === 'pieChart' && !this.options.y0(data[0]) ?
      [{
        key: 'Pie Chart',
        values: data,
      }]
      : data;
  }
}

