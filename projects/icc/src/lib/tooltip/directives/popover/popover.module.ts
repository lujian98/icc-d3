import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { IccPopoverDirective } from './popover.directive';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule
  ],
  declarations: [
    IccPopoverDirective,
  ],
  entryComponents: [],
  exports: [
    IccPopoverDirective,
  ],
  providers: [],
})
export class IccPopoverModule { }
