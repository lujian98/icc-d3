import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Scale from 'd3-scale';
import * as d3Zoom from 'd3-zoom';
import * as d3Shape from 'd3-shape';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import { IccD3BaseComponent } from './d3.base.component';
import { UNEMPLOYMENT } from '../shared/unemployment';

@Component({
  selector: 'app-d3-line2-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './d3-line2-chart.component.html',
  styleUrls: ['./d3-line2-chart.component.scss']
})
export class AppD3Line2ChartComponent extends IccD3BaseComponent implements OnInit {
  data: any;

  options = {
    x0: (d) => d.State,
    y0: (d) => d.values,
    x: (d) => d.key,
    y: (d) => d.value
  };
  xGroup: any;
  series: any[];
  ngOnInit() {
    console.log(' this.data =', this.data);
    // this.data = this.formatData(this.data);
    console.log(' 222 this.data =', this.data);


    this.data = UNEMPLOYMENT;
    //   console.log('udata =', data);


    this.updateChart(this.data);

  }

  public createChart(data: any) {
    this.clearElement();
    // this.initSvg();

    this.draw = d3Shape.area()
      .x(d => {
        // console.log( ' d =', d)
        return this.x(d['data'].date as Date)
      })
      .y0(d => this.y(d[0]))
      .y1(d => this.y(d[1]))

    this.setScale();
    this.setDrawDomain(data);


    this.svg = d3.select(this.elementRef.nativeElement).select('svg')

    this.svg.append("g")
      .selectAll("path")
      .data(this.series)
      .join("path")
      .attr("fill", ({ key }) => this.colors(key))
      .attr("d", this.draw)
      .append("title")
      .text(({ key }) => key);


    // this.drawAxis();

    /*

    this.initChart();
    this.initdraw();

    this.drawFocus();
    this.drawBrush();
    this.drawChart(data); */
  }




  formatData(data) {
    const ndata = data.map((d) => {
      this.getValues(d);
      const ret = {
        State: d.State,
        values: this.getValues(d)
      };
      return ret;
    });
    return ndata;
  }

  private getValues(data) {
    const ret = [];
    for (const item in data) {
      if (item !== 'State') {
        ret.push({
          key: item,
          value: data[item]
        });
      }
    }
    return ret;
  }

  initChart() {



  }

  /*


  d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])

    d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
    .range([height - margin.bottom, margin.top])


    */
  setScale() {
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);

    // this.xGroup = d3Scale.scaleBand().padding(0.05);

    this.x2 = d3Scale.scaleTime().range([0, this.width]);
    this.y2 = d3Scale.scaleLinear().range([this.height2, 0]);


    this.colors = d3Scale.scaleOrdinal(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

    this.xAxis = d3Axis.axisBottom(this.x).ticks(this.width / 80).tickSize(-this.height);
    this.xAxis2 = d3Axis.axisBottom(this.x2);
    this.yAxis = d3Axis.axisLeft(this.y).tickSize(-this.width);
  }

  /*
  xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

    */

  setDrawDomain(data) {
    const keys = [];

    for (const [key, value] of Object.entries(data[0])) {
      // console.log( key, ' =', value)
      if (key !== 'date') {
        keys.push(key);
      }
    }

    console.log(' keys =', keys)
    console.log(' eeeeeeeeeee data =', data)
    this.series = d3Shape.stack().keys(keys)(data as any);
    console.log(' series=', this.series)

    this.colors = d3Scale.scaleOrdinal()
      .domain(keys)
      .range(d3ScaleChromatic.schemeCategory10)


    // (d3Array.extent(xdata, (d: Date) => d));
    const xdomain = d3Array.extent(data, (d: any) => {
      //console.log(' dddddd =', d)
      return d.date;
    });
    this.x.domain(xdomain);

    console.log(' xdomain =', xdomain)

    // .domain([0, d3Array.max((this.series, d => d3Array.max((d, d => d[1]))]).nice()
    const maxv = d3Array.max(this.series, d => d3Array.max(d, d => d[1]));
    console.log(' maxv =', maxv)
    this.y.domain([0, maxv]).nice();
    this.x2.domain(this.x.domain());
    this.y2.domain(this.y.domain());
  }

  drawChart(data: any) {

    const drawBarGroup = this.svg.select('.drawarea').selectAll('g')
      .data(this.series)
      .enter().append('g')
      .attr('fill', (d, i) => this.colors(i));

    const drawContents = drawBarGroup.selectAll('rect')
      .data(d => d)
      .enter().append('g');

    drawContents.append('rect')
      .attr('class', 'stackbar draw')
      .attr('x', d => {
        console.log(' 111 data =', d);
        // console.log(' this.options.x0(d.data) =', this.options.x0(d.data))  //     x0: (d) => d.State,
        return this.x(d['date'])
      })
      .attr('y', d => this.y(d[1]))
      .attr('height', d => this.y(d[0]) - this.y(d[1]))
    // .attr('width', this.scale.x.bandwidth());

    /*

        const drawBarGroup = this.svg.select('.stackedBarChart').selectAll('g')
      .data(stackdata)
      .enter().append('g')
      .attr('fill', (d, i) => this.getdrawColor(d, i));

    const drawContents = drawBarGroup.selectAll('rect')
      .data(d => d)
      .enter().append('g');

    drawContents.append('rect')
      .attr('class', 'stackbar draw')
      .attr('x', d => {
        console.log(' 111 data =', d);
        console.log(' this.options.x0(d.data) =', this.options.x0(d.data))  //     x0: (d) => d.State,
        return this.scale.x(this.options.x0(d.data))
      })
      .attr('y', d => this.scale.y(d[1]))
      .attr('height', d => this.scale.y(d[0]) - this.scale.y(d[1]))
      .attr('width', this.scale.x.bandwidth());


  svg.append("g")
    .selectAll("path")
    .data(series)
    .join("path")
      .attr("fill", ({key}) => color(key))
      .attr("d", area)


      const drawContents = this.drawArea.selectAll('g')
        .selectAll("path")
        .data(this.series)
        .join("path")
        .attr("fill", ({ key }) => this.colors(key))
        .attr("d", this.draw)

      /*
        svg.append("g")
          .selectAll("path")
          .data(series)
          .join("path")
            .attr("fill", ({key}) => color(key))
            .attr("d", area)
          .append("title")
            .text(({key}) => key);



      const brushContents = this.brushArea.selectAll('g')
        .data(data)
        .enter().append('g')
        .attr('transform', (d) => 'translate(' + this.x(this.options.x0(d)) + ',0)');

      brushContents.selectAll('rect')
        .data((d) => this.options.y0(d))
        .enter().append('rect')
        .attr('class', 'bar, draw')
        .attr('x', (d) => this.xGroup(this.options.x(d)))
        .attr('y', (d) => this.y2(this.options.y(d)))
        .attr('width', this.xGroup.bandwidth())
        .attr('height', (d) => this.height2 - this.y2(this.options.y(d)))
        .attr('fill', (d, i) => this.colors(this.options.x(d)));           */
  }

  zoomed(event) {
    if (event.sourceEvent) {
      const t = event.transform;
      const x0 = this.x2.range();
      const x = x0.map(d => t.applyX(d));
      this.updateRange(x);
      const range = [
        x0[0] + (x0[0] - x[0]) / t.k,
        x0[1] + (x0[1] - x[1]) / t.k
      ];
      this.context.select('.brush').call(this.brush.move, range);
    }
  }

  brushed(event) {
    if (event.sourceEvent) {
      const range = event.selection || this.x2.range();
      const x0 = this.x2.range();
      const scale = this.width / (range[1] - range[0]);
      const x = [
        x0[0] + (x0[0] - range[0]) * scale,
        x0[1] + (x0[1] - range[1]) * scale
      ];
      this.updateRange(x);
      this.svg.select('.zoom').call(this.zoom.transform, d3Zoom.zoomIdentity
        .scale(this.width / (range[1] - range[0]))
        .translate(-range[0], 0));
    }
  }

  private updateRange(range) {
    this.x.range(range);
    this.xGroup.rangeRound([0, this.x.bandwidth()]);
    this.redraw();
    this.xAxisArea.select('.axis--x').call(this.xAxis);
    this.yAxisArea.select('.axis--y').call(this.yAxis);
  }

  redraw() {
    this.drawArea.selectAll('.barGroup')
      .attr('transform', (d) => 'translate(' + this.x(this.options.x0(d)) + ',0)');

    this.drawContents.selectAll('.draw')
      .attr('x', (d) => this.xGroup(this.options.x(d)))
      .attr('width', this.xGroup.bandwidth());
  }
}

