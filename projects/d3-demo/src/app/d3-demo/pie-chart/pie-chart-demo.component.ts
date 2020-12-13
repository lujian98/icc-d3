import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IccD3Options, IccUtils } from 'icc';

@Component({
  selector: 'app-pie-chart-demo',
  styles: [':host {height: 100%; display: flex; flex-direction: column;}'],
  template: `
  <div style="height: 100%; display: flex;">
    <icc-d3 [options]="options" [data]="data"></icc-d3>
    <icc-d3 [options]="options2" [data]="data2"></icc-d3>
  </div>
  `,
})
export class AppPieChartDemoComponent implements OnInit {

  options: IccD3Options = {
    chartType: 'pieChart',
    xScaleType: 'band',
    axisEnabled: true,
    x: (d) => d.key,
    y: (d) => d.y,
    drawColor: (d, i) => d.key,
    legend: {
      position: 'top',
    }
  };

  options2: IccD3Options = {
    chartType: 'pieChart',
    xScaleType: 'band',
    axisEnabled: true,
    x: (d) => d.key,
    y: (d) => d.y,
    drawColor: (d, i) => d.key,
    legend: {
      position: 'right',
      align: 'center'
    },
    pie: {
      startAngle: Math.PI * -1 / 2,
      endAngle: Math.PI * 1 / 2,
    }
  };

  data0 = [{
    key: 'One',
    y: 1
  },
  {
    key: 'Two',
    y: 2
  },
  {
    key: 'Three',
    y: 3
  },
  {
    key: 'Four',
    y: 4
  },

  {
    key: 'Five',
    y: 5
  },
  {
    key: 'Six',
    y: 6
  },
  {
    key: 'Seven',
    y: 7
  }];

  data: any[];
  data2: any[];

  constructor(
    protected cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.data = [{
      key: 'Pie Chart',
      values: IccUtils.clone(this.data0),
    }];
    this.data2 = [{
      key: 'Pie Chart',
      values: IccUtils.clone(this.data0),
    }];

    const ndata = this.data0;
    setInterval(() => {
      ndata.forEach((d) => {
        d.y = 1 + Math.floor(Math.random() * 10);
      });
      this.data = [{
        key: 'Pie Chart',
        values: IccUtils.clone(ndata),
      }];
      this.data2 = [{
        key: 'Pie Chart',
        values: IccUtils.clone(ndata),
      }];
      // this.cd.detectChanges();
    }, 10000);
  }
}


