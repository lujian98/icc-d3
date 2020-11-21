import { Component, ViewEncapsulation, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Axis from 'd3-axis';
import * as d3Zoom from 'd3-zoom';
import * as d3Brush from 'd3-brush';
import * as d3Array from 'd3-array';
import * as d3TimeFormat from 'd3-time-format';
import { IccD3BaseComponent } from './d3.base.component';

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface Stock {
  date: Date;
  price: number;
}

import { SP500 } from '../shared/sp500';

@Component({
  selector: 'app-d3-brush-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './d3-brush-chart.component.html',
  styleUrls: ['./d3-brush-chart.component.scss']
})
export class AppD3BrushChartComponent extends IccD3BaseComponent implements OnInit, OnChanges {

  @Input() data: any;
  clipPathId = 'clip';
  focusTransform: any;

  private parseDate = d3TimeFormat.timeParse('%b %Y');

  options = {
    x: (d) => d.date,
    y: (d) => d.price,
  };

  private parseData(data: any[]): Stock[] {
    return data.map(v => <Stock>{ date: this.parseDate(v.date), price: v.price });
  }

  ngOnInit() {
    this.data = SP500;
    const data = [{
      key: 'SP500',
      values: this.parseData(this.data)
    }];
    this.data = data;
    this.updateChart(this.data);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.data = this.parseData(this.data);
      this.updateChart(this.data);
    }
  }

  initChart() {
    const draw = d3Shape.area()
      .curve(d3Shape.curveMonotoneX)
      .x((d: any) => this.x(this.options.x(d)))
      .y0(this.height)
      .y1((d: any) => this.y(this.options.y(d)));
    this.draw = (d) => draw(d.values);

    const draw2 = d3Shape.area()
      .curve(d3Shape.curveMonotoneX)
      .x((d: any) => this.x2(this.options.x(d)))
      .y0(this.height2)
      .y1((d: any) => this.y(this.options.y(d)));
    this.draw2 = (d) => draw2(d.values);

    const draw3 = d3Shape.area()
      // .curve(d3Shape.curveMonotoneX)
      .x((d: any) => this.leftpanelx(this.options.x(d)))
      .y0(this.height)
      .y1((d: any) => this.leftpanely(this.options.y(d)));
    this.draw3 = (d) => draw3(d.values);

  }

  setDrawDomain(data) {
    const xdata = data.map((v) => v.values.map((v) => v.date))[0];
    this.x.domain(d3Array.extent(xdata, (d: Date) => d));

    this.leftpanelx.domain(this.x.domain());

    const maxv = d3Array.max(data, (c) => d3Array.max(c['values'], (d) => this.options.y(d)));
    const minv = -1400;
    this.y.domain([minv, maxv]);
    this.leftpanely.domain([minv, maxv]);
    super.setDrawDomain(data);
    this.y2.domain([minv, maxv]);
  }

  drawChart(data: Stock[]) {
    this.drawContents = this.drawArea.selectAll('g')
      .data(data)
      .enter().append('g');

    this.drawContents.append('path')

      .attr('stroke', 'red')
      .attr('stroke-width', 1.5)
      .attr('class', 'area draw')
      .attr('fill', 'orange')
      .attr('d', this.draw);

    const brushContents = this.brushArea.selectAll('g')
      .data(data)
      .enter().append('g');

    brushContents.append('path')
      .attr('stroke', 'red')
      .attr('stroke-width', 1.0)
      .attr('class', 'area draw')
      .attr('fill', 'orange')
      .attr('d', this.draw2);

    const brushyContents = this.brushyArea.selectAll('g')
      .data(data)
      .enter().append('g');

    brushyContents.append('path')
      .attr('stroke', 'red')
      .attr('stroke-width', 1.0)
      .attr('class', 'area draw')
      .attr('fill', 'green')
      .attr('d', this.draw3);



    /*      .attr("d", leftpanelarea);

  brushyContents.append('path')
    .attr('stroke', 'red')
    .attr('stroke-width', 1.0)
    .attr('class', 'area draw')
    .attr('fill', 'orange')
    .attr('d', this.draw3); */
  }
}
