import { Component, OnInit } from '@angular/core';
import { IccOverlayComponentRef } from '../../tooltip/services/overlay/overlay-component-ref';

@Component({
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class IccD3PopoverComponent implements OnInit {
  skills = [];
  constructor(
    private overlayComponentRef: IccOverlayComponentRef<any>
  ) { }

  ngOnInit() { }

  close() {
    this.overlayComponentRef.close({ id: 1 });
      // TODO this may not be enough to close tooltip need add close events subject to popover directive
  }
}
