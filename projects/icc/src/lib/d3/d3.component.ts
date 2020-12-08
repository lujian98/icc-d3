import {
  AfterViewInit, Component, ViewChild, ElementRef, HostBinding, HostListener, Input, OnChanges,
  OnDestroy, OnInit, SimpleChanges, ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, delay, takeWhile } from 'rxjs/operators';
import * as d3 from 'd3-selection';
import * as d3Dispatch from 'd3-dispatch';
import * as d3Transition from 'd3-transition';
import { IccDrawServie } from './service';
import { IccAbstractDraw, IccScaleDraw, IccAxisDraw, IccZoomDraw, IccView, IccInteractiveDraw } from './draw';
import { IccD3Options } from './model';
import { IccD3Config } from './config';
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

  config = new IccD3Config(this.elementRef);
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
    return this.config.flexDirection();
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
    this.config.initOptions(this.options);
    this.data = this.config.checkData(data);
    this.chartTypes = this.config.getChartTypes(data);
    if (this.isViewReady && data) {
      if (!this.svg) {
        this.createChart(data);
      } else {
        this.setDrawDomain(data);
        this.drawChart(data);
        if (this.config.options.zoom.enabled) {
          this.zoom.setZoomRange();
        }
        this.interactive.updateOptions(this.config.options);
      }
    }
  }

  public resizeChart(data: T[]): void {
    this.config.setViewDimension();
    this.view.update(this.config.options);
    this.scale.update(this.config.options);
    this.drawAxis.updateOptions(this.config.options);
    this.setDrawDomain(data);
    if (this.config.options.zoom.enabled) {
      this.zoom.updateOptions(this.config.options);
      this.zoom.setZoomRange();
    }
    this.drawChart(data);
    this.interactive.updateOptions(this.config.options);
  }

  public createChart(data: T[]): void {
    this.config.setViewDimension();
    this.scale = new IccScaleDraw();
    this.scale.initColor(data, this.config.options);
    this.view = new IccView(this.elementRef, this.chartTypes);
    this.view.update(this.config.options);
    this.svg = this.view.svg;
    this.scale.buildScales(this.config.options);
    this.drawAxis = new IccAxisDraw(this.svg, this.scale, this.config.options);
    this.scaleChange$.next(this.scale);
    this.chartTypes.forEach((type) => {
      const draw = this.drawServie.getDraw(this.svg, this.scale, this.dispatch, type);
      this.draws.push(draw);
    });
    this.setDrawDomain(data);
    this.drawChart(data);
    if (this.config.options.zoom.enabled) {
      this.zoom = new IccZoomDraw(this.svg, this.scale, this, this.config.options);
    }
    this.interactive = new IccInteractiveDraw(this.svg, this.scale, this.config.options, this);
  }

  drawChart(data: T[]): void {
    this.draws.forEach((draw: IccAbstractDraw<T>) => {
      const drawData = data.filter((d: any) => !d.disabled &&
        (d.chartType === draw.chartType || (this.config.options.chartType === draw.chartType && !d.chartType)));
      draw.updateOptions(this.config.options);
      draw.drawChart(drawData);
    });
  }

  stateChangeDraw(): void {
    this.setDrawDomain(this.data); // TODO option to turn on/off set dromain
    if (this.config.options.zoom.enabled) {
      this.zoom.setZoomRange();
    }
    this.drawChart(this.data);
    this.interactive.updateOptions(this.config.options);
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

  redraw = () => this.draws.forEach((draw: IccAbstractDraw<T>) => draw.redraw());

  ngOnDestroy(): void {
    this.alive = false;
    this.isWindowReszie$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: MouseEvent): void {
    this.isWindowReszie$.next(true);
  }
}

