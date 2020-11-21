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
import { AppStockHistoryDemoComponent } from './horizontal-bar-chart/stock-history-demo.component';


import { AppCandleStickChartDemoComponent } from './candle-stick-chart/candle-stick-chart-demo.component';


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
  { path: 'stock-history-demo', component: AppStockHistoryDemoComponent },

  { path: 'candle-stick-chart', component: AppCandleStickChartDemoComponent },
  // { path: 'demo-brush-d3', component: AppD3BrushChartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppD3DemoRoutingModule { }
