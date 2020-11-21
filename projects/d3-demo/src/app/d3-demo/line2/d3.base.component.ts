import { Component, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Axis from 'd3-axis';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Zoom from 'd3-zoom';
import * as d3Brush from 'd3-brush';
// import { selection, BaseType, Selection } from 'd3-selection';

export interface Scale {
  x;
  y;
  colors;
  x2: any;
  y2: any;
  xAxis: any;
  xAxis2: any;
  yAxis: any;
}


@Component({
  selector: 'icc-d3-base',
  template: '',

})
export class IccD3BaseComponent {
  view = [960, 500];
  @Input() options = {};
  margin = { top: 10, right: 10, bottom: 100, left: 40 };
  margin2 = { top: 430, right: 10, bottom: 20, left: 40 };

  leftpanelmargin = { top: this.margin.top, right: this.margin.left - 40, bottom: this.margin.bottom, left: 40 };
  // leftpanelwidth = this.leftpanelmargin.right - this.leftpanelmargin.left + 100;
  leftpanelwidth = 50;

  width = 960 - this.margin.left - this.margin.right - 200;
  height = 500 - this.margin.top - this.margin.bottom;
  height2 = 500 - this.margin2.top - this.margin2.bottom;

  protected svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>;

  scale: Scale;
  x;
  y;
  colors;
  // z;

  x2: any;
  y2: any;
  xAxis: any;
  xAxis2: any;
  yAxis: any;

  drawContents: any;
  drawArea: any;
  brushArea: any;
  xAxisArea: any;
  yAxisArea: any;
  context: any;
  brush: any;
  zoom: any;

  draw: any;
  draw2: any;
  draw3: any;

  leftpanelx;
  leftpanelxAxis;
  leftpanely; //  = d3.scale.linear().range([0, leftpanelwidth]),
  leftpanelyAxis;
  brushy;
  brushyArea;
  brushyContext;

  constructor(protected elementRef: ElementRef) {
  }

  public updateChart(data: any) {
    if (!this.svg) {
      this.createChart(data);
      return;
    }
    // this.processData(data); // TODO
    // this.updateAreaCharts();
  }

  public createChart(data: any) {
    this.clearElement();
    this.initSvg();
    this.setScale();
    this.initChart();
    this.initdraw();
    this.setDrawDomain(data);
    this.drawAxis();
    this.drawFocus();
    this.drawBrush();
    this.drawChart(data);
  }

  public clearElement() {
    // !!!!Caution!!!
    // Make sure not to do;
    //     d3.select('svg').remove();
    // That will clear all other SVG elements in the DOM
    // d3.select(this.hostElement).select('svg').remove();
    d3.select(this.elementRef.nativeElement).select('g').remove();
  }

  public initSvg() {
    this.svg = d3.select(this.elementRef.nativeElement).select('svg')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
      .append('g');
  }

  setScale() {
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.colors = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10);

    this.x2 = d3Scale.scaleTime().range([0, this.width]);
    this.y2 = d3Scale.scaleLinear().range([this.height2, 0]);

    this.xAxis = d3Axis.axisBottom(this.x);
    this.xAxis2 = d3Axis.axisBottom(this.x2);
    this.yAxis = d3Axis.axisLeft(this.y);

    /*
        leftpanelx = d3.scale.linear().range([0, leftpanelwidth]),
        y = d3.scale.linear().range([height, 0]),
        bottompanely = d3.scale.linear().range([bottompanelheight, 0]),
        leftpanely = d3.scale.linear().range([height, 0]);

        */

    console.log( ' leftpanelwidth =', this.leftpanelwidth)

    this.leftpanelx = d3Scale.scaleTime().range([0, this.leftpanelwidth]),
    this.leftpanely = d3Scale.scaleLinear().range([this.height, 0]);
    this.leftpanelyAxis = d3Axis.axisRight(this.leftpanely); //.orient("left");

  }

  initChart() { }

  initdraw() {
    this.svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', this.width)
      // .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('height', this.height)
      .attr('x', 0)
      .attr('y', 0);

    this.drawArea = this.svg.append('g')
      .attr('class', 'drawarea')
      // .attr('clip-path', 'url(#clip)')
      // .attr('transform', 'translate(' + 100 + ',' + 0 + ')');

    this.xAxisArea = this.svg.append('g')
      .attr('class', 'xAxisArea')
      // .attr('clip-path', 'url(#clip)')
      // .attr('transform', 'translate(' + 100 + ',' + 0 + ')');

    this.yAxisArea = this.svg.append('g')
      .attr('class', 'yAxisArea')
      // .attr('transform', 'translate(' + 100 + ',' + 0 + ')');

    const rightBrushx = this.width + 10;
    this.brushyArea = this.svg.append('g')
      .attr('class', 'brushyarea')
      .attr('transform', 'translate(' + rightBrushx + ',' + 0 + ')');
    // .attr('clip-path', 'url(#clip)')

    this.brushyContext = this.svg.append('g')
      .attr('class', 'brushycontext')
      .attr('transform', 'translate(' + rightBrushx + ',' + 0 + ')');

    const left = this.margin2.left - this.margin.left;
    const top = this.margin2.top - this.margin.top;
    this.brushArea = this.svg.append('g')
      .attr('class', 'brush')
      .attr('transform', 'translate(' + left + ',' + top + ')');

    this.context = this.svg.append('g')
      .attr('class', 'context')
      .attr('transform', 'translate(' + left + ',' + top + ')');

  }

  setDrawDomain(data: any) {
    this.colors.domain(data.map((c) => c.id));
    this.x2.domain(this.x.domain());
    this.y2.domain(this.y.domain());
  }

  drawChart(data: any) {

  }

  drawAxis() {
    this.xAxisArea.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      // .attr('clip-path', 'url(#clip)')
      .call(this.xAxis);
    // .call(this.xAxis.tickSize(-this.height));

    this.yAxisArea.append('g')
      .attr('class', 'axis axis--y')
      .call(this.yAxis);
    // .call(this.yAxis.tickSize(-this.width));
  }

  drawBrush() {
    this.brush = d3Brush.brushX()
      .extent([[0, 0], [this.width, this.height2]])
      .on('brush end', this.brushed.bind(this));


    /*
          var brushy = d3.svg.brush() leftpanelwidth
        .y(leftpanely)
        .on("brush", brushedy); */

    this.context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height2 + ')')
      .call(this.xAxis2);

    this.context.append('g')
      .attr('class', 'brush')
      .call(this.brush)
      .call(this.brush.move, this.x.range());

    this.brushy = d3Brush.brushY()
      .extent([[0, 0], [this.leftpanelwidth, this.height]])
      .on('brush end', this.brushedy.bind(this));

    this.brushyContext.append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', 'translate(50,0)')
      .call(this.leftpanelyAxis);

    this.brushyContext.append('g')
      .attr('class', 'y brush')
      .call(this.brushy)
      .call(this.brushy.move, this.leftpanely.range());

  }

  drawFocus() {
    this.zoom = d3Zoom.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [this.width, this.height]])
      .extent([[0, 0], [this.width, this.height]])
      .on('zoom', this.zoomed.bind(this));

    this.svg.append('rect')
      // .attr('transform', 'translate(' + 120 + ',' + 0 + ')')
      .attr('class', 'zoom')
      .attr('width', this.width)
      .attr('height', this.height)
      .call(this.zoom);
  }

  brushed(event) {
    if (event.sourceEvent) {
      const s = event.selection || this.x2.range();
      this.x.domain(s.map(this.x2.invert, this.x2));
      this.drawContentsZoomed();
      this.svg.select('.axis--x').call(this.xAxis);
      this.svg.select('.axis--y').call(this.yAxis);
      this.svg.select('.zoom').call(this.zoom.transform, d3Zoom.zoomIdentity
        .scale(this.width / (s[1] - s[0]))
        .translate(-s[0], 0));
    }
  }

  brushedy(event) {
    if (event.sourceEvent) {
      const s = event.selection || this.leftpanely.range();

      console.log(' leftpanely.domain()=', this.leftpanely.domain(), ' this.y.domain=', this.y.domain())
      const smap = s.map(this.leftpanely.invert, this.leftpanely);
      console.log( ' s =', s, ' smap =', smap)
      // this.y.domain(this.leftpanely.domain());
      // this.y.domain(s.map(this.leftpanely.invert, this.leftpanely));
      const ydoman = [smap[1], smap[0]];
      this.y.domain(ydoman);
      this.drawContentsZoomed();
      this.svg.select('.axis--x').call(this.xAxis);
      this.svg.select('.axis--y').call(this.yAxis);

      /*
        y.domain(brushy.empty() ? leftpanely.domain() : brushy.extent());
  focus.select("path").attr("d", area);
  focus.select(".y.axis").call(yAxis);
  */
      /*
      this.svg.select('.zoom').call(this.zoom.transform, d3Zoom.zoomIdentity
        .scale(this.width / (s[1] - s[0]))
        .translate(-s[0], 0)); */
    }
  }

  zoomed(event) {
    if (event.sourceEvent) {
      const t = event.transform;
      this.x.domain(t.rescaleX(this.x2).domain());
      console.log( ' this.x.domain =', this.x.domain())
      this.drawContentsZoomed();
      this.svg.select('.axis--x').call(this.xAxis);
      this.svg.select('.context').select('.brush').call(this.brush.move, this.x.range().map(t.invertX, t));
    }
  }

  drawContentsZoomed() {
    this.svg.select('.drawarea').selectAll('g').select('.draw').attr('d', this.draw);
  }
}

