import { OverlayRef } from '@angular/cdk/overlay';
import { Directive, EventEmitter, ElementRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { IccPortalContent } from '../../components/portal/model';
import { IccPortalComponent } from '../../components/portal/portal.component';
import { IccOverlayConfig } from '../../services/overlay/overlay.model';
import { IccOverlayService } from '../../services/overlay/overlay.service';
import {
  IccBasePopoverStrategy, IccPopoverClickStrategy, IccPopoverHoverStrategy,
  IccPopoverContextmenuStrategy
} from './popover.strategy';


@Directive({
  selector: '[iccPopover]'
})
export class IccPopoverDirective<T> implements OnInit, OnDestroy {
  @Input('iccPopover') content: IccPortalContent<T>;
  @Input('iccPopoverContext') context = {};
  @Input() popoverPosition: string;
  @Input() width: string | number;
  @Input() height: string | number;
  @Input() popoverType: 'hover' | 'click' | 'contextmenu' | 'disabled' = 'hover';
  @Input() popoverLevel = 0;

  private popoverStrategy: IccBasePopoverStrategy;
  private overlayRef: OverlayRef;
  private isOpened = false;

  @Output() iccItemChangedEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private overlayService: IccOverlayService<T>,
    private elementRef: ElementRef,
  ) { }

  ngOnInit() {
    if (this.popoverType !== 'disabled') { // afterClosed$
      if (this.popoverType === 'click') {
        this.popoverStrategy = new IccPopoverClickStrategy(document, this.elementRef.nativeElement);
      } else if (this.popoverType === 'contextmenu') {
        this.popoverStrategy = new IccPopoverContextmenuStrategy(document, this.elementRef.nativeElement);
        this.popoverStrategy.change$.subscribe((event: MouseEvent) => this.closePopover());
      } else {
        this.popoverStrategy = new IccPopoverHoverStrategy(document, this.elementRef.nativeElement);
      }
      this.popoverStrategy.show$.subscribe((event: MouseEvent) => this.openPopover(event));
      this.popoverStrategy.hide$.subscribe(() => this.closePopover());
    }
  }

  private openPopover(mouseEvent: MouseEvent) {
    if (!this.isOpened) {
      let origin = this.elementRef.nativeElement;
      if (this.popoverType === 'contextmenu') {
        const fakeElement = {
          getBoundingClientRect: (): ClientRect => ({
            bottom: mouseEvent.clientY,
            height: 0,
            left: mouseEvent.clientX,
            right: mouseEvent.clientX,
            top: mouseEvent.clientY,
            width: 0,
          })
        };
        origin = new ElementRef(fakeElement);
      }

      this.isOpened = true;
      const overlayConfig: IccOverlayConfig = {
        position: this.popoverPosition,
        width: this.width,
        height: this.height,
        popoverType: this.popoverType,
        popoverLevel: this.popoverLevel,
      };
      this.overlayRef = this.overlayService.open(
        origin,
        IccPortalComponent,
        overlayConfig,
        this.content,
        this.context
      );
      this.popoverStrategy.isOpened = this.isOpened;
      this.popoverStrategy.overlayRef = this.overlayRef;
      this.popoverStrategy.containerRef = this.overlayService.containerRef;

      this.overlayService.overlayComponentRef.afterClosed$
        .pipe(takeWhile(() => this.isOpened))
        .subscribe(() => {
          this.closePopover();
        });

      this.overlayService.overlayComponentRef.isComponentAttached$
        .pipe(takeWhile(() => this.isOpened))
        .subscribe(() => {
          this.setPortalComponentEvent();
        });
    }
  }

  private closePopover() { // TODO check overlay closeable
    if (this.overlayService.isOverlayClosed(this.overlayRef, this.popoverType, this.popoverLevel)) {
      this.isOpened = false;
      this.popoverStrategy.isOpened = this.isOpened;
      this.popoverStrategy.overlayRef = null;
      this.popoverStrategy.containerRef = null;
    }
  }

  private setPortalComponentEvent() {
    if (this.overlayService.overlayComponentRef.componentRef) {
      const portalComponent = this.overlayService.overlayComponentRef.componentRef;
      if (portalComponent.iccItemChangedEvent) {
        portalComponent.iccItemChangedEvent
          .subscribe((changes: any) => {
            this.iccItemChangedEvent.emit(changes);
          });
      }
    }
  }

  ngOnDestroy() {
    this.overlayService.destroy();
  }
}

