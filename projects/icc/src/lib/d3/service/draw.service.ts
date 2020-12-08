import { Injectable } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Dispatch from 'd3-dispatch';
import { IccScaleDraw, IccAbstractDraw } from '../draw';
import {
  IccLineChart,
  IccAreaChart,
  IccStackedAreaChart,
  IccBarChart,
  IccGroupedBarChart,
  IccStackedBarChart,
  IccHorizontalBarChart,
  IccGroupedHorizontalBarChart,
  IccStackedHorizontalBarChart,
  IccPieChart,
  IccCandleStickBarChart
} from '../chart';

@Injectable()
export class IccDrawServie<T> {

  componentMapper = {
    lineChart: IccLineChart,
    areaChart: IccAreaChart,
    stackedAreaChart: IccStackedAreaChart,
    stackedNormalizedAreaChart: IccStackedAreaChart,
    stackedStreamAreaChart: IccStackedAreaChart,

    barChart: IccBarChart,
    groupedBarChart: IccGroupedBarChart,
    stackedBarChart: IccStackedBarChart,
    stackedNormalizedBarChart: IccStackedBarChart,

    horizontalBarChart: IccHorizontalBarChart,
    groupedHorizontalBarChart: IccGroupedHorizontalBarChart,
    stackedHorizontalBarChart: IccStackedHorizontalBarChart,
    stackedNormalizedHorizontalBarChart: IccStackedHorizontalBarChart,

    pieChart: IccPieChart,

    candleStickBarChart: IccCandleStickBarChart,
  };

  constructor() { }

  getDraw(
    svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
    scale: IccScaleDraw<T>,
    dispatch: d3Dispatch.Dispatch<{}>,
    chartType: string
  ): IccAbstractDraw<T> {
    let component = this.componentMapper[chartType];
    if (!component) {
      component = this.componentMapper.lineChart;
    }
    const componentRef = new component(svg, scale, dispatch, chartType);
    return componentRef;
  }
}

