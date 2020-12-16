import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


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
import { AppRadialGaugeDemo2Component } from './gauge/radial-gauge-demo2.component';
import { AppBulletChartDemoComponent } from './bullet-chart/bullet-chart-demo.component';

const routes: Routes = [
  { path: 'line-chart', component: AppLineChartDemoComponent },
  { path: 'multi-series-chart', component: AppMultiSeriesDemoComponent },
  { path: 'area-chart', component: AppAreaChartDemoComponent },
  { path: 'stacked-area-chart', component: AppStackedAreaChartDemoComponent },
  { path: 'stream-area-chart', component: AppStreamAreaChartDemoComponent },

  { path: 'bar-chart', component: AppBarChartDemoComponent },
  { path: 'historical-bar-chart', component: AppHistoricalBarChartComponent },
  { path: 'grouped-bar-chart', component: AppGroupedBarChartDemoComponent },
  { path: 'stacked-bar-chart', component: AppStackedBarChartDemoComponent },
  { path: 'linear-stacked-bar-chart', component: AppLinearStackedBarChartComponent },

  { path: 'horizontal-bar-chart', component: AppHorizontalBarDemoComponent },
  { path: 'grouped-horizontal-bar-chart', component: AppGroupedHorizontalBarDemoComponent },
  { path: 'stacked-horizontal-bar-chart', component: AppStackedHorizontalBarDemoComponent },
  { path: 'stacked-normalized-horizontal-bar-chart', component: AppStackedNormalizedHorizontalBarDemoComponent },
  { path: 'stock-history-demo', component: AppStockHistoryDemoComponent },

  { path: 'pie-chart-demo', component: AppPieChartDemoComponent },
  { path: 'donut-chart-demo', component: AppDonutChartDemoComponent },

  { path: 'candle-stick-chart', component: AppCandleStickChartDemoComponent },

  { path: 'radial-gauge-demo', component: AppRadialGaugeDemoComponent },
  { path: 'radial-gauge-demo2', component: AppRadialGaugeDemo2Component },
  { path: 'bullet-chart-demo', component: AppBulletChartDemoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppD3DemoRoutingModule { }
