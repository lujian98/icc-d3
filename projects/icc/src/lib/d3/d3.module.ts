import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IccPopoverModule } from '../tooltip/directives/popover';
import { IccPortalModule } from '../tooltip/components/portal/portal.module';

import { IccDrawServie } from './draw-service';
import { IccD3Component } from './d3.component';
import { IccD3PopoverComponent } from './popover/popover.component';

@NgModule({
  imports: [
    CommonModule,
    IccPopoverModule,
    IccPortalModule
  ],
  declarations: [
    IccD3Component,
    IccD3PopoverComponent,
  ],
  exports: [
    IccD3Component,
    IccD3PopoverComponent
  ],
  entryComponents: [
    IccD3PopoverComponent
  ],
  providers: [
    IccDrawServie,
  ]
})
export class IccD3Module { }

