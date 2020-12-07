import { Component, Input, OnInit } from '@angular/core';
import { IccD3Options } from '../model';

@Component({
  selector: 'icc-d3-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class IccD3LegendComponent<T> implements OnInit {
  @Input() options: IccD3Options;
  @Input() data: T[];

  legendData: any[][];

  constructor(
  ) {
    this.legendData = [
      ['Test A', 'Test B', 'Test C'],
      ['Test D', 'Test E', '']
    ];
    console.log(this.legendData);
  }

  ngOnInit(): void {
    // console.log(' options = ', this.options);
  }

  itemClick(event, item): void {
    console.log(' click item=', item);
  }

  itemMouseOver(event, item): void {
    console.log(' Over item=', item);
  }

  itemMouseOut(event, item): void {
    console.log(' out item=', item);
  }
}

