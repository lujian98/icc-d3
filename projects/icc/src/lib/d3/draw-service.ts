import { Injectable } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Dispatch from 'd3-dispatch';
import { IccD3Options } from './model';
import { IccScaleDraw } from './draw/scale-draw';
import { IccAbstractDraw } from './draw/abstract-draw';
import { IccLineChart } from './chart/line-chart';
import { IccAreaChart } from './chart/area-chart';
import { IccStackedAreaChart } from './chart/stacked-area-chart';
import { IccBarChart } from './chart/bar-chart';
import { IccGroupedBarChart } from './chart/grouped-bar-chart';
import { IccStackedBarChart } from './chart/stacked-bar-chart';

import { IccHorizontalBarChart } from './chart/horizontal-bar-chart';
import { IccGroupedHorizontalBarChart } from './chart/grouped-horizontal-bar-chart';
import { IccStackedHorizontalBarChart } from './chart/stacked-horizontal-bar-chart';

import { IccPieChart } from './chart/pie-chart';

import { IccCandleStickBarChart } from './chart/candle-stick-bar-chart';

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
    options: IccD3Options,
    dispatch: d3Dispatch.Dispatch<{}>,
    chartType: string
  ): IccAbstractDraw<T> {
    let component = this.componentMapper[chartType];
    if (!component) {
      component = this.componentMapper.lineChart;
    }
    const componentRef = new component(svg, scale, options, dispatch, chartType);
    return componentRef;
  }
}

