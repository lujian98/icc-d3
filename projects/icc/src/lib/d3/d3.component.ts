import {
  AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges,
  OnDestroy, OnInit, SimpleChanges, ViewEncapsulation
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, share, switchMap, takeWhile } from 'rxjs/operators';
import * as d3 from 'd3-selection';
import * as d3Dispatch from 'd3-dispatch';
import * as d3Transition from 'd3-transition';
import { IccDrawServie } from './draw-service';
import { IccAbstractDraw } from './draw/abstract-draw';
import { IccScaleDraw } from './draw/scale-draw';
import { IccAxisDraw } from './draw/axis-draw';
import { IccZoomDraw } from './draw/zoom-draw';
import { IccDraw } from './draw/draw';
import { IccColorDraw } from './draw/color-draw';
import { IccInteractiveDraw } from './draw/interactive-draw';

import { DEFAULT_CHART_OPTIONS } from './model/model';

import { IccPopoverService } from '../tooltip/directives/popover/popover.service';
import { TooltipDemoComponent } from './popover/tooltip-demo.component';

@Component({
  selector: 'icc-d3',
  template: `<svg width="100%"></svg>`,
  styleUrls: ['./d3.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SunD3Component<T> implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  @Input() options: any;
  @Input() data: T[];

  chartTypes = [];
  scale: IccScaleDraw;
  draw: IccDraw;
  draws: IccAbstractDraw<T>[] = [];
  zoom: IccZoomDraw;
  interactive: IccInteractiveDraw<T>;
  drawAxis: IccAxisDraw;
  drawColor: IccColorDraw;

  private alive = true;
  private isViewReady = false;
  isWindowReszie$: Subject<{}> = new Subject();

  protected svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>;

  constructor(
    protected elementRef: ElementRef,
    private drawServie: IccDrawServie,
    private popoverService: IccPopoverService
  ) {
    // this.popoverService.content = TooltipDemoComponent;
    // this.popoverService.context = {
    //  skills: [1, 2, 3, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    // };
  }

  ngOnInit() {
    this.isWindowReszie$.pipe(takeWhile(() => this.alive), debounceTime(100))
      .subscribe(() => this.resizeChart(this.data));
  }

  ngAfterViewInit() {
    this.isViewReady = true;
    this.updateChart(this.data);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.data = this.cloneData(this.data);
      this.updateChart(this.data);
    }
  }

  cloneData = (data: any[]) => data && data.map((d) => Object.assign({}, d));

  public updateChart(data) {
    if (this.isViewReady && this.data) {
      if (!this.svg) {
        this.createChart(data);
      } else {
        this.draw.drawLegend(this.scale, data);
        // this.drawColor.setDomain(data); // UPDATE color domain shall not change
        this.setDispatch(data);
        this.setDrawDomain(data);
        this.drawChart(data);
        if (this.options.zoom.enabled) {
          this.zoom.setZoomRange();
        }
      }
    }
  }

  public resizeChart(data: any[]) {
    this.draw.update();
    this.draw.drawLegend(this.scale, data);
    this.options = this.draw.getOptions();
    this.scale.update(this.options);
    this.drawAxis.updateOptions(this.options);
    this.setDrawDomain(data);
    if (this.options.zoom.enabled) {
      this.zoom.updateOptions(this.options);
      this.zoom.setZoomRange();
    }
    this.drawChart(data);
    this.interactive.updateOptions(this.options);
  }

  public createChart(data: any[]) {
    // console.log(' input data =', data)
    this.chartTypes = this.getChartTypes(this.data);
    this.scale = new IccScaleDraw();
    this.drawColor = new IccColorDraw(this.scale, data, this.options);
    this.setDispatch(data);
    this.draw = new IccDraw(this.elementRef, this.options, this.chartTypes);
    this.draw.drawLegend(this.scale, data);
    this.svg = this.draw.svg;
    this.options = this.draw.getOptions();
    this.scale.buildScales(this.options);
    this.drawAxis = new IccAxisDraw(this.svg, this.scale, this.options);

    this.chartTypes.forEach((type) => {
      const draw = this.drawServie.getDraw(this.svg, this.scale, this.options, type);
      this.draws.push(draw);
    });
    this.setDrawDomain(data);
    this.drawChart(data);
    if (this.options.zoom.enabled) {
      this.zoom = new IccZoomDraw(this.svg, this.scale, this, this.options);
    }
    this.interactive = new IccInteractiveDraw(this.svg, this.scale, data, this.options, this.draws);
  }

  drawChart(data: T[]) {
    this.draws.forEach((draw: IccAbstractDraw<T>) => {
      const drawData = data.filter((d: any) => !d.disabled &&
        (d.chartType === draw.chartType || (this.options.chartType === draw.chartType && !d.chartType)));
      draw.drawChart(drawData);
    });
  }

  setDrawDomain(data: T[]) {
    this.scale.setDrawDomain(data);
    this.svg.select('.axis--x').call(this.scale.xAxis);
    this.svg.select('.context').select('.axis--x').call(this.scale.x2Axis);

    this.svg.select('.axis--y').call(this.scale.yAxis);
    this.svg.select('.contextBrushY').select('.axis--y').call(this.scale.y3Axis);
  }

  setDispatch(data: T[]) {
    this.scale.dispatch = d3Dispatch.dispatch(
      'drawMouseover', 'drawMouseout', 'drawZoom',
      'legendClick', 'legendDblclick', 'legendMouseover', 'legendMouseout', 'stateChange');
    this.scale.dispatch.on('legendClick', (d) => {
      this.setDrawDomain(data); // TODO option to turn on/off set dromain
      if (this.options.zoom.enabled) {
        this.zoom.setZoomRange();
      }
      this.drawChart(data);
      if (!this.options.useInteractiveGuideline) {
        this.interactive.drawAllCircles();
      }
    });
    this.scale.dispatch.on('legendMouseover', (d) => {
      this.legendMouseover(d, true);
      // this.popoverService.openPopover(e);
    });
    this.scale.dispatch.on('legendMouseout', (d) => {
      this.legendMouseover(d, false);
    });
    this.scale.dispatch.on('drawMouseover', (p) => {
      // this.legendMouseover(d, true);
      // this.popoverService.openPopover(p.event);
      console.log('over e =', p)
    });

    this.scale.dispatch.on('drawMouseout', (p) => {
      // this.legendMouseover(d, true);
      // this.popoverService.closePopover();
      console.log('out e =', p)
    });

  }

  legendMouseover(data: T[], mouseover: boolean) {
    this.draws.forEach((draw: IccAbstractDraw<T>) => draw.legendMouseover(data, mouseover));
  }

  redraw() {
    this.draws.forEach((draw: IccAbstractDraw<T>) => draw.redraw());
  }

  private getChartTypes(data: T[]) {
    for (const [key, value] of Object.entries(this.options)) {
      if (key === 'zoom') {
        this.options.zoom = { ...DEFAULT_CHART_OPTIONS.zoom, ...this.options.zoom };
      }
    }
    this.options = { ...DEFAULT_CHART_OPTIONS, ...this.options };
    const chartTypes = [this.options.chartType];
    data.forEach((d: any) => {
      if (d.chartType && chartTypes.filter((type) => type === d.chartType).length === 0) {
        chartTypes.push(d.chartType);
      }
    });
    return chartTypes;
  }

  ngOnDestroy() {
    this.alive = false;
    this.isWindowReszie$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: MouseEvent) {
    this.isWindowReszie$.next(true);
  }
}

