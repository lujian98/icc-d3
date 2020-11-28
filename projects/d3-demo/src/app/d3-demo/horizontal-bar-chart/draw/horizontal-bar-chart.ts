import { IccHorizontalBarChart, IccScale, IccScaleLinear } from 'icc';
import * as d3Transition from 'd3-transition';

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
          .text((d: any) => {
            return d.value;
          })
        );

    }

    /*

        const transition = svg.transition()
        .duration(duration)
        .ease(d3.easeLinear);

    .call(bar => bar.transition(transition)
      .attr("transform", d => `translate(${x(d.value)},${y(d.rank)})`)
      .call(g => g.select("tspan").tween("text", d => textTween((prev.get(d) || d).value, d.value))))
formatNumber = d3.format(",d")

function textTween(a, b) {
  const i = d3.interpolateNumber(a, b);
  return function(t) {
    this.textContent = formatNumber(i(t));
  };
}

          */

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
}

