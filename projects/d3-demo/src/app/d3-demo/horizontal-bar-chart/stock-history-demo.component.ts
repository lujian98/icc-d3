import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IccDrawServie } from 'icc';
import { AppDrawServie } from './draw/draw-service';

import { STOCK_PRICE } from '../shared/stock_price';
import { IccD3Component } from 'icc';

@Component({
  selector: 'app-stock-history-demo',
  styles: [':host { height: 100%; display: flex;'],
  template: `
    <icc-d3 [options]="options" [data]="data"></icc-d3>
  `,
  providers: [
    {
      provide: IccDrawServie,
      useClass: AppDrawServie
    }
  ]
})
export class AppStockHistoryDemoComponent<T> implements OnInit {
  options = {
    chartType: 'horizontalBarChart',
    margin: { top: 10, right: 60, bottom: 20, left: 80 },
    xScaleType: 'linear',
    yScaleType: 'band',
    x0: (d) => d.key,
    y0: (d) => d.values,
    x: (d) => d.value,
    y: (d) => d.name,
    barColor: (d, i) => d.name,
  };

  data: any[];

  @ViewChild(IccD3Component) iccd3: IccD3Component<T>;

  constructor(
    protected cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    const ndata = STOCK_PRICE;
    let k = 0;
    setInterval(() => {
      const vdata = ndata[k];
      if (vdata && k <= 100) {
        vdata.values = vdata.values.filter((v, i) => i < 16);
        this.data = [vdata];
        this.cd.detectChanges();
        k++;
      }
    }, 250);
  }
}

