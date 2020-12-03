import * as d3 from 'd3-selection';
import * as d3Zoom from 'd3-zoom';
import * as d3Brush from 'd3-brush';
import { IccD3Component } from '../d3.component';
import { IccScaleDraw } from './scale-draw';
import { IccScaleLinear, IccD3Options } from '../model';

export class IccZoomDraw<T> {
  zoom: any;
  brush: any;
  brushY: any;
  xRange: any[];
  yRange: any[];

  constructor(
    private svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
    private scale: IccScaleDraw<T>,
    private draw: IccD3Component<T>,
    private options: IccD3Options,
  ) {
    this.init();
  }

  init(): void {
    this.initZoom();
    if (this.options.zoom.horizontalBrushShow) {
      this.initHorizontalBrush();
    }
    if (this.options.zoom.verticalBrushShow) {
      this.initVerticalBrush();
    }
    this.update();
  }

  updateOptions(options: IccD3Options): void {
    this.options = options;
    this.update();
  }

  update(): void {
    this.updateZoom();
    if (this.options.zoom.horizontalBrushShow) {
      this.updateHorizontalBrush();
    }
    if (this.options.zoom.verticalBrushShow) {
      this.updateVerticalBrush();
    }
  }

  private initZoom(): void {
    this.zoom = d3Zoom.zoom().scaleExtent([1, Infinity]);
    this.svg.select('.drawArea').call(this.zoom);
    this.zoom.on('zoom', this.zoomed.bind(this));
  }

  private updateZoom(): void {
    this.zoom.translateExtent([[0, 0], [this.options.drawWidth, this.options.drawHeight]])
      .extent([[0, 0], [this.options.drawWidth, this.options.drawHeight]]);
  }

  private initHorizontalBrush(): void {
    const context = this.svg.select('.context');
    context.append('g').attr('class', 'axis axis--x').call(this.scale.x2Axis);
    context.append('g').attr('class', 'brush');
  }

  private updateHorizontalBrush(): void {
    const context = this.svg.select('.context');
    this.brush = d3Brush.brushX().extent([[0, 0], [this.options.drawWidth, this.options.drawHeight2]]);
    context.select('.axis--x').attr('transform', 'translate(0,' + this.options.drawHeight2 + ')');
    context.select('.brush').call(this.brush).call(this.brush.move, this.scale.x.range());
    this.brush.on('brush end', this.brushed.bind(this));
  }

  private initVerticalBrush(): void {
    const context = this.svg.select('.contextBrushY');
    context.append('g').attr('class', 'axis axis--y').call(this.scale.y3Axis);
    context.append('g').attr('class', 'brush');
  }

  private updateVerticalBrush(): void {
    const context = this.svg.select('.contextBrushY');
    this.brushY = d3Brush.brushY().extent([[0, 0], [this.options.brushYWidth, this.options.drawHeight]]);
    context.select('.axis--y').attr('transform', 'translate(50,0)');
    const range = this.scale.y3.range();
    context.select('.brush').call(this.brushY)
      .call(this.brushY.move, this.options.yScaleType === 'band' ? range : range.reverse());
    this.brushY.on('brush end', this.brueshedY.bind(this));
  }

  setZoomRange(): void {
    if (this.xRange) {
      const xrange = this.scale.x.range();
      const x1 = Math.min(xrange[1], this.xRange[1]);
      const x0 = Math.max(xrange[0], this.xRange[0] - (this.xRange[1] - x1));
      const range = [x0, x1];
      this.setBrushedRange(range);
      if (this.options.zoom.horizontalBrushShow) {
        this.svg.select('.context').select('.brush').call(this.brush.move, range);
      }
    }
    if (this.yRange) {
      const yrange = this.scale.y.range();
      if (yrange[1] < yrange[0]) {
        yrange.reverse();
      }
      const y1 = Math.min(yrange[1], this.yRange[1]);
      const y0 = Math.max(yrange[0], this.yRange[0] - (this.yRange[1] - y1));
      const range = [y0, y1];
      this.setBrushedYRange(range);
      if (this.options.zoom.verticalBrushShow) {
        this.svg.select('.contextBrushY').select('.brush').call(this.brushY.move, range);
      }
    }
  }

  private zoomed(event): void {
    if (event.sourceEvent) {
      if (!this.options.zoom.horizontalOff) {
        if (this.options.xScaleType === 'linear' || this.options.xScaleType === 'time') {
          const t = event.transform;
          this.scale.x.domain(t.rescaleX(this.scale.x2).domain());
          this.redraw();
          this.xRange = this.scale.x.range().map(t.invertX, t);
          if (this.brush) {
            this.svg.select('.context').select('.brush').call(this.brush.move, this.xRange);
          }
        } else if (this.options.xScaleType === 'band') {
          const t = event.transform;
          const x0 = this.scale.x2.range();
          const x = x0.map(d => t.applyX(d));
          this.scale.x.range(x);
          this.redraw();
          this.xRange = [
            x0[0] + (x0[0] - x[0]) / t.k,
            x0[1] + (x0[1] - x[1]) / t.k
          ];
          if (this.brush) {
            this.svg.select('.context').select('.brush').call(this.brush.move, this.xRange);
          }
        }
      }
      if (!this.options.zoom.verticalOff) {
        if (this.options.yScaleType === 'linear' || this.options.yScaleType === 'time') {
          const t = event.transform;
          this.scale.y.domain(t.rescaleY(this.scale.y3).domain());
          this.redraw();
          this.yRange = this.scale.y3.range().map(t.invertY, t).reverse();
          if (this.brushY) {
            this.svg.select('.contextBrushY').select('.brush').call(this.brushY.move, this.yRange);
          }
        } else if (this.options.yScaleType === 'band') {
          const t = event.transform;
          const y0 = this.scale.y3.range();
          const y = y0.map(d => t.applyY(d));
          this.scale.y.range(y);
          this.redraw();
          this.yRange = [
            y0[0] + (y0[0] - y[0]) / t.k,
            y0[1] + (y0[1] - y[1]) / t.k
          ];
          if (this.brushY) {
            this.svg.select('.contextBrushY').select('.brush').call(this.brushY.move, this.yRange);
          }
        }
      }
      this.draw.dispatch.call('drawZoom', this, event);
    }
  }

  private brueshedY(event): void {
    if (event.sourceEvent) {
      this.yRange = event.selection || this.scale.y3.range();
      this.setBrushedYRange(this.yRange);
    }
  }

  private setBrushedYRange(range): void {
    if (this.options.yScaleType === 'linear' || this.options.yScaleType === 'time') {
      const y3Scale = this.scale.y3 as IccScaleLinear;
      const ydoman = range.map(y3Scale.invert, this.scale.y3).reverse();
      this.scale.y.domain(ydoman);
    } else if (this.options.yScaleType === 'band') {
      const x0 = this.scale.y3.range();
      const scale = this.options.drawHeight / (range[1] - range[0]);
      const x = [
        x0[0] + (x0[0] - range[0]) * scale,
        x0[1] + (x0[1] - range[1]) * scale
      ];
      this.scale.y.range(x);
    }
    this.redraw();
    this.svg.select('.drawArea').call(this.zoom.transform, d3Zoom.zoomIdentity
      .scale(this.options.drawHeight / (range[1] - range[0]))
      .translate(0, -range[0])); // TODO x = 0 is incorrect
  }

  private brushed(event): void {
    if (event.sourceEvent) {
      this.xRange = event.selection || this.scale.x2.range();
      this.setBrushedRange(this.xRange);
    }
  }

  private setBrushedRange(range): void {
    if (this.options.xScaleType === 'linear' || this.options.xScaleType === 'time') {
      this.brushXScaleLinear(range);
    } else if (this.options.xScaleType === 'band') {
      this.brushXScaleBand(range);
    }
    this.redraw();
    // this.svg.select('.zoom')
    this.svg.select('.drawArea').call(this.zoom.transform, d3Zoom.zoomIdentity
      .scale(this.options.drawWidth / (range[1] - range[0]))
      .translate(-range[0], 0)); // TODO y = 0 is incorrect
  }

  private brushXScaleLinear(range): void {
    const x2Scale = this.scale.x2 as IccScaleLinear;
    this.scale.x.domain(range.map(x2Scale.invert, this.scale.x2));
  }

  private brushXScaleBand(range): void {
    const x0 = this.scale.x2.range();
    const scale = this.options.drawWidth / (range[1] - range[0]);
    const x = [
      x0[0] + (x0[0] - range[0]) * scale,
      x0[1] + (x0[1] - range[1]) * scale
    ];
    this.scale.x.range(x);
  }

  private redraw(): void {
    this.draw.redraw();
    this.svg.select('.axis--x').call(this.scale.xAxis);
    this.svg.select('.axis--y').call(this.scale.yAxis);
  }
}

