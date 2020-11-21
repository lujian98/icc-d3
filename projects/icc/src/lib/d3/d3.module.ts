import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IccPopoverModule } from '../tooltip/directives/popover';
import { IccPopoverService } from '../tooltip/directives/popover/popover.service';
import { IccPortalModule } from '../tooltip/components/portal/portal.module';

import { IccDrawServie } from './draw-service';
import { SunD3Component } from './d3.component';
import { TooltipDemoComponent } from './popover/tooltip-demo.component';

@NgModule({
  imports: [
    CommonModule,
    IccPopoverModule,
    IccPortalModule
  ],
  declarations: [
    SunD3Component,
    TooltipDemoComponent,
  ],
  exports: [
    SunD3Component,
    TooltipDemoComponent
  ],
  entryComponents: [
    TooltipDemoComponent
  ],
  providers: [IccDrawServie, IccPopoverService]
})
export class IccD3Module { }

