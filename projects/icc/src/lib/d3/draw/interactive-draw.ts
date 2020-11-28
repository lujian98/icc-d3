import * as d3 from 'd3-selection';
import * as d3Array from 'd3-array';
import { IccScaleDraw } from './scale-draw';
import { IccD3Component } from '../d3.component';
import { IccScaleLinear, IccScaleBand, IccD3Options, IccD3Popover } from '../model';

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

    this.draw.dispatch.on('drawZoom', (e) => {
      this.updateInteractive(e.sourceEvent, true);
    });
  }

  updateOptions(options: IccD3Options): void {
    this.options = options;
    this.update();
  }

  update(): void {
    const data = this.getBisectData(0);
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
        .style('stroke', 'red')
        .style('stroke-width', 2)
        .style('opacity', 0)
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0);
    }
  }

  private updateInteractive(e, mouseover: boolean): void {
    const x = e.offsetX - this.options.margin.left + 2;
    const y = e.offsetY - this.options.margin.top + 2;
    let idx = -1;
    let data: any[];
    if (this.options.xScaleType === 'band') {
      const xScale = this.scale.x as IccScaleBand;
      idx = this.scaleBandInvert(xScale, x);
    } else if (this.options.yScaleType === 'band') {
      const yScale = this.scale.y as IccScaleBand;
      idx = this.scaleBandInvert(yScale, y);
    } else { // TODO yScale linear ???
      const xScale = this.scale.x as IccScaleLinear;
      const bisect = d3Array.bisector((d) => this.options.x(d)).right;
      const x0 = xScale.invert(x);
      this.draw.data.forEach((d) => {
        const values = this.options.y0(d);
        idx = bisect(values, x0);
      });
    }
    data = this.getBisectData(idx);
    if (this.options.useInteractiveGuideline) {
      this.svg.select('.interactiveDraw')
        .select('.guideLine')
        .style('opacity', mouseover ? 1 : 0)
        .attr('x1', x)
        .attr('x2', x);
    }
    if (idx > -1) {
      this.updateGuideLineCircle(data, x, mouseover);
    }
    if (mouseover && idx > -1) {
      const pd = this.getPopoverData(idx, data);
      this.draw.dispatch.call('drawMouseover', this, { event: e, data: pd });
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

  private getBisectData(idx): any[] {
    const ndata = [];
    this.draw.data.filter((d: any) => !d.disabled).forEach((d: any, i) => {
      this.draw.draws.forEach((draw) => {
        const drawdata = draw.getDataByIdx(idx, d);
        if (drawdata) {
          ndata.push(drawdata);
        }
      });
    });
    return ndata;
  }

  private getPopoverData(idx, data): IccD3Popover {
    let isStacked = false;
    let hasSummary = false;
    let val = '';
    let total = 0;
    const sd = data.filter((d) => !d.disabled && d.value.length > 0)
      .map((d, i) => {
        val = d.valueX;
        let svalue = +d.valueY;
        isStacked = d.isStacked;
        hasSummary = d.hasSummary;
        if (hasSummary) {
          total += +svalue;
        } else if (isStacked) {
          svalue = svalue * 100;
        }
        return {
          key: this.options.popover.serieFormatter(d.key),
          value: this.options.popover.valueFormatter(svalue),
          color: d.color,
          hovered: d.hovered
        };
      });
    if (isStacked) {
      sd.reverse();
      if (!hasSummary) {
        sd.forEach((d) => d.value = `${d.value}%`);
      }
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

