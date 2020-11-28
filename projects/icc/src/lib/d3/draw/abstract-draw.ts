import * as d3 from 'd3-selection';
import * as d3Dispatch from 'd3-dispatch';
import { IccScaleDraw } from './scale-draw';
import { IccScale, IccD3Options } from '../model';

export abstract class IccAbstractDraw<T> {
  chartType: string;
  protected data: T[];
  protected prevData: T[];
  protected isAnimation = false;
  protected isStacked = false;
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
    protected options: IccD3Options,
    protected dispatch: d3Dispatch.Dispatch<{}>,
    chartType: string
  ) {
    this.chartType = chartType;
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
  getDataByIdx(idx, data): {} {
    if (this.hoveredIndex !== -2) {
      idx = this.hoveredIndex;
    }
    const chartType = data.chartType || this.options.chartType;
    if (idx > -1 && chartType === this.chartType) {
      if (this.isGrouped) {
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

  private getStackedData(idx, data): {} {
    const d = data[idx];
    const r: any = {
      key: data.key,
      isStacked: true,
      hasSummary: !this.normalized,
      index: data.index,
      hovered: this.hoveredKey === data.key,
      value: d,
    };
    if (d.data) {
      r.valueY = d[1] - d[0];
      this.setStackedValueXY(r);
    }
    r.color = this.getStackeddrawColor(r, 0);
    return r;
  }

  setStackedValueXY(r): void {
    r.valueX = this.options.x(r.value.data);
    r.cy = this.scale.y(r.value[1]);
  }

  private getDrawData(idx, data): {} {
    const r: any = {};
    for (const [k, v] of Object.entries(data)) {
      if (!Array.isArray(data[k])) {
        r[k] = v;
      } else {
        r.value = data[k].filter((t, i) => i === idx);
        if (r.value.length > 0) {
          this.setValueXY(r);
          r.color = r.value[0].color || this.getdrawColor(r, idx);
        }
      }
    }
    r.key = this.options.x0(r);
    r.hovered = this.hoveredKey === r.key;
    r.hasSummary = this.isGrouped;
    return r;
  }

  setValueXY(r): void {
    r.valueX = this.options.x(r.value[0]);
    r.valueY = this.options.y(r.value[0]);
    r.cy = this.scale.y(this.options.y(r.value[0]));
  }

  getHoveredIndex(e): any {
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

