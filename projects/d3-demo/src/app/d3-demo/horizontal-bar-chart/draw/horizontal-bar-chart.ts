import { IccHorizontalBarChart, IccScale, IccScaleLinear } from 'icc';
import * as d3Transition from 'd3-transition';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Format from 'd3-format';
import * as d3Ease from 'd3-ease';

export class AppHorizontalBarChart<T> extends IccHorizontalBarChart<T> {

  redrawContent(drawName: string, scaleX: IccScaleLinear, scaleY: IccScale): void {
    const drawContents = this.svg.select(drawName).selectAll('g').selectAll('rect')
      .data((d) => this.options.y0(d)).join('rect')
      .attr('class', 'horizontalbar draw')
      .attr('fill', (d: any, i) => this.getBarColor(d, i))
      .attr('fill-opacity', 0.6)
      .attr('y', (d) => scaleY(this.options.y(d)))
      .attr('height', this.scale.getYBarWidth(scaleY, this.data));

    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.drawMouseover(e, d, true))
        .on('mouseout', (e, d) => this.drawMouseover(e, d, false));

      this.svg.select(drawName).selectAll('g')
        .selectAll('text')
        .data((d) => this.options.y0(d))
        .join('text')
        .attr('class', 'label')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'end')
        .attr('fill', (d, i) => 'black')
        .attr('y', (d) => scaleY(this.options.y(d)) + this.scale.getYBarWidth(scaleY, this.data) / 2)
        .attr('x', (d, i) => scaleX(Math.abs(this.options.x(d))) - scaleX(0) - 6)
        .text((d: any) => {
          return d.name;
        })
        .call(text => text.append('tspan')
          .attr('y', (d) => scaleY(this.options.y(d)) + this.scale.getYBarWidth(scaleY, this.data) / 2)
          .attr('x', (d, i) => scaleX(Math.abs(this.options.x(d))) - scaleX(0) - 6)
          .attr('text-anchor', 'end')
          .attr('fill-opacity', 0.7)
          .attr('font-weight', 'normal')
          // .attr('x', -6)
          .attr('dy', '1.15em')
        );

      this.svg.select(drawName).selectAll('g').selectAll('tspan')
        .transition()
        .duration(200)
        .ease(d3Ease.easeLinear)
        .tween('text', (d: any, i) => {
          let start = 0;
          if (this.prevData) {
            const data = this.options.y0(this.prevData[0]).filter((t, j) => i === j);
            if (data.length > 0) {
              start = +data[0].value;
            }
          }
          // const tt = this.textTween(start, +d.value);
          // console.log(' tt =', tt)
          return this.textTween(start, +d.value);
        });
    }

    if (this.isAnimation && this.options.duration > 0) {
      drawContents
        .attr('x', (d, i) => scaleX(0))
        .attr('width', (d, i) => 0)
        .transition()
        .duration(this.options.duration)
        .attr('x', (d, i) => scaleX(Math.min(0, this.options.x(d))))
        .attr('width', (d, i) => scaleX(Math.abs(this.options.x(d))) - scaleX(0));
    } else {
      drawContents
        .attr('x', (d, i) => scaleX(Math.min(0, this.options.x(d))))
        .attr('width', (d, i) => scaleX(Math.abs(this.options.x(d))) - scaleX(0));
    }
  }

  textTween(a, b): any {
    const i = d3Interpolate.interpolateNumber(a, b);
    return function (t) {
      this.textContent = d3Format.format(',d')(i(t));
    };
  }
}

