import * as d3 from 'd3-selection';
import * as d3Array from 'd3-array';
import { IccScaleDraw } from './scale-draw';
import { IccD3Component } from '../d3.component';
import { IccScaleLinear, IccScaleBand, IccD3Options, IccD3Popover, IccD3PopoverSerie, IccD3Interactive } from '../model';

export class IccInteractiveDraw<T> {
  constructor(
    private svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
    private scale: IccScaleDraw<T>,
    private options: IccD3Options,
    private draw: IccD3Component<T>,
  ) {
    this.svg.select('.drawArea')
      .on('mousemove', (e, d) => this.updateInteractive(e, true))
      .on('mouseout', (e, d) => this.updateInteractive(e, false));
    this.init();
    this.update();
    this.draw.dispatch.on('drawZoom', (e) => this.updateInteractive(e.sourceEvent, true));
  }

  updateOptions(options: IccD3Options): void {
    this.options = options;
    this.update();
  }

  update(): void {
    const data = this.getInteractiveData(0);
    if (this.options.useInteractiveGuideline) {
      this.svg.select('.interactiveDraw').select('.guideLine').attr('y2', this.options.drawHeight);
    }
    this.svg.select('.interactiveDraw').selectAll('g')
      .data(() => data.filter((d: any) => !d.disabled))
      .join('g')
      .selectAll('circle')
      .data((d) => d.value)
      .join('circle')
      .attr('class', 'guideline, circle')
      .style('stroke-width', 2)
      .attr('r', 5)
      .style('opacity', 0);
  }

  private init(): void {
    if (this.options.useInteractiveGuideline) {
      this.svg.select('.interactiveDraw').append('line')
        .attr('class', 'guideLine')
        // .style('stroke', 'red')
        .style('stroke-width', 2)
        .style('opacity', 0)
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0);
    }
  }

  private updateInteractive(e, mouseover: boolean): void {
    const pxy = d3.pointer(e, e.target);
    let idx = -1;
    if (this.options.xScaleType === 'band') {
      const xScale = this.scale.x as IccScaleBand;
      idx = this.scaleBandInvert(xScale, pxy[0]);
    } else if (this.options.yScaleType === 'band') {
      const yScale = this.scale.y as IccScaleBand;
      idx = this.scaleBandInvert(yScale, pxy[1]);
    } else { // TODO yScale linear ???
      const xScale = this.scale.x as IccScaleLinear;
      const bisect = d3Array.bisector((d) => this.options.x(d)).right;
      const x0 = xScale.invert(pxy[0]);
      this.draw.data.forEach((d) => {
        const values = this.options.y0(d);
        idx = bisect(values, x0);
      });
    }
    const data: IccD3Interactive[] = this.getInteractiveData(idx);
    if (this.options.useInteractiveGuideline) {
      this.svg.select('.interactiveDraw')
        .select('.guideLine')
        .style('opacity', mouseover ? 1 : 0)
        .attr('x1', pxy[0])
        .attr('x2', pxy[0]);
    }
    if (data.length > 0) {
      this.updateGuideLineCircle(data, pxy[0], mouseover);
      if (mouseover) {
        const pd = this.getPopoverData(data);
        this.draw.dispatch.call('drawMouseover', this, { event: e, data: pd });
      }
    }
  }

  scaleBandInvert(scale, x): any {
    const domain = scale.domain();
    const paddingOuter = scale(domain[0]);
    const eachBand = scale.step();
    const index = Math.floor(((x - paddingOuter) / eachBand));
    return index < domain.length ? index : -1;
  }

  private updateGuideLineCircle(data, x, mouseover: boolean): void {
    if (this.options.yScaleType !== 'band') {
      this.svg.select('.interactiveDraw').selectAll('circle')
        .style('opacity', (d, i) => !data[i] || !mouseover || data[i].disabled || !data[i].cy ? 0 : 1)
        .style('stroke', (d, i) => data[i] && data[i].color)
        .attr('fill', (d, i) => data[i] && data[i].color)
        .attr('cx', x)
        .attr('cy', (d, i) => data[i] && data[i].cy);
    }
  }

  private getInteractiveData(idx): IccD3Interactive[] {
    const ndata: IccD3Interactive[] = [];
    this.draw.data.filter((d: any) => !d.disabled).forEach((d: any, i) => {
      this.draw.draws.forEach((draw) => {
        const drawdata = draw.getInteractiveData(idx, d);
        if (drawdata) {
          ndata.push(...drawdata);
        }
      });
    });
    return ndata;
  }

  private getPopoverData(data: IccD3Interactive[]): IccD3Popover {
    let reverse = false;
    let hasSummary = false;
    let val = '';
    let total = 0;
    const sd: IccD3PopoverSerie[] = data.filter((d) => d.value)
      .map((d, i) => {
        val = d.valueX;
        let svalue = '';
        reverse = d.reverse;
        hasSummary = d.hasSummary;
        total += d.hasSummary ? +d.valueY : 0;
        if (d.normalized) {
          svalue = `${this.options.popover.normalizedFormatter(+d.valueY * 100)}%`;
          if (d.value.data) {
            hasSummary = true;
            const avalue = d.value.data[d.key];
            total += +avalue;
            svalue += ` (${this.options.popover.valueFormatter(avalue)})`;
          }
        } else {
          svalue = this.options.popover.valueFormatter(+d.valueY);
        }
        return {
          key: this.options.popover.serieFormatter(d.key),
          value: svalue,
          color: d.color,
          hovered: d.hovered
        };
      });
    if (reverse) {
      sd.reverse();
    }
    if (hasSummary) {
      sd.push({
        key: this.options.popover.totalLable,
        value: this.options.popover.valueFormatter(total)
      });
    }
    return {
      value: this.options.popover.axisFormatter(val),
      series: sd
    };
  }
}

