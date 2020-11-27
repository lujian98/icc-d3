import * as d3 from 'd3-selection';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccStackedData } from '../data/stacked-data';
import { IccScale, IccScaleLinear } from '../model';

export class IccStackedHorizontalBarChart<T> extends IccAbstractDraw<T> {
  protected hoveredIndex = -1;
  drawData: T[];
  normalized = false;

  getDrawData(idx, data): {} { // TODO this is same
    const d = data[idx];
    const r: any = {
      key: data.key,
      isStacked: true,
      hasSummary: !this.normalized,
      index: data.index,
      hovered: this.hoveredKey === data.key,
      value: d,
      // cy: this.scale.y(data[idx][1]),
      color: null
    };
    if (d.data) {
      r.valueX = this.options.y(d.data);
      r.valueY = d[1] - d[0]; // scaleX(d[1]) - scaleX(d[0]));
    }
    r.color = this.getStackeddrawColor(r, 0);
    return r;
  }

  drawChart(data: T[]): void {
    this.drawData = data;
    this.isStacked = true;
    const stacked = new IccStackedData(this.svg, this.scale, this.options, this.chartType);
    this.normalized = stacked.normalized;
    const stackdata = data.length > 0 ? stacked.getStackedData(data, false) : [];
    if (data.length > 0) {
      stacked.setStackedXDomain(stackdata);
    }
    super.drawChart(stackdata);
  }

  drawContents(drawName: string, scaleX: IccScaleLinear, scaleY: IccScale): void {
    this.options.useInteractiveGuideline = false;
    this.svg.select(drawName).selectAll('g').data(this.data).join('g')
      .attr('class', 'stackedhorizontalbar series')
      .attr('fill-opacity', 0.75)
      .attr('fill', (d, i) => this.getStackeddrawColor(d, i));
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScaleLinear, scaleY: IccScale): void {
    const drawContents = this.svg.select(drawName).selectAll('g').selectAll('rect')
      .data((d: any) => d).join('rect')
      .attr('class', 'stackedhorizontalbar draw')
      .attr('x', (d, i) => scaleX(d[0]))
      .attr('y', (d: any) => scaleY(this.options.y(d.data)))
      .attr('height', this.scale.getYBarWidth(scaleY, this.drawData))
      .attr('width', (d, i) => scaleX(d[1]) - scaleX(d[0]));

    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.drawMouseover(e, d, true))
        .on('mouseout', (e, d) => this.drawMouseover(e, d, false));
    }
  }

  legendMouseover(e, data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').selectAll('.draw')
      .style('fill-opacity', (d) => mouseover ? null : 0.75);

    this.svg.select(`.${this.chartType}`).selectAll('.series')
      .filter((d: any, i) => d.key === this.options.x0(data))
      .style('fill-opacity', (d) => mouseover ? 0.9 : null);
  }

  drawMouseover(e, data, mouseover: boolean): void {
    if (e) {
      if (mouseover) {
        this.setHovered(e, data);
      } else {
        this.hoveredKey = null;
        this.hoveredIndex = -1;
      }
    }
    this.svg.select(`.${this.chartType}`).selectAll('g').selectAll('.draw')
      .filter((d: any, i) => data.data && this.options.y(d.data) === this.options.y(data.data))
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75);
  }

  setHovered(e, d): any {
    const group = this.svg.select(`.${this.chartType}`).selectAll('g');
    const nodes = group.nodes();
    const data: any = group.data();
    const node = d3.select(e.target).node();
    let i = -1;
    let j = -1;
    nodes.forEach((n, k) => {
      if (j === -1) {
        const pnodes = d3.select(n).selectAll('rect').nodes();
        j = pnodes.indexOf(node);
        if (j > -1) {
          i = k;
        }
      }
    });
    this.hoveredKey = data[i].key; // this only difference
    this.hoveredIndex = j;
    // console.log('  this.hoveredIndex = ',  this.hoveredIndex, ' this.hoveredKey  = ', this.hoveredKey )
  }
}

