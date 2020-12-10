import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IccD3Module } from 'icc';
import { AppD3DemoRoutingModule } from './d3-demos-routing.module';

import { AppD3DemosComponent } from './d3-demos.component';

import { AppLineChartDemoComponent } from './line-chart/line-chart-demo.component';
import { AppMultiSeriesDemoComponent } from './line-chart/multi-series-demo.component';
import { AppAreaChartDemoComponent } from './area-chart/area-chart-demo.component';
import { AppStackedAreaChartDemoComponent } from './area-chart/stacked-area-chart-demo.component';
import { AppStreamAreaChartDemoComponent } from './area-chart/stream-area-chart-demo.component';

import { AppBarChartDemoComponent } from './bar-chart/bar-chart-demo.component';
import { AppHistoricalBarChartComponent } from './bar-chart/historical-bar-chart.component';

import { AppGroupedBarChartDemoComponent } from './bar-chart/grouped-bar-chart-demo.component';
import { AppStackedBarChartDemoComponent } from './bar-chart/stacked-bar-chart-demo.component';
import { AppLinearStackedBarChartComponent } from './bar-chart/linear-stacked-bar-chart.component';

import { AppHorizontalBarDemoComponent } from './horizontal-bar-chart/horizontal-bar-chart-demo.component';
import { AppGroupedHorizontalBarDemoComponent } from './horizontal-bar-chart/grouped-horizontal-bar-chart-demo.component';
import { AppStackedHorizontalBarDemoComponent } from './horizontal-bar-chart/stacked-horizontal-bar-chart-demo.component';
import { AppStackedNormalizedHorizontalBarDemoComponent } from './horizontal-bar-chart/stacked-normalized-horizontal-bar-chart-demo.component';
import { AppStockHistoryDemoComponent } from './horizontal-bar-chart/stock-history-demo.component';

import { AppPieChartDemoComponent } from './pie-chart/pie-chart-demo.component';
import { AppDonutChartDemoComponent } from './pie-chart/donut-chart-demo.component';

import { AppCandleStickChartDemoComponent } from './candle-stick-chart/candle-stick-chart-demo.component';

import { AppRadialGaugeDemoComponent } from './gauge/radial-gauge-demo.component';

const components = [
  AppD3DemosComponent,

  AppLineChartDemoComponent,
  AppMultiSeriesDemoComponent,
  AppAreaChartDemoComponent,
  AppStackedAreaChartDemoComponent,
  AppStreamAreaChartDemoComponent,

  AppBarChartDemoComponent,
  AppHistoricalBarChartComponent,
  AppGroupedBarChartDemoComponent,
  AppStackedBarChartDemoComponent,
  AppLinearStackedBarChartComponent,

  AppHorizontalBarDemoComponent,
  AppGroupedHorizontalBarDemoComponent,
  AppStackedHorizontalBarDemoComponent,
  AppStackedNormalizedHorizontalBarDemoComponent,
  AppStockHistoryDemoComponent,

  AppPieChartDemoComponent,
  AppDonutChartDemoComponent,

  AppCandleStickChartDemoComponent,

  AppRadialGaugeDemoComponent
];

@NgModule({
  imports: [
    CommonModule,
    IccD3Module,
    AppD3DemoRoutingModule
  ],
  declarations: [...components],
  exports: [...components]
})
export class AppD3DemosModule { }

