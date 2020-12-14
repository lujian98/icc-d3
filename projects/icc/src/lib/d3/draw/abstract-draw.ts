import * as d3 from 'd3-selection';
import * as d3Dispatch from 'd3-dispatch';
import { IccScaleDraw } from './scale-draw';
import { IccScale, IccD3Options, IccD3Interactive } from '../model';

export abstract class IccAbstractDraw<T> {
  chartType: string;
  protected data: T[];
  protected options: IccD3Options;
  protected prevData: T[];
  protected isAnimation = false;
  protected isStacked = false;
  protected reverse = false;
  protected normalized = false;
  protected isGrouped = false;
  protected hoveredKey = '';
  protected hoveredIndex = -2;

  abstract drawContents(drawName: string, scaleX: IccScale, scaleY: IccScale, xGroup: IccScale, yGroup: IccScale): void;
  abstract redrawContent(drawName: string, scaleX: IccScale, scaleY: IccScale, xGroup: IccScale, yGroup: IccScale): void;
  abstract legendMouseover(e, data: T[], mouseover: boolean): void;

  constructor(
    protected svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
    protected scale: IccScaleDraw<T>,
    protected dispatch: d3Dispatch.Dispatch<{}>,
    chartType: string
  ) {
    this.chartType = chartType;
  }

  updateOptions(options: IccD3Options): void {
    this.options = options;
  }

  createDrawElement(name: string): void {
    this.svg.select(`.${name}`).remove();
    this.svg.select('.drawArea').append('g').attr('class', name);
  }

  drawChart(data: T[]): void {
    this.prevData = this.data;
    this.data = data;
    this.isAnimation = true; // TODO with options
    this.drawContents(`.${this.chartType}`, this.scale.x, this.scale.y, this.scale.xGroup, this.scale.yGroup);
    this.isAnimation = false;
    if (this.options.zoom.horizontalBrushShow) {
      this.drawContents(`.${this.chartType}Brush`, this.scale.x2, this.scale.y2, this.scale.x2Group, this.scale.y2Group);
    }
    if (this.options.zoom.verticalBrushShow) {
      this.drawContents(`.${this.chartType}BrushY`, this.scale.x3, this.scale.y3, this.scale.x3Group, this.scale.y3Group);
    }
  }

  redraw(): void {
    this.redrawContent(`.${this.chartType}`, this.scale.x, this.scale.y, this.scale.xGroup, this.scale.yGroup);
  }

  getdrawColor = (d, i) => d.color || this.scale.colors(this.options.drawColor(d, i));

  getBarColor = (d, i) => d.color || (this.options.barColor && this.scale.colors(this.options.barColor(d, i)));

  getStackeddrawColor = (d, i) => d.color || this.scale.colors(d.key); // key is from stacked data

  // below for popover data
  getInteractiveData(idx, data): IccD3Interactive[] {
    if (this.hoveredIndex !== -2) {
      idx = this.hoveredIndex;
    }
    const chartType = data.chartType || this.options.chartType;
    if (idx > -1 && chartType === this.chartType) {
      if (this.isGrouped) {
        return this.getDrawData(idx, data);
      } else if (this.options.chartType === 'pieChart' || this.options.chartType === 'radialGauge') {
        return this.getDrawData(idx, data);
      } else {
        const key = this.options.x0(data);
        const ndata = this.data.filter((d: any) => key === this.options.x0(d) || (key === d.key));
        if (ndata.length > 0) {
          return this.isStacked ? this.getStackedData(idx, ndata[0]) : this.getDrawData(idx, ndata[0]);
        }
      }
    }
  }

  private getStackedData(idx: number, data): IccD3Interactive[] {
    const d = data[idx];
    if (d && d.data) {
      const r: IccD3Interactive = {
        key: data.key,
        value: d,
        color: this.getStackeddrawColor(data, idx),
        valueX: this.options.x(d.data),
        valueY: `${d[1] - d[0]}`,
        cy: this.scale.y(d[1]),
        hovered: this.hoveredKey === data.key,
        hasSummary: !this.normalized,
        reverse: this.reverse,
        normalized: this.normalized
      };
      this.setValueXY(r, idx);
      return [r];
    }
  }

  getDrawData(idx: number, data: T): IccD3Interactive[] {
    const d = this.options.y0(data).filter((t, i) => i === idx);
    if (d.length > 0) {
      const r: IccD3Interactive = {
        key: this.options.x0(data),
        value: d,
        color: d[0].color || this.getdrawColor(data, idx),
        valueX: this.options.x(d[0]),
        valueY: this.options.y(d[0]),
        cy: this.scale.y(this.options.y(d[0])),
        hovered: this.hoveredKey === this.options.x0(data),
        hasSummary: this.isGrouped
      };
      this.setValueXY(r, idx);
      return [r];
    }
  }

  setValueXY(r: IccD3Interactive, idx: number): void { }

  getHoveredIndex(e): { idx: number, jdx: number } {
    const group = this.svg.select(`.${this.chartType}`).selectAll('g');
    const nodes = group.nodes();
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
    return { idx: i, jdx: j };
  }
}

