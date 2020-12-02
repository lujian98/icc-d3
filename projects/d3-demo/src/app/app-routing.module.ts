import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'line-chart', loadChildren: './d3-demo/d3-demos.module#AppD3DemosModule' },
  { path: '', redirectTo: 'line-chart', pathMatch: 'full' },
  { path: '**', redirectTo: 'line-chart', }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
