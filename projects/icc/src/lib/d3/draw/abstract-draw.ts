import * as d3 from 'd3-selection';
import * as d3Dispatch from 'd3-dispatch';
import { IccScaleDraw } from './scale-draw';
import { IccScale, IccD3Options } from '../model';

export abstract class IccAbstractDraw<T> {
  protected data: T[];
  protected prevData: T[];
  isStacked = false;
  chartType: string;
  protected isAnimation = false;

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

  getDataByIdx(idx, data): {} {
    const chartType = data.chartType || this.options.chartType;
    if (chartType === this.chartType) {
      if (idx === 0) {
        return this.getLinearData(idx, data);
      } else {
        const key = this.options.x0(data);
        const ndata = this.data.filter((d) => key === this.options.x0(d));
        if (ndata.length > 0) {
          return this.getDrawData(idx, ndata[0]);
        }
      }
    }
  }

  getDrawData(idx, data): {} {
    return this.getLinearData(idx, data);
  }

  getLinearData(idx, data): {} {
    const r: any = {};
    for (const [k, v] of Object.entries(data)) {
      if (!Array.isArray(data[k])) {
        r[k] = v;
      } else {
        r.value = data[k].filter((t, i) => i === idx);
        if (r.value.length > 0) {
          r.valueX = this.options.x(r.value[0]);
          r.valueY = this.options.y(r.value[0]);
          r.cy = this.scale.y(this.options.y(r.value[0]));
        }
      }
    }
    r.key = this.options.x0(r);
    r.color = this.getdrawColor(r, 0);
    return r;
  }

  redraw(): void {
    this.redrawContent(`.${this.chartType}`, this.scale.x, this.scale.y, this.scale.xGroup, this.scale.yGroup);
  }

  getdrawColor = (d, i) => d.color || this.scale.colors(this.options.drawColor(d, i));

  getBarColor = (d, i) => d.color || (this.options.barColor && this.scale.colors(this.options.barColor(d, i)));

  getStackeddrawColor = (d, i) => d.color || this.scale.colors(d.key); // key is from stacked data
}

