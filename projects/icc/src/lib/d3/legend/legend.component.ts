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

  constructor(
  ) { }

  ngOnInit(): void {
    console.log( ' options = ', this.options);
  }
}
