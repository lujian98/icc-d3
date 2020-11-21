import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentRef } from '@angular/core';
import { combineLatest, forkJoin, fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, filter, map, share, startWith, switchMap, takeWhile } from 'rxjs/operators';

export interface IccPopoverStrategy {
  show$: Observable<never | Event>;
  hide$: Observable<never | Event>;
  isOpened: boolean;
  overlayRef: OverlayRef;
  containerRef: ComponentRef<any>;
  destroy();
}

export abstract class IccBasePopoverStrategy implements IccPopoverStrategy {
  protected alive = true;
  isOpened: boolean;
  overlayRef: OverlayRef;
  containerRef: ComponentRef<any>;
  abstract show$: Observable<Event>;
  abstract hide$: Observable<Event>;
  change$: Observable<any>;
  constructor(
    protected document: Document,
    protected host: HTMLElement,
  ) { }

  destroy() {
    this.alive = false;
  }
}

export class IccPopoverHoverStrategy extends IccBasePopoverStrategy {
  show$ = fromEvent(this.host, 'mouseenter')
    .pipe(
      filter(() => !this.isOpened),
      switchMap(enterEvent =>
        fromEvent(document, 'mousemove')
          .pipe(
            startWith(enterEvent),
            debounceTime(100),
            filter(event => this.host.contains(event.target as Node))
          )
      ),
      takeWhile(() => this.alive)
    );
  hide$ = fromEvent(document, 'mousemove')
    .pipe(
      debounceTime(100),
      filter(() => this.isOpened),
      filter(event => this.isMovedOutside(event)),
      takeWhile(() => this.alive)
    );

  private isMovedOutside(event): boolean {
    return !(this.host.contains(event.target as Node) ||
      (this.overlayRef && this.overlayRef.overlayElement && this.overlayRef.overlayElement.contains(event.target as Node)));
  }
}

export class IccPopoverClickStrategy extends IccBasePopoverStrategy {
  protected click$: Observable<[boolean, Event]> = fromEvent<Event>(this.document, 'click').pipe(
    map((event: Event) => [!this.containerRef && this.host.contains(event.target as Node), event] as [boolean, Event]),
    share(),
    takeWhile(() => this.alive)
  );

  show$ = this.click$.pipe(
    filter(([shouldShow]) => shouldShow),
    map(([, event]) => event),
    takeWhile(() => this.alive)
  );

  hide$ = this.click$.pipe(
    filter(
      ([shouldShow, event]) =>
        !shouldShow && !(this.containerRef && this.containerRef.location.nativeElement.contains(event.target))
    ),
    map(([, event]) => event),
    takeWhile(() => this.alive)
  );
}

export class IccPopoverContextmenuStrategy extends IccBasePopoverStrategy {
  protected rightClick$: Observable<[boolean, Event]> = fromEvent<Event>(this.document, 'contextmenu').pipe(
    map((event: Event) => {
      return [this.host.contains(event.target as Node), event] as [boolean, Event];
    }),
    share(),
    takeWhile(() => this.alive)
  );

  show$ = this.rightClick$.pipe(
    filter(([shouldShow]) => shouldShow),
    map(([, event]) => {
      event.preventDefault();
      return event;
    }),
    takeWhile(() => this.alive)
  );

  change$ = this.rightClick$.pipe(
    filter(() => this.isOpened),
    map(event => event),
    takeWhile(() => this.alive)
  );

  protected click$: Observable<Event> = fromEvent<Event>(this.document, 'click').pipe(
    map((event: Event) => event),
    takeWhile(() => this.alive)
  );

  hide$ = this.click$.pipe(
    filter(
      (event) =>
       !(this.containerRef && this.containerRef.location.nativeElement.contains(event.target))
    ),
    map((event) => event),
    takeWhile(() => this.alive)
  );
}
