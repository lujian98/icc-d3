import { Injectable } from '@angular/core';
import { IccDrawServie } from 'icc';
import { AppHorizontalBarChart } from './horizontal-bar-chart';

@Injectable()
export class AppDrawServie<T> extends IccDrawServie<T> {
  constructor() {
    super();
    Object.assign(this.componentMapper, {
      horizontalBarChart: AppHorizontalBarChart
    });
  }
}

