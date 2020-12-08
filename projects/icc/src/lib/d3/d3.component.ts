import {
  AfterViewInit, Component, ViewChild, ElementRef, HostBinding, HostListener, Input, OnChanges,
  OnDestroy, OnInit, SimpleChanges, ViewEncapsulation
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, share, startWith, delay, switchMap, takeWhile } from 'rxjs/operators';
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
  scaleChange$ = new Subject<IccScaleDraw<T>>();
  scale$ = new Subject<IccScaleDraw<T>>();
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

  @HostBinding('style.flex-direction') get flexDirection(): string {
    switch (this.options.legend.position) {
      case 'top': return 'column-reverse';
      case 'bottom': return 'column';
      case 'right':
      case 'default': return '';
    }
  }

  constructor(
    protected elementRef: ElementRef,
    private drawServie: IccDrawServie<T>,
  ) {
    this.setDispatch();
  }

  ngOnInit(): void {
    this.isWindowReszie$.pipe(takeWhile(() => this.alive), debounceTime(100))
      .subscribe(() => this.resizeChart(this.data));
    this.scaleChange$.pipe(delay(0)).subscribe((scale: any) => this.scale$.next(scale));
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
    this.initOptions();
    this.data = this.checkData(data);
    this.chartTypes = this.getChartTypes(data);
    if (this.isViewReady && data) {
      if (!this.svg) {
        this.createChart(data);
      } else {
        this.setDrawDomain(data);
        this.drawChart(data);
        if (this.options.zoom.enabled) {
          this.zoom.setZoomRange();
        }
        this.interactive.updateOptions(this.options);
      }
    }
  }

  public resizeChart(data: T[]): void {
    this.setViewDimension();
    this.view.update(this.options);
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
    this.scale = new IccScaleDraw();
    this.scale.initColor(data, this.options);
    this.setViewDimension();
    this.view = new IccView(this.elementRef, this.chartTypes);
    this.view.update(this.options);
    this.svg = this.view.svg;
    this.scale.buildScales(this.options);
    this.drawAxis = new IccAxisDraw(this.svg, this.scale, this.options);
    this.scaleChange$.next(this.scale);
    this.chartTypes.forEach((type) => {
      const draw = this.drawServie.getDraw(this.svg, this.scale, this.dispatch, type);
      this.draws.push(draw);
    });
    this.setDrawDomain(data);
    this.drawChart(data);
    if (this.options.zoom.enabled) {
      this.zoom = new IccZoomDraw(this.svg, this.scale, this, this.options);
    }
    this.interactive = new IccInteractiveDraw(this.svg, this.scale, this.options, this);
  }

  drawChart(data: T[]): void {
    this.draws.forEach((draw: IccAbstractDraw<T>) => {
      const drawData = data.filter((d: any) => !d.disabled &&
        (d.chartType === draw.chartType || (this.options.chartType === draw.chartType && !d.chartType)));
      draw.updateOptions(this.options);
      draw.drawChart(drawData);
    });
  }

  stateChangeDraw(): void {
    this.setDrawDomain(this.data); // TODO option to turn on/off set dromain
    if (this.options.zoom.enabled) {
      this.zoom.setZoomRange();
    }
    this.drawChart(this.data);
    this.interactive.updateOptions(this.options);
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
      'legendClick', 'legendResize', 'legendMouseover', 'legendMouseout', 'stateChange');
    this.dispatch.on('legendClick', (d) => {
      this.legendMouseover(d, !d.disabled);
      this.stateChangeDraw();
      this.legendMouseover(d, !d.disabled);
    });
    this.dispatch.on('legendResize', (d) => this.resizeChart(this.data));
    this.dispatch.on('legendMouseover', (d) => this.legendMouseover(d, true));
    this.dispatch.on('legendMouseout', (d) => this.legendMouseover(d, false));
    this.dispatch.on('drawMouseover', (p) => {
      this.popover.closePopover();
      if (p.data && p.data.series.length > 0) {
        this.popover.context = { data: p.data };
        this.popover.openPopover(p.event);
      }
    });
    this.dispatch.on('drawMouseout', (p) => this.popover.closePopover());
  }

  legendMouseover(data: T[], mouseover: boolean): void {
    this.draws.forEach((draw: IccAbstractDraw<T>) => draw.legendMouseover(null, data, mouseover));
  }

  redraw(): void {
    this.draws.forEach((draw: IccAbstractDraw<T>) => draw.redraw());
  }

  private initOptions(): void {
    for (const [key, value] of Object.entries(this.options)) {
      if (key === 'zoom') {
        this.options.zoom = { ...DEFAULT_CHART_OPTIONS.zoom, ...this.options.zoom };
      } else if (key === 'pie') {
        this.options.pie = { ...DEFAULT_CHART_OPTIONS.pie, ...this.options.pie };
      } else if (key === 'legend') {
        this.options.legend = { ...DEFAULT_CHART_OPTIONS.legend, ...this.options.legend };
      } else if (key === 'popover') {
        this.options.popover = { ...DEFAULT_CHART_OPTIONS.popover, ...this.options.popover };
      }
    }
    this.options = { ...DEFAULT_CHART_OPTIONS, ...this.options };
  }

  private setViewDimension(): void {
    this.setZoomOptions();
    const margin = this.options.margin;
    // this.width = this.elementRef.nativeElement.clientWidth;
    // this.height = this.elementRef.nativeElement.clientHeight;
    const elementRef = this.elementRef.nativeElement.firstChild;
    const width = elementRef.clientWidth || 300;
    const height = elementRef.clientHeight || 300;

    const zoom = this.options.zoom;
    const drawDimension = {
      drawWidth: width - margin.left - margin.right
        - (zoom.verticalBrushShow ? this.options.brushYWidth + 30 : 0),
      drawHeight: height - margin.top - margin.bottom
        - (zoom.horizontalBrushShow ? this.options.drawHeight2 + 30 : 0)
    };
    this.options = { ...this.options, ...drawDimension };
  }

  private setZoomOptions(): void {
    const zoom = this.options.zoom;
    zoom.horizontalOff = !zoom.enabled ? true : zoom.horizontalOff;
    zoom.horizontalBrushShow = !zoom.enabled || zoom.horizontalOff ? false : zoom.horizontalBrushShow;
    zoom.verticalOff = !zoom.enabled ? true : zoom.verticalOff;
    zoom.verticalBrushShow = !zoom.enabled || zoom.verticalOff ? false : zoom.verticalBrushShow;
  }

  private getChartTypes(data: T[]): string[] {
    const chartTypes = [this.options.chartType];
    if (data) {
      data.forEach((d: any) => {
        if (d.chartType && chartTypes.filter((type) => type === d.chartType).length === 0) {
          chartTypes.push(d.chartType);
        }
      });
    }
    return chartTypes;
  }

  private checkData(data: T[]): any[] {
    return data && this.options.chartType === 'pieChart' && !this.options.y0(data[0]) ?
      [{
        key: 'Pie Chart',
        values: data,
      }]
      : data;
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

