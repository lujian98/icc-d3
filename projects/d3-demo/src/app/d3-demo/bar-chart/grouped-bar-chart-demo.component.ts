import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grouped-bar-chart-demo',
  styles: [':host { height: 100%; display: flex; flex-direction: column;'],
  template: `
    <icc-d3 [options]="options" [data]="data"></icc-d3>
    <icc-d3 [options]="options2" [data]="data2"></icc-d3>
  `,
})
export class AppGroupedBarChartDemoComponent implements OnInit {
  data = [
    {
      State: 'CA',
      'Under 5 Years': 2704659,
      '5 to 13 Years': 4499890,
      '14 to 17 Years': 2159981,
      '18 to 24 Years': 3853788,
      '25 to 44 Years': -10604510,
      '45 to 64 Years': 8819342,
      '65 Years and Over': 4114496
    },
    {
      State: 'TX',
      'Under 5 Years': 2027307,
      '5 to 13 Years': 3277946,
      '14 to 17 Years': -1420518,
      '18 to 24 Years': 2454721,
      '25 to 44 Years': -7017731,
      '45 to 64 Years': 5656528,
      '65 Years and Over': 2472223
    },
    {
      State: 'NY',
      'Under 5 Years': 1208495,
      '5 to 13 Years': 2141490,
      '14 to 17 Years': -1058031,
      '18 to 24 Years': 1999120,
      '25 to 44 Years': -5355235,
      '45 to 64 Years': 5120254,
      '65 Years and Over': 2607672
    },
    {
      State: 'FL',
      'Under 5 Years': 1140516,
      '5 to 13 Years': 1938695,
      '14 to 17 Years': 925060,
      '18 to 24 Years': -1607297,
      '25 to 44 Years': -4782119,
      '45 to 64 Years': 4746856,
      '65 Years and Over': 3187797
    },
    {
      State: 'IL',
      'Under 5 Years': 894368,
      '5 to 13 Years': 1558919,
      '14 to 17 Years': -725973,
      '18 to 24 Years': -1311479,
      '25 to 44 Years': 3596343,
      '45 to 64 Years': -3239173,
      '65 Years and Over': 1575308
    },
    {
      State: 'PA',
      'Under 5 Years': -737462,
      '5 to 13 Years': -1345341,
      '14 to 17 Years': 679201,
      '18 to 24 Years': 1203944,
      '25 to 44 Years': 3157759,
      '45 to 64 Years': 3414001,
      '65 Years and Over': -1910571
    }
  ];
  options = {
    chartType: 'groupedBarChart',
    xScaleType: 'band',
    margin: { top: 10, right: 50, bottom: 20, left: 60 },
    x0: (d) => d.label,
    y0: (d) => d.values,
    x: (d) => d.State,
    y: (d) => d.value,
    drawColor: (d, i) => d.label,
    colors: ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']
  };

  options2 = {
    chartType: 'groupedBarChart',
    xScaleType: 'band',
    x0: (d) => d.key,
    y0: (d) => d.values,
    x: (d) => d.label,
    y: (d) => d.value,
    drawColor: (d, i) => d.key
    // colors: ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']
  };


  data2 = [{
    key: 'Series1',
    // color: 'blue',
    values: [{

      label: 'Group A',
      value: 11.8746444827653
    },
    {
      label: 'Group B',
      value: 18.0961543492239
    },
    {
      label: 'Group C',
      value: 10.57072943117674
    },
    {
      label: 'Group D',
      value: 12.4174010336624
    },
    {
      label: 'Group E',
      value: 20.72009071426284
    },
    {
      label: 'Group F',
      value: 30.77154485523777
    },
    {
      label: 'Group G',
      value: 40.90152097798131
    },
    {
      label: 'Group H',
      value: 30.91445417330854
    },
    {
      label: 'Group I',
      value: 20.055746319141851
    }]
  },
  {
    key: 'Series2',
    // color: '#1f77b4',
    values: [{
      label: 'Group A',
      value: 25.307646510375
    },
    {
      label: 'Group B',
      value: 16.756779544553
    },
    {
      label: 'Group C',
      value: 18.451534877007
    },
    {
      label: 'Group D',
      value: 18.6142352811805
    },
    {
      label: 'Group E',
      value: 17.8082472075876
    },
    {
      label: 'Group F',
      value: 15.259101026956
    },
    {
      label: 'Group G',
      value: 20.30947953487127
    },
    {
      label: 'Group H',
      value: 30
    },
    {
      label: 'Group I',
      value: 50
    }]
  }];

  ngOnInit() {
    this.data = this.formatData(this.data);
  }

  private formatData(data) {
    const keys = ['Under 5 Years', '5 to 13 Years', '14 to 17 Years', '18 to 24 Years', '25 to 44 Years', '45 to 64 Years', '65 Years and Over']
    const ndata = [];
    keys.forEach((d) => {
      ndata.push({
        label: d,
        values: []
      });
    });
    data.forEach((d, i) => {
      keys.forEach((key, j) => {
        const t = {
          State: d.State,
          value: d[key]
        };
        ndata[j].values.push(t);
      });
    });
    return ndata;
  }
}

