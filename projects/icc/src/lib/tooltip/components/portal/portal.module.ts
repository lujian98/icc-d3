import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortalModule } from '@angular/cdk/portal';
import { IccPortalComponent } from './portal.component';

@NgModule({
  declarations: [
    IccPortalComponent,
  ],
  imports: [
    CommonModule,
    PortalModule,
  ],
  exports: [
    IccPortalComponent
  ],
  entryComponents: [
  ],
  providers: [],
  bootstrap: []
})
export class IccPortalModule { }
