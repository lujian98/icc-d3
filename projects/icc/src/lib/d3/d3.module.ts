import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IccPopoverModule } from '../tooltip/directives/popover';
import { IccPortalModule } from '../tooltip/components/portal/portal.module';

import { IccDrawServie } from './service';
import { IccD3Component } from './d3.component';
import { IccD3PopoverComponent } from './popover/popover.component';
import { IccD3LegendComponent } from './legend/legend.component';

@NgModule({
  imports: [
    CommonModule,
    IccPopoverModule,
    IccPortalModule
  ],
  declarations: [
    IccD3Component,
    IccD3PopoverComponent,
    IccD3LegendComponent
  ],
  exports: [
    IccD3Component,
    IccD3PopoverComponent,
    IccD3LegendComponent
  ],
  entryComponents: [
    IccD3PopoverComponent,
    IccD3LegendComponent
  ],
  providers: [
    IccDrawServie,
  ]
})
export class IccD3Module { }

