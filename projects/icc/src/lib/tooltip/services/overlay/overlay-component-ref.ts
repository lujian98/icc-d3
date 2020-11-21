import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentRef, Injectable, Injector, Type } from '@angular/core';
import { Subject } from 'rxjs';
import { IccOverlayComponentCloseEvent } from './overlay.model';
import { IccPortalContent } from '../../components/portal/model';

export class IccOverlayComponentRef<T> {
  private afterClosed = new Subject<IccOverlayComponentCloseEvent<T>>();
  afterClosed$ = this.afterClosed.asObservable();
  componentRef: any;

  isComponentAttached$: Subject<{}> = new Subject();

  constructor(
    public overlay: OverlayRef,
    public componentContent: IccPortalContent<T>,
    public componentContext: {}
  ) {
    this.overlay.backdropClick().subscribe(() => this._close({ type: 'backdropClick', context: null }));
  }

  close(data?: T) {
    this._close({ type: 'close', context: data });
  }

  private _close(event: IccOverlayComponentCloseEvent) {
    this.componentRef = null;
    this.afterClosed.next(event);
    this.afterClosed.complete();
  }
}

