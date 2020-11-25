import * as d3 from 'd3-selection';
import * as d3Array from 'd3-array';
import { IccScaleDraw } from './scale-draw';
import { IccD3Component } from '../d3.component';
import { IccScaleLinear, IccD3Options, IccD3Popover } from '../model';

export class IccInteractiveDraw<T> {
  constructor(
    private svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
    private scale: IccScaleDraw<T>,
    private data: T[],
    private options: IccD3Options,
    private draw: IccD3Component<T>,
  ) {
    if (this.options.useInteractiveGuideline) {
      this.svg.select('.drawArea')
        .on('mousemove', (e, d) => this.updateGuideLine(e, true))
        .on('mouseout', (e, d) => this.updateGuideLine(e, false));
      this.initGuideline();
      this.update();
    } else {
      this.drawAllCircles();
    }

    this.draw.dispatch.on('drawZoom', (e) => {
      if (this.options.useInteractiveGuideline) {
        this.updateGuideLine(e.sourceEvent, true);
      } else {
        this.updateAllCircles();
      }
    });
  }

  updateOptions(options: IccD3Options): void {
    this.options = options;
    this.update();
  }

  update(): void {
    if (this.options.useInteractiveGuideline) {
      this.setGuideline();
    }
  }

  private initGuideline(): void {
    this.svg.select('.interactiveDraw').append('line')
      .attr('class', 'guideLine')
      .style('stroke', 'red')
      .style('stroke-width', 2)
      .style('opacity', 0)
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0);


    const data = this.getBisectData(0);
    this.svg.select('.interactiveDraw').selectAll('g')
      .data(() => data.filter((d: any) => !d.disabled))
      .enter().append('g')
      .selectAll('circle')
      .data((d) => this.options.y0(d))
      .enter().append('g')
      .append('circle')
      .attr('class', 'guideline, circle')
      .style('stroke-width', 2)
      .attr('r', 5)
      .style('opacity', 0);
  }

  private setGuideline(): void {
    this.svg.select('.interactiveDraw').select('.guideLine').attr('y2', this.options.drawHeight);
  }

  public drawAllCircles(): void {
    if (this.options.xScaleType !== 'band' && this.options.yScaleType !== 'band') {
      let data = [];
      this.data.forEach((d, i) => {
        const key = this.options.x0(d);
        const draw = this.draw.draws.forEach((dw) => {
          const odata = this.svg.select(`.${dw.chartType}`).selectAll('g').data();
          const fdata = odata.filter((od) => key === this.options.x0(od));
          data = [...data, ...fdata];
        });
      });
      this.svg.select('.interactiveDraw').selectAll('g').remove();
      const scatterDraw = this.svg.select('.interactiveDraw').selectAll('g')
        .data(data).enter().append('g')
        .attr('class', (d, i) => `dataGroup${i}`);

      scatterDraw
        .style('fill', (d, i) => this.getdrawColor(d, i))
        .attr('fill-opacity', 0)
        .selectAll('circle')
        .data((d, i) => (d && d[0] && d[0].data) ? d : this.options.y0(d))
        .enter().append('circle')
        .attr('class', 'circle')
        .attr('r', (d, i) => 5) // TODO better way ???
        .on('mouseover', (e: any) => this.onMouseOverNode(e.currentTarget, true))
        .on('mouseout', (e: any) => this.onMouseOverNode(e.currentTarget, false));
      this.updateAllCircles();
    }
  }

  private onMouseOverNode(currentTarget, mouseover: boolean): void {
    this.data.forEach((ed, i) => {
      const group = this.svg.select('.interactiveDraw').select(`.dataGroup${i}`).selectAll('circle');
      const nodes = group.nodes();
      const k = nodes.indexOf(currentTarget);
      if (k > 0) {
        group.attr('fill-opacity', (d, j) => (mouseover && k === j) ? 1 : null);
      }
    });
  }

  private updateAllCircles(): void {
    this.svg.select('.interactiveDraw').selectAll('g').selectAll('.circle')
      .attr('cx', (d: any) => (d && d.data) ? this.scale.x(this.options.x(d.data)) : this.scale.x(this.options.x(d)))
      .attr('cy', (d: any) => (d && d.data) ? this.scale.y(d[1]) : this.scale.y(this.options.y(d)));
  }

  private updateGuideLine(e, mouseover: boolean): void {
    const x = e.offsetX - this.options.margin.left + 2;
    this.svg.select('.interactiveDraw')
      .select('.guideLine')
      .style('opacity', mouseover ? 1 : 0)
      .attr('x1', x)
      .attr('x2', x);

    // TODO get bisect idy only for stacked data?
    if (this.options.xScaleType !== 'band' && this.options.yScaleType !== 'band') {
      const xScale = this.scale.x as IccScaleLinear;
      const x0 = xScale.invert(x);
      const bisect = d3Array.bisector((d) => this.options.x(d)).right;
      let idx = -1;
      this.data.forEach((d) => {
        const values = this.options.y0(d);
        idx = bisect(values, x0);
      });
      this.updateDataCircle(idx, x, mouseover, e);
    }
  }

  getLinearData(data, i, idx): {} {
    const r = {};
    for (const [k, v] of Object.entries(data)) {
      r[k] = !Array.isArray(data[k]) ? v : data[k].filter((t, i) => i === idx);
    }
    return r;
  }

  getStackedData(data, i, idx): {} {
    // console.log( ' i =', i, ' data =', data)
    const r = {
      key: data.key,
      isStacked: true,
      index: data.index,
      values: data[idx]
    };
    return r;
  }

  private getBisectData(idx): any[] {
    let ndata = [];
    if (idx === 0) {
      ndata = this.data.filter((d: any) => !d.disabled).map((d, i) => this.getLinearData(d, i, idx));
    } else {
      this.data.forEach((d, i) => {
        const key = this.options.x0(d);
        const draw = this.draw.draws.filter((dw) => {
          const odata = this.svg.select(`.${dw.chartType}`).selectAll('g').data();
          const fdata = odata.filter((od) => key === this.options.x0(od));
          if (fdata.length > 0) {
            const data = dw.isStacked ? this.getStackedData(fdata[0], i, idx) : this.getLinearData(fdata[0], i, idx);
            ndata.push(data);
            return true;
          }
        });
        if (draw.length === 0) {
          ndata.push(this.getLinearData(d, i, idx));
        }
      });
    }
    return ndata;
  }

  private getPopoverData(idx, data): IccD3Popover { // TODO popover scale data format
    let isStacked = false;
    let val = '';
    const sd = data.filter((d) => !d.disabled && this.options.y0(d).length > 0)
      .map((d, i) => {
        const yd = this.options.y0(d)[0];
        isStacked = d.isStacked;
        val = isStacked ? this.options.x(d.values.data) : this.options.x(yd);
        return {
          key: this.options.x0(d),
          value: d.isStacked ? d.values[1] : this.options.y(yd),
          color: this.getdrawColor(d, idx),
          hovered: d.isStacked ? d.index === this.draw.currentOverIndex : i === this.draw.currentOverIndex
        };
      });
    if (isStacked) {
      sd.reverse();
    }
    return {
      value: val,
      series: sd
    };
  }

  private updateDataCircle(idx, x, mouseover: boolean, e): void {
    if (this.options.xScaleType !== 'band' && this.options.yScaleType !== 'band') {
      const data: any = this.getBisectData(idx);
      this.svg.select('.interactiveDraw').selectAll('circle')
        .style('opacity', (d, i) => !mouseover || data[i].disabled ? 0 : 1)
        .style('stroke', (d, i) => this.getdrawColor(data[i], i))
        .attr('fill', (d, i) => this.getdrawColor(data[i], i))
        .attr('cx', x)
        .attr('cy', (d, i) => {
          if (data[i]) {
            if (data[i].isStacked) {
              const values = data[i].values;
              return this.scale.y(values[1]);
            } else {
              const value = this.options.y0(data[i])[0];
              if (value) {
                return this.scale.y(this.options.y(value)) + 0;
              }
            }
          }
        });
      if (mouseover) {
        const pd = this.getPopoverData(idx, data);
        this.draw.dispatch.call('drawMouseover', this, { event: e, data: pd });
      }
    }
  }

  public getdrawColor(d, i): string { // TODO get parent defined color?
    return d && (d.color || this.scale.colors(this.options.drawColor(d, i)));
  }
}

