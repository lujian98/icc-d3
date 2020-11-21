import { OverlayRef } from '@angular/cdk/overlay';
import { Directive, EventEmitter, ElementRef, Injectable, OnDestroy, OnInit, Output } from '@angular/core';
import { takeWhile } from 'rxjs/operators';


import { IccPortalContent } from '../../components/portal/model';
import { IccPortalComponent } from '../../components/portal/portal.component';
import { IccOverlayConfig } from '../../services/overlay/overlay.model';
import { IccOverlayService } from '../../services/overlay/overlay.service';
import {
  IccBasePopoverStrategy, IccPopoverClickStrategy, IccPopoverHoverStrategy,
  IccPopoverContextmenuStrategy
} from './popover.strategy';

@Injectable({
  providedIn: 'root'
})
export class IccPopoverService implements OnDestroy {
  content: IccPortalContent<any>;
  context = {};
  popoverPosition: string;
  width: string | number;
  height: string | number;
  popoverType: 'hover' | 'click' | 'contextmenu' | 'disabled' = 'disabled';
  popoverLevel = 0;

  private popoverStrategy: IccBasePopoverStrategy;
  private overlayRef: OverlayRef;
  private isOpened = false;

  @Output() iccItemChangedEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private overlayService: IccOverlayService<any>,
    // private elementRef: ElementRef,
  ) {
  }

  // WARNING TODO this only support mouse point popover
  public openPopover(mouseEvent: MouseEvent): void {
    if (!this.isOpened) {
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
      const origin: any = new ElementRef(fakeElement);

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
      // this.popoverStrategy.isOpened = this.isOpened;
      // this.popoverStrategy.overlayRef = this.overlayRef;
      // this.popoverStrategy.containerRef = this.overlayService.containerRef;

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

  public closePopover(): void { // TODO check overlay closeable
    if (this.overlayService.isOverlayClosed(this.overlayRef, this.popoverType, this.popoverLevel)) {
      this.isOpened = false;
      // this.popoverStrategy.isOpened = this.isOpened;
      // this.popoverStrategy.overlayRef = null;
      // this.popoverStrategy.containerRef = null;
    }
  }

  private setPortalComponentEvent(): void {
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

  ngOnDestroy(): void {
    this.overlayService.destroy();
  }
}

