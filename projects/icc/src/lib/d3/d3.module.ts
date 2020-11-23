import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IccPopoverModule } from '../tooltip/directives/popover';
import { IccPortalModule } from '../tooltip/components/portal/portal.module';

import { IccDrawServie } from './draw-service';
import { IccD3Component } from './d3.component';
import { TooltipDemoComponent } from './popover/tooltip-demo.component';

@NgModule({
  imports: [
    CommonModule,
    IccPopoverModule,
    IccPortalModule
  ],
  declarations: [
    IccD3Component,
    TooltipDemoComponent,
  ],
  exports: [
    IccD3Component,
    TooltipDemoComponent
  ],
  entryComponents: [
    TooltipDemoComponent
  ],
  providers: [
    IccDrawServie,
  ]
})
export class IccD3Module { }

