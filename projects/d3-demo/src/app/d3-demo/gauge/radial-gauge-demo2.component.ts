import { Component, OnInit } from '@angular/core';
import * as d3Scale from 'd3-scale';
import * as d3Interpolate from 'd3-interpolate';
import { IccD3Options } from 'icc';

@Component({
  selector: 'app-radial-gauge-demo2',
  styles: [':host {height: 100%; display: flex; flex-direction: column;}'],
  template: `
  <div style="height: 100%; display: flex;">
    <icc-d3 [options]="options" [data]="data"></icc-d3>
    <icc-d3 [options]="options2" [data]="data2"></icc-d3>
  </div>
  <div style="height: 100%; display: flex; margin-top: 20px;">
    <icc-d3 [options]="options4" [data]="data4"></icc-d3>
    <icc-d3 [options]="options3" [data]="data3"></icc-d3>
  </div>
  `,
})
export class AppRadialGaugeDemo2Component implements OnInit {

  colorRange: any = ['green', 'orange'];
  interpolate: any = d3Interpolate.interpolateRgb;
  options: IccD3Options = {
    chartType: 'radialGauge',
    // y0: (d) => d.values,
    y: (d) => d,
    radialGauge: {
      startAngle: Math.PI * -1 / 2,
      endAngle: Math.PI * 1 / 2,
      donut: 0.8,
      enableGradients: true,
      colorScale: d3Scale.scaleLinear().range(this.colorRange).interpolate(this.interpolate),
      valueUnit: 'kW',
      range: [
        {
          value: 0,
        },
        {
          value: 5,
        },
        {
          value: 10,
        }
      ]
    }
  };

  options2: IccD3Options = {
    chartType: 'radialGauge',
    // y0: (d) => d.value2,
    y: (d) => d,
    radialGauge: {
      enableGradients: true,
      majorGraduations: 4,
      donut: 0.6,
      startAngle: Math.PI * -1 / 8,
      endAngle: Math.PI * 1 / 2,
      centerOffsetY: 0 / 150,
      range: [
        {
          value: 0,
          color: 'green'
        },
        {
          value: 1,
          color: 'rgb(156, 214, 130)'
        },
        {
          value: 2.,
          color: '#8DCA2F'
        },
        {
          value: 3.,
          color: '#FDC702'
        },
        {
          value: 4.,
          color: '#FF7700'
        },
        {
          value: 5.0,
          color: '#C50200'
        },
        {
          value: 6.0,
          color: 'red'
        }
      ]
    }
  };

  options3: IccD3Options = {
    chartType: 'radialGauge',
    // y0: (d) => d.value2,
    y: (d) => d,
    radialGauge: {
      majorGraduations: 6,
      startAngle: Math.PI * 1 / 2,
      endAngle: Math.PI * 3 / 2,
      centerOffsetY: 0,
      valueUnit: 'kW',
      range: [
        {
          value: 0,
          color: 'green'
        },
        {
          value: 1,
          color: 'rgb(156, 214, 130)'
        },
        {
          value: 2.,
          color: '#8DCA2F'
        },
        {
          value: 3.,
          color: '#FDC702'
        },
        {
          value: 4.,
          color: '#FF7700'
        },
        {
          value: 5.0,
          color: '#C50200'
        },
        {
          value: 6.0,
          color: 'red'
        }
      ]
    }
  };

  options4: IccD3Options = {
    chartType: 'radialGauge',
    // y0: (d) => d.value2,
    y: (d) => d,
    radialGauge: {
      majorGraduations: 6,
      startAngle: Math.PI * 0,
      endAngle: Math.PI * 1 / 1,
      centerOffsetY: 0,
      valueUnit: 'kW',
      range: [
        {
          value: 0,
          color: 'green'
        },
        {
          value: 1,
          color: 'rgb(156, 214, 130)'
        },
        {
          value: 2.,
          color: '#8DCA2F'
        },
        {
          value: 3.,
          color: '#FDC702'
        },
        {
          value: 4.,
          color: '#FF7700'
        },
        {
          value: 5.0,
          color: '#C50200'
        },
        {
          value: 6.0,
          color: 'red'
        }
      ]
    },
  };

  data = [{ values: [4.3] }];
  data2 = [{ values: [1.2] }];
  data3 = [{ values: [2.72] }]
  data4 = [{ values: [3.4] }];
  ngOnInit(): void {
    // this.data = [{ value: 4.3, }];
    // this.data2 = [{ value: 2.0, }];
    // this.data3 =[{ value: 4.52 }];
  }
}
