import * as d3 from 'd3-selection';
import { IccScaleDraw } from './scale-draw';
import { IccScale } from '../model/model';

export abstract class IccAbstractDraw<T> {
  protected data: T[];
  protected prevData: T[];
  isStacked = false;
  chartType: string;
  protected isAnimation = false;

  abstract drawContents(drawName: string, scaleX: IccScale, scaleY: IccScale, xGroup: IccScale, yGroup: IccScale): void;
  abstract redrawContent(drawName: string, scaleX: IccScale, scaleY: IccScale, xGroup: IccScale, yGroup: IccScale): void;
  abstract legendMouseover(data: T[], mouseover: boolean): void;

  constructor(
    protected svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
    protected scale: IccScaleDraw,
    protected options: any,
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
}

