import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccPieData } from '../data/pie-data';
import { IccScale, IccScaleLinear, IccD3Interactive, IccPosition } from '../model';

export class IccRadialGauge<T> extends IccAbstractDraw<T> {
  private value: number;
  private rangeScale: IccScaleLinear;
  private lowerLimit: number;
  private upperLimit: number;
  private sxy: IccPosition;
  private cxy: IccPosition;
  private outterRadius: number;
  private innerRadius: number;
  private majorGraduationLenght: number;
  private minorGraduationLenght: number;
  private majorGraduationMarginTop: number;

  getDrawData(idx: number, data: T): IccD3Interactive[] {
    return this.options.radialGauge.range
      .map((d, i) => {
        return {
          key: '',
          value: d,
          color: d.color || this.getdrawColor(d, idx),
          valueX: null,
          valueY: `${this.options.x(d)} - ${this.options.y(d)}`,
          cy: null,
          hovered: i === idx,
          hasSummary: false
        };
      });
  }

  drawChart(data: any[]): void {
    if (this.options.radialGauge.range.length > 0) {
      this.setRangeScale();
      const pie = new IccPieData(this.options);
      pie.pieOptions = this.options.radialGauge;
      this.sxy = pie.setPieScaleXY();
      const piedata = pie.getPieData(this.options.radialGauge.range);
      this.value = data[0] && !isNaN(this.options.y0(data[0])) ? this.options.y0(data[0]) : null;
      this.initDraw();
      super.drawChart(piedata);
    }
  }

  private setRangeScale(): void {
    this.lowerLimit = d3Array.min(this.options.radialGauge.range, (d) => +this.options.x(d));
    this.upperLimit = d3Array.max(this.options.radialGauge.range, (d) => +this.options.y(d));
    this.rangeScale = d3Scale.scaleLinear().domain([this.lowerLimit, this.upperLimit])
      .range([this.options.radialGauge.startAngle, this.options.radialGauge.endAngle]);
  }

  private initDraw(): void {
    this.outterRadius = Math.round(Math.min((Math.abs(this.sxy.x) + 1) * this.options.drawWidth,
      (Math.abs(this.sxy.y) + 1) * this.options.drawHeight) / 2);
    this.innerRadius = Math.round(this.outterRadius * this.options.radialGauge.donut);
    this.cxy = {
      x: (this.sxy.x + 1) * this.options.drawWidth / 2 + this.outterRadius * this.options.radialGauge.centerOffsetX,
      y: (this.sxy.y + 1) * this.options.drawHeight / 2 + this.outterRadius * this.options.radialGauge.centerOffsetY
    };
    this.majorGraduationLenght = Math.round(this.outterRadius * this.options.radialGauge.majorGraduationLenght);
    this.minorGraduationLenght = Math.round(this.outterRadius * this.options.radialGauge.minorGraduationLenght);
    this.majorGraduationMarginTop = Math.round(this.outterRadius * this.options.radialGauge.majorGraduationMarginTop);
    this.svg.select('.majorGraduations').remove();
    this.svg.select('.drawArea').append('g').attr('class', 'majorGraduations');
    this.svg.select('.minorGraduations').remove();
    this.svg.select('.drawArea').append('g').attr('class', 'minorGraduations');
    this.svg.select('.graduationNeedle').remove();
    this.svg.select('.drawArea').append('g').attr('class', 'graduationNeedle');
    this.svg.select('.graduationValueText').remove();
    this.svg.select('.drawArea').append('g').attr('class', 'graduationValueText');
    this.svg.select('.graduationNeedleCenter').remove();
    this.svg.select('.drawArea').append('g').attr('class', 'graduationNeedleCenter');
  }

  drawContents(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName)
      .selectAll('g').data(this.data).join('g')
      .append('path')
      .attr('class', 'arc draw')
      .style('fill-opacity', 0.75);
    if (drawName === `.${this.chartType}`) {
      let majorAngles = this.getMajorGraduationAngles();
      const minorGraduationsAngles = this.getMinorGraduationAngles(majorAngles);
      const scaleRange = (this.options.radialGauge.endAngle - this.options.radialGauge.startAngle);
      if (scaleRange === 2 * Math.PI) {
        majorAngles = majorAngles.filter((d, i) => i < this.options.radialGauge.majorGraduations);
      }
      this.svg.select('.majorGraduations').selectAll('line')
        .data(majorAngles).join('line')
        .attr('class', 'drawMajorGraduations');
      this.svg.select('.minorGraduations').selectAll('line')
        .data(minorGraduationsAngles).join('line')
        .attr('class', 'drawMinorGraduations');
      this.svg.select(`${drawName}Label`)
        .selectAll('g').data(majorAngles).join('g')
        .append('text')
        .attr('class', 'drawlabel');
      this.drawGraduationNeedle();
      this.drawGraduationValueText();
      this.drawNeedleCenter();
    }
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName).selectAll('g').select('.draw')
      .attr('transform', (d: any) => `translate(${this.cxy.x}, ${this.cxy.y})`)
      .attr('fill', (d: any, i) => this.getdrawColor(d.data, i))
      .attr('d', this.drawArc());
    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.drawMouseover(e, d, true))
        .on('mouseout', (e, d) => this.drawMouseover(e, d, false));
      this.drawGraduations('.drawMajorGraduations', this.majorGraduationLenght);
      this.drawGraduations('.drawMinorGraduations', this.minorGraduationLenght);
      this.drawMajorGraduationTexts(drawName);
    }
  }

  private drawGraduationNeedle(): void {
    const needleValue = this.rangeScale(this.value);
    const thetaRad = needleValue + Math.PI / 2;
    const needleLen = this.innerRadius - this.majorGraduationLenght - this.majorGraduationMarginTop;
    const needleRadius = this.outterRadius * this.options.radialGauge.needleEndRadius;
    const topX = this.cxy.x - needleLen * Math.cos(thetaRad);
    const topY = this.cxy.y - needleLen * Math.sin(thetaRad);
    const leftX = this.cxy.x - needleRadius * Math.cos(thetaRad - Math.PI / 2);
    const leftY = this.cxy.y - needleRadius * Math.sin(thetaRad - Math.PI / 2);
    const rightX = this.cxy.x - needleRadius * Math.cos(thetaRad + Math.PI / 2);
    const rightY = this.cxy.y - needleRadius * Math.sin(thetaRad + Math.PI / 2);
    const triangle = 'M ' + leftX + ' ' + leftY + ' L ' + topX + ' ' + topY + ' L ' + rightX + ' ' + rightY;
    const needColor = this.getValueColor(this.value);
    this.svg.select('.graduationNeedle')
      .append('path')
      .attr('d', triangle)
      .style('stroke-width', 1)
      .style('stroke', needColor)
      .style('fill', needColor);
  }

  private drawNeedleCenter(): void {
    this.svg.select('.graduationNeedleCenter')
      .append('circle')
      .attr('r', this.outterRadius * this.options.radialGauge.needleCenterRadius)
      .attr('cx', this.cxy.x)
      .attr('cy', this.cxy.y)
      .attr('fill', this.getValueColor(this.value));
  }

  private drawGraduationValueText(): void {
    const textSize = this.outterRadius * this.options.radialGauge.valueTextSize;
    const text = this.value ? this.value.toFixed(this.options.radialGauge.valueDecimals) : '';
    this.svg.select('.graduationValueText')
      .append('text')
      .attr('fill', this.getValueColor(this.value))
      .attr('x', this.cxy.x)
      .attr('y', this.cxy.y + this.options.radialGauge.valueOffsetY)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .style('font', `${textSize}px Courier`)
      .text(`[ ${text} ${this.options.radialGauge.valueUnit} ]`);
  }

  private drawMajorGraduationTexts(drawName: string): void {
    const majorGraduationValues = this.getMajorGraduationValues(this.lowerLimit, this.upperLimit);
    const textSize = this.outterRadius * this.options.radialGauge.majorGraduationTextSize;
    this.svg.select(`${drawName}Label`).selectAll('g').select('.drawlabel')
      .style('font', `${textSize}px Courier`)
      .attr('text-anchor', (d: number) => {
        if (+d.toFixed(4) === 0 || d === -Math.PI) {
          return 'middle';
        } else {
          return d < 0 ? 'start' : 'end';
        }
      })
      .attr('x', (d: number, i) => this.getTextPositionX(d, i))
      .attr('dy', (d: number, i) => this.getTextPositionDy(d, i))
      .attr('fill', (d: number) => this.getValueColor(d, true))
      .text((d, i) => `${majorGraduationValues[i].toFixed(this.options.radialGauge.majorGraduationDecimals)}
        ${this.options.radialGauge.valueUnit}`);
  }

  private getMajorGraduationValues(lowerLimit, upperLimit): any[] {
    const scaleRange = upperLimit - lowerLimit;
    const majorGraduationValues = [];
    for (let i = 0; i <= this.options.radialGauge.majorGraduations; i++) {
      majorGraduationValues.push(lowerLimit + i * scaleRange / (this.options.radialGauge.majorGraduations));
    }
    return majorGraduationValues;
  }

  private getMajorGraduationAngles(): any[] {
    const scaleRange = (this.options.radialGauge.endAngle - this.options.radialGauge.startAngle);
    const minScale = this.options.radialGauge.startAngle;
    const graduationsAngles = [];
    for (let i = 0; i <= this.options.radialGauge.majorGraduations; i++) {
      graduationsAngles.push(minScale + i * scaleRange / (this.options.radialGauge.majorGraduations));
    }
    return graduationsAngles;
  }

  private getMinorGraduationAngles(majorGraduationsAngles: any[]): any[] {
    const minorGraduationsAngles = [];
    for (let indexMajor = 1; indexMajor <= this.options.radialGauge.majorGraduations; indexMajor++) {
      const minScale = majorGraduationsAngles[indexMajor - 1];
      const maxScale = majorGraduationsAngles[indexMajor];
      const scaleRange = maxScale - minScale;
      for (let i = 1; i < this.options.radialGauge.minorGraduations; i++) {
        const scaleValue = minScale + i * scaleRange / this.options.radialGauge.minorGraduations;
        minorGraduationsAngles.push(scaleValue);
      }
    }
    return minorGraduationsAngles;
  }

  private getValueColor(value: number, isAngle: boolean = false): string {
    if (!isAngle && (value === null || value < this.lowerLimit || value > this.upperLimit)) {
      return this.options.radialGauge.valueNullColor;
    }
    const data: any = this.data.filter((d: any) => isAngle ? value < d.endAngle : value < d.value);
    if (data.length > 0) {
      return data[0].data.color;
    } else if ((!isAngle && value >= this.upperLimit) || (value >= this.options.radialGauge.endAngle)) {
      const td: any = this.data[this.data.length - 1];
      return td.data.color;
    }
  }

  private getTextPositionX(d: number, i: number): number {
    const dt = this.innerRadius - this.majorGraduationMarginTop - this.majorGraduationLenght;
    const cos1Adj = Math.round(Math.cos(Math.PI / 2 - d) * (dt - this.options.radialGauge.textHorizontalPadding));
    const cos1Factor = this.options.radialGauge.startAngle === - Math.PI && i === 0 ? 0 : 1;
    return this.cxy.x + cos1Adj * cos1Factor;
  }

  private getTextPositionDy(d: number, i: number): number {
    const dt = this.innerRadius - this.majorGraduationMarginTop - this.majorGraduationLenght;
    const sin1Adj = Math.round(Math.sin(Math.PI / 2 - d) * (dt - this.options.radialGauge.textVerticalPadding));
    let sin1Factor = -1;
    if (this.options.radialGauge.startAngle !== - Math.PI || i !== 0) {
      sin1Factor = sin1Adj < 0 ? -1.1 : -0.9;
    }
    return this.cxy.y + sin1Adj * sin1Factor;
  }

  private drawGraduations(drawName: string, graduationLenght: number): void {
    const dt = this.innerRadius - this.majorGraduationMarginTop;
    this.svg.selectAll(drawName)
      .style('stroke', (d: number) => this.getValueColor(d, true))
      .style('stroke-opacity', 1)
      .attr('x1', (d: number) => this.cxy.x + Math.round(Math.cos(Math.PI / 2 - d) * (dt - graduationLenght)))
      .attr('y1', (d: number) => this.cxy.y - Math.round(Math.sin(Math.PI / 2 - d) * (dt - graduationLenght)))
      .attr('x2', (d: number) => this.cxy.x + Math.round(Math.cos(Math.PI / 2 - d) * dt))
      .attr('y2', (d: number) => this.cxy.y - Math.round(Math.sin(Math.PI / 2 - d) * dt));
  }

  drawArc(grow: number = 0): d3Shape.Arc<any, d3Shape.DefaultArcObject> {
    return d3Shape.arc()
      .innerRadius(this.innerRadius)
      .outerRadius(this.outterRadius - 10 + grow)
      .startAngle((d: any, i) => { // TODO initial data is incorrect ???
        d.startAngle = this.rangeScale(d.data.min);
        return d.startAngle;
      })
      .endAngle((d: any) => {
        d.endAngle = this.rangeScale(d.data.max);
        return d.endAngle;
      });
  }

  drawMouseover(e, data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').select('.draw')
      .filter((d: any) => {
        if (d.index === data.index) {
          if (mouseover) {
            this.hoveredKey = this.options.x(d.data);
            this.hoveredIndex = d.index;
          } else {
            this.hoveredKey = null;
            this.hoveredIndex = -1;
          }
          return true;
        }
      })
      .transition().duration(50)
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75)
      .attr('d', mouseover ? this.drawArc(7) : this.drawArc());
  }

  legendMouseover(): void { }
}

