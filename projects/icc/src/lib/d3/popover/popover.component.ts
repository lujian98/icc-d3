import { Component, OnInit } from '@angular/core';
import { IccOverlayComponentRef } from '../../tooltip/services/overlay/overlay-component-ref';
import { IccD3Popover } from '../model';

@Component({
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class IccD3PopoverComponent implements OnInit {
  data: IccD3Popover;

  constructor(
    private overlayComponentRef: IccOverlayComponentRef<any>
  ) { }

  ngOnInit(): void { }

  close(): void {
    this.overlayComponentRef.close({ id: 1 });
    // TODO this may not be enough to close tooltip need add close events subject to popover directive
  }
}
