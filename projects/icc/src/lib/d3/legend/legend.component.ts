import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Dispatch from 'd3-dispatch';
import { IccScaleDraw } from '../draw/scale-draw';
import { IccD3Options } from '../model';

@Component({
  selector: 'icc-d3-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class IccD3LegendComponent<T> implements OnInit, OnChanges {
  @Input() options: IccD3Options;
  @Input() data: T[];
  @Input() scale: IccScaleDraw<T>;
  @Input() dispatch: d3Dispatch.Dispatch<{}>;

  availableWidth = 0;
  padding = 32; // define how much space between legend items. - recommend 32 for furious version
  legendData: any[][];

  constructor(
    private elementRef: ElementRef,
  ) {
  }

  ngOnInit(): void {
    this.setLegendData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options && this.availableWidth !== this.options.drawWidth) {
      this.availableWidth = this.options.drawWidth;
      console.log(' sssssssssssssssss this.options =', this.options)
      this.setLegendData();
    }

    //
  }

  setLegendData(): void { // TODO resize events
    const availableWidth = this.options.drawWidth; // - this.margin.left - this.margin.right;
    const data = this.options.chartType === 'pieChart' ? this.options.y0(this.data[0]) : this.data;

    const legendText = d3.select(this.elementRef.nativeElement).selectAll('.legend');
    console.log( 'qqqqqqqqqqq legends= ', legendText)
    const versPadding = 20;
    const seriesWidths = [];

    legendText.nodes().forEach((d: any, i) => {
      //  seriesWidths.push(d.getComputedTextLength() + this.padding);
      const w = d.getBoundingClientRect().width;
      seriesWidths.push(w);
      console.log( ' 11111 w =', w)
    });

    console.log(' 11111 availableWidth =', availableWidth, ' 111 seriesWidths =', seriesWidths);

    let seriesPerRow = 0;
    let columnWidths = [];
    let legendWidth = 0;
    while (legendWidth < availableWidth && seriesPerRow < seriesWidths.length) {
      columnWidths[seriesPerRow] = seriesWidths[seriesPerRow];
      legendWidth += seriesWidths[seriesPerRow++];
    }
    if (seriesPerRow === 0) {
      seriesPerRow = 1;
    }
    while (legendWidth > availableWidth && seriesPerRow > 1) {
      columnWidths = [];
      seriesPerRow--;
      for (let k = 0; k < seriesWidths.length; k++) {
        if (seriesWidths[k] > (columnWidths[k % seriesPerRow] || 0)) {
          columnWidths[k % seriesPerRow] = seriesWidths[k];
        }
      }
      legendWidth = columnWidths.reduce((prev, cur, index, array) => {
        return prev + cur;
      });
    }
    const xPositions = [];
    for (let i = 0, curX = 0; i < seriesPerRow; i++) {
      xPositions[i] = curX;
      curX += columnWidths[i];
    }

    console.log('1111 seriesPerRow =', seriesPerRow);
    console.log('1111 columnWidths =', columnWidths)
    console.log('1111 xPositions =', xPositions)
    let columns = 1;
    this.legendData = [];
    /*
    if (this.options.drawWidth && this.options.legend.position !== 'right') {
      let maxWidth = 0;
      data.forEach(d => {
        const text = this.legendText(d);
        const w = this.calculateTextWidth(text);
        maxWidth += w > maxWidth ? w : 0;
      });
      columns = Math.floor(this.options.drawWidth / (maxWidth + 5));
    }
    console.log(' columns=', columns);
    let nd = [];
    data.forEach((d, i) => {
      if (nd.length >= columns) {
        this.legendData.push(nd);
        nd = [];
      }
      nd.push(d);
    });
    if (nd.length < columns) {
      const arr = [];
      if (this.legendData.length === 0) { // TODO for right only
        nd = [...arr, ...nd];
      } else {
        nd = [...nd, ...arr];
      }
    } */
    this.legendData.push(data);
    // console.log(' laaaaaaaaaaaaaaaadata data =', this.legendData);
    setTimeout(() => {
      this.dispatch.call('legendResize', this, data);
    }, 1);

  }

  legendStyles(): any { // 110px
    const right = 10 + this.options.margin.right + (this.options.zoom.verticalBrushShow ? 80 : 0);
    const left = this.options.margin.left - 10;
    return {
      display: this.options.legend.position !== 'right' ? 'flex' : null,
      'margin-left': this.options.legend.align === 'right' ? 'auto' : `${left}px`,
      'margin-right': this.options.legend.align === 'right' ? `${right}px` : 'auto'
    };
  }

  legendText(d: T): string {
    return d && this.options.chartType === 'pieChart' ? this.options.x(d) : this.options.x0(d);
  }

  legendColor(d, i): string {
    if (d && this.scale && this.scale.colors) {
      return d.color || this.scale.colors(this.options.drawColor(d, i));
    }
  }

  iconStyles(d, i): any {
    const color = this.legendColor(d, i);
    return {
      'background-color': !d.disabled ? color : null,
      'border-color': color
    };
  }

  itemClick(event, d: any): void {
    d.disabled = !d.disabled;
    this.dispatch.call('legendClick', this, d);
  }

  itemMouseOver(event, d: T): void {
    this.dispatch.call('legendMouseover', this, d);
  }

  itemMouseOut(event, d: T): void {
    this.dispatch.call('legendMouseout', this, d);
  }

  private calculateTextWidth(text: string, font = ''): number {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (font) {
      context.font = font;
    }
    const metrics = context.measureText(text);
    return metrics.width;
  }
}

/*


<canvas id="canvas"></canvas>

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let text = ctx.measureText('foo'); // TextMetrics object
text.width; // 16;



var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.font = "30px Arial";
var txt = "Hello World"
ctx.fillText("width:" + ctx.measureText(txt).width, 10, 50)
ctx.fillText(txt, 10, 100);

function displayTextWidth(text, font) {
  let canvas = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"));
  let context = canvas.getContext("2d");
  context.font = font;
  let metrics = context.measureText(text);
  return metrics.width;
}
console.log("Text Width: " + displayTextWidth("This is demo text!", "italic 19pt verdana")); //
*/

/*
<svg width="150" height="150">
	<text id="test1" y="50">test1</text>
	<text id="test2" y="100">
		<tspan id="test3">test3</tspan>
	</text>
	<tspan id="test4">test4</tspan>
</svg>
var test1 = document.getElementById('test1');
var test2 = document.getElementById('test2');
var test3 = document.getElementById('test3');
var test4 = document.getElementById('test4');

test1.getBBox().width;
test2.getBBox().width;
test3.getBBox().width;
test4.getBBox().width;

test1.getBoundingClientRect().width;
test2.getBoundingClientRect().width;
test3.getBoundingClientRect().width;
test4.getBoundingClientRect().width;

test1.getComputedTextLength();
test2.getComputedTextLength();
test3.getComputedTextLength();
test4.getComputedTextLength();

*/
