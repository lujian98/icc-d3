import {
  AfterViewInit, Component, ViewChild, ElementRef, HostListener, Input, OnChanges,
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
import { IccView } from './draw/view';
import { IccInteractiveDraw } from './draw/interactive-draw';
import { DEFAULT_CHART_OPTIONS, IccD3Options } from './model';

import { IccPopoverDirective } from '../tooltip/directives/popover/popover.directive';
import { IccD3PopoverComponent } from './popover/popover.component';

@Component({
  selector: 'icc-d3',
  templateUrl: './d3.component.html',
  styleUrls: ['./d3.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IccD3Component<T> implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  @Input() options: IccD3Options;
  @Input() data: T[];

  protected svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
  dispatch: d3Dispatch.Dispatch<{}>;
  chartTypes: string[] = [];
  scale: IccScaleDraw<T>;
  view: IccView;
  draws: IccAbstractDraw<T>[] = [];
  zoom: IccZoomDraw<T>;
  interactive: IccInteractiveDraw<T>;
  drawAxis: IccAxisDraw<T>;
  private alive = true;
  private isViewReady = false;
  isWindowReszie$: Subject<{}> = new Subject();
  @ViewChild(IccPopoverDirective) popover: IccPopoverDirective<T>;
  d3Popover = IccD3PopoverComponent;

  constructor(
    protected elementRef: ElementRef,
    private drawServie: IccDrawServie<T>,
  ) {
    this.setDispatch();
  }

  ngOnInit(): void {
    this.isWindowReszie$.pipe(takeWhile(() => this.alive), debounceTime(100))
      .subscribe(() => this.resizeChart(this.data));
  }

  ngAfterViewInit(): void {
    this.isViewReady = true;
    this.updateChart(this.data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.data = this.cloneData(this.data);
      this.updateChart(this.data);
    }
  }

  cloneData = (data: T[]) => data && data.map((d) => Object.assign({}, d));

  public updateChart(data: T[]): void {
    if (this.isViewReady && data) {
      if (!this.svg) {
        this.createChart(data);
      } else {
        this.view.drawLegend(this.scale, data, this.dispatch);
        this.setDrawDomain(data);
        this.drawChart(data);
        if (this.options.zoom.enabled) {
          this.zoom.setZoomRange();
        }
      }
    }
  }

  public resizeChart(data: T[]): void {
    this.view.update();
    this.view.drawLegend(this.scale, data, this.dispatch);
    this.options = this.view.getOptions();
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

  public createChart(data: T[]): void {
    this.chartTypes = this.getChartTypes(data);
    this.scale = new IccScaleDraw();
    this.scale.initColor(data, this.options);
    this.view = new IccView(this.elementRef, this.options, this.chartTypes);
    this.view.drawLegend(this.scale, data, this.dispatch);
    this.svg = this.view.svg;
    this.options = this.view.getOptions();
    this.scale.buildScales(this.options);
    this.drawAxis = new IccAxisDraw(this.svg, this.scale, this.options);

    this.chartTypes.forEach((type) => {
      const draw = this.drawServie.getDraw(this.svg, this.scale, this.options, this.dispatch, type);
      this.draws.push(draw);
    });
    this.setDrawDomain(data);
    this.drawChart(data);
    if (this.options.zoom.enabled) {
      this.zoom = new IccZoomDraw(this.svg, this.scale, this, this.options);
    }
    this.interactive = new IccInteractiveDraw(this.svg, this.scale, data, this.options, this);
  }

  drawChart(data: T[]): void {
    this.draws.forEach((draw: IccAbstractDraw<T>) => {
      const drawData = data.filter((d: any) => !d.disabled &&
        (d.chartType === draw.chartType || (this.options.chartType === draw.chartType && !d.chartType)));
      draw.drawChart(drawData);
    });
  }

  stateChangeDraw(): void {
    this.setDrawDomain(this.data); // TODO option to turn on/off set dromain
    if (this.options.zoom.enabled) {
      this.zoom.setZoomRange();
    }
    this.drawChart(this.data);
    if (!this.options.useInteractiveGuideline) {
      this.interactive.drawAllCircles();
    }
  }

  setDrawDomain(data: T[]): void {
    this.scale.setDrawDomain(data);
    this.svg.select('.axis--x').call(this.scale.xAxis);
    this.svg.select('.context').select('.axis--x').call(this.scale.x2Axis);
    this.svg.select('.axis--y').call(this.scale.yAxis);
    this.svg.select('.contextBrushY').select('.axis--y').call(this.scale.y3Axis);
  }

  setDispatch(): void {
    this.dispatch = d3Dispatch.dispatch('drawMouseover', 'drawMouseout', 'drawZoom',
      'legendClick', 'legendDblclick', 'legendMouseover', 'legendMouseout', 'stateChange');
    this.dispatch.on('legendClick', (d) => {
      this.legendMouseover(d, !d.disabled);
      this.stateChangeDraw();
      this.legendMouseover(d, !d.disabled);
    });
    this.dispatch.on('legendMouseover', (d) => {
      this.legendMouseover(d, true);
    });
    this.dispatch.on('legendMouseout', (d) => {
      this.legendMouseover(d, false);
    });
    this.dispatch.on('drawMouseover', (p) => {
      this.popover.context = { data: p.data };
      this.popover.closePopover();
      this.popover.openPopover(p.event);
    });
    this.dispatch.on('drawMouseout', (p) => { });
  }

  legendMouseover(data: T[], mouseover: boolean): void {
    this.draws.forEach((draw: IccAbstractDraw<T>) => draw.legendMouseover(data, mouseover));
  }

  redraw(): void {
    this.draws.forEach((draw: IccAbstractDraw<T>) => draw.redraw());
  }

  private getChartTypes(data: T[]): string[] {
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

  ngOnDestroy(): void {
    this.alive = false;
    this.isWindowReszie$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: MouseEvent): void {
    this.isWindowReszie$.next(true);
  }
}

