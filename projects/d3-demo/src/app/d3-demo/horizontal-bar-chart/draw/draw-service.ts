import { Injectable } from '@angular/core';
import { IccDrawServie } from 'icc';
import { AppHorizontalBarChart } from './horizontal-bar-chart';

@Injectable()
export class AppDrawServie extends IccDrawServie {
  constructor() {
    super();
    this.componentMapper['horizontalBarChart'] = AppHorizontalBarChart;
  }
}

