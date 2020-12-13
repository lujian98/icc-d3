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
  private cxy: IccPosition = { x: -1, y: -1 };
  private outterRadius = 0;
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
          color: d.color || this.getdrawColor(d, i),
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
      this.value = data[0] && !isNaN(this.options.y0(data[0])) ? this.options.y0(data[0]) : null;
      if (this.isDataChangeOnly()) {
        this.inintCenterNeedle();
        this.drawCenterNeedle();
      } else {
        const piedata = pie.getPieData(this.options.radialGauge.range, true);
        this.initDraw();
        super.drawChart(piedata);
      }
    }
  }

  private isDataChangeOnly(): boolean {
    const outterRadius = Math.round(Math.min((Math.abs(this.sxy.x) + 1) * this.options.drawWidth,
      (Math.abs(this.sxy.y) + 1) * this.options.drawHeight) / 2);
    this.innerRadius = Math.round(outterRadius * this.options.radialGauge.donut);
    const cxy = {
      x: (this.sxy.x + 1) * this.options.drawWidth / 2 + outterRadius * this.options.radialGauge.centerOffsetX,
      y: (this.sxy.y + 1) * this.options.drawHeight / 2 + outterRadius * this.options.radialGauge.centerOffsetY
    };
    if (this.outterRadius === outterRadius && cxy.x === this.cxy.x && cxy.y === this.cxy.y) {
      return true;
    } else {
      this.outterRadius = outterRadius;
      this.cxy = cxy;
    }
  }

  private setRangeScale(): void {
    this.lowerLimit = d3Array.min(this.options.radialGauge.range, (d) => +this.options.x(d));
    this.upperLimit = d3Array.max(this.options.radialGauge.range, (d) => +this.options.y(d));
    this.rangeScale = d3Scale.scaleLinear().domain([this.lowerLimit, this.upperLimit])
      .range([this.options.radialGauge.startAngle, this.options.radialGauge.endAngle]);
    this.scale.setColorDomain(this.options.radialGauge.range);
  }

  private initDraw(): void {
    this.majorGraduationLenght = Math.round(this.outterRadius * this.options.radialGauge.majorGraduationLenght);
    this.minorGraduationLenght = Math.round(this.outterRadius * this.options.radialGauge.minorGraduationLenght);
    this.majorGraduationMarginTop = Math.round(this.outterRadius * this.options.radialGauge.majorGraduationMarginTop);
    this.svg.select('.majorGraduations').remove();
    this.svg.select('.drawArea').append('g').attr('class', 'majorGraduations');
    this.svg.select('.minorGraduations').remove();
    this.svg.select('.drawArea').append('g').attr('class', 'minorGraduations');
    this.inintCenterNeedle();
  }

  private inintCenterNeedle(): void {
    this.svg.select('.graduationNeedle').remove();
    this.svg.select('.drawArea').append('g').attr('class', 'graduationNeedle');
    this.svg.select('.graduationValueText').remove();
    this.svg.select('.drawArea').append('g').attr('class', 'graduationValueText');
    this.svg.select('.graduationNeedleCenter').remove();
    this.svg.select('.drawArea').append('g').attr('class', 'graduationNeedleCenter');
  }

  private drawCenterNeedle(): void {
    this.drawGraduationNeedle();
    this.drawGraduationValueText();
    this.drawNeedleCenter();
  }

  drawContents(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName)
      .selectAll('g').data(this.data).join('g')
      .append('path')
      .attr('class', 'arc draw')
      .style('fill-opacity', 0.75);
    if (drawName === `.${this.chartType}`) {
      const options = this.options.radialGauge;
      const majorAngles = this.getMajorValues(options.startAngle, options.endAngle, options.majorGraduations);
      const minorAngles = this.getMinorAngles(majorAngles);
      this.svg.select('.majorGraduations').selectAll('line')
        .data(majorAngles).join('line')
        .attr('class', 'drawMajorGraduations');
      this.svg.select('.minorGraduations').selectAll('line')
        .data(minorAngles).join('line')
        .attr('class', 'drawMinorGraduations');
      this.svg.select(`${drawName}Label`)
        .selectAll('g').data(majorAngles).join('g')
        .append('text')
        .attr('class', 'drawlabel');
      this.drawCenterNeedle();
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
    const needColor = this.getValueColor(needleValue);
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
      .attr('fill', this.getValueColor(this.rangeScale(this.value)));
  }

  private drawGraduationValueText(): void {
    const textSize = this.outterRadius * this.options.radialGauge.valueTextSize;
    const text = this.value || this.value === 0 ? this.value.toFixed(this.options.radialGauge.valueDecimals) : '';
    this.svg.select('.graduationValueText')
      .append('text')
      .attr('fill', this.getValueColor(this.rangeScale(this.value)))
      .attr('x', this.cxy.x)
      .attr('y', this.cxy.y + Math.round(this.outterRadius * this.options.radialGauge.valueOffsetY))
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .style('font', `${textSize}px Courier`)
      .text(`[ ${text} ${this.options.radialGauge.valueUnit} ]`);
  }

  private drawMajorGraduationTexts(drawName: string): void {
    const majorValues = this.getMajorValues(this.lowerLimit, this.upperLimit, this.options.radialGauge.majorGraduations);
    const textSize = this.outterRadius * this.options.radialGauge.majorGraduationTextSize;
    const range = this.options.radialGauge.endAngle - this.options.radialGauge.startAngle;
    this.svg.select(`${drawName}Label`).selectAll('g').select('.drawlabel')
      .style('font', `${textSize}px Courier`)
      .attr('text-anchor', (d: number) => {
        const sind = Math.sin(d);
        if (Math.abs(sind) < 0.001) {
          return 'middle';
        } else {
          return sind < 0 ? 'start' : 'end';
        }
      })
      .attr('x', (d: number, i) => this.getTextPositionX(d, i))
      .attr('dy', (d: number, i) => this.getTextPositionDy(d, i))
      .attr('fill', (d: number) => this.getValueColor(d))
      .style('fill-opacity', (d, i) => i === 0 && range === 2 * Math.PI ? 0 : 1)
      .text((d, i) => `${majorValues[i].toFixed(this.options.radialGauge.majorGraduationDecimals)}
        ${this.options.radialGauge.valueUnit}`);
  }

  private getMajorValues(lowerLimit, upperLimit, graduations: number, j = 0): number[] {
    const scaleRange = upperLimit - lowerLimit;
    const majorValues = [];
    for (let i = j; i <= graduations - j; i++) {
      majorValues.push(lowerLimit + i * scaleRange / graduations);
    }
    return majorValues;
  }

  private getMinorAngles(majorAngles: number[]): number[] {
    let minorAngles = [];
    for (let i = 1; i <= this.options.radialGauge.majorGraduations; i++) {
      const angles = this.getMajorValues(majorAngles[i - 1], majorAngles[i], this.options.radialGauge.minorGraduations, 1);
      minorAngles = [...minorAngles, ...angles];
    }
    return minorAngles;
  }

  private getValueColor(value: number): string {
    if (value === null || value < this.options.radialGauge.startAngle || value > this.options.radialGauge.endAngle) {
      return this.options.radialGauge.valueNullColor;
    }
    const data: any = this.data.filter((d: any, i) => value < d.endAngle
      || i === this.data.length - 1 && value === this.options.radialGauge.endAngle);
    if (data.length > 0) {
      return this.getdrawColor(data[0].data, data[0].index);
    }
  }

  private getTextPositionX(d: number, i: number): number {
    const dt = this.innerRadius - this.majorGraduationMarginTop - this.majorGraduationLenght;
    const cos1Adj = Math.round(Math.cos(Math.PI / 2 - d) * (dt - this.options.radialGauge.textHorizontalPadding));
    return this.cxy.x + cos1Adj;
  }

  private getTextPositionDy(d: number, i: number): number {
    const dt = this.innerRadius - this.majorGraduationMarginTop - this.majorGraduationLenght;
    const sin1Adj = Math.round(Math.sin(Math.PI / 2 - d) * (dt - this.options.radialGauge.textVerticalPadding));
    let sin1Factor = -1;
    if (Math.abs(Math.cos(d) + 1) > 0.001) {
      sin1Factor = sin1Adj < 0 ? -1.1 : -0.9;
    }
    return this.cxy.y + sin1Adj * sin1Factor;
  }

  private drawGraduations(drawName: string, graduationLenght: number): void {
    const dt = this.innerRadius - this.majorGraduationMarginTop;
    const range = this.options.radialGauge.endAngle - this.options.radialGauge.startAngle;
    this.svg.selectAll(drawName)
      .style('stroke', (d: number) => this.getValueColor(d))
      .style('stroke-opacity', (d, i) => i === 0 && range === 2 * Math.PI && drawName === '.drawMajorGraduations' ? 0 : 1)
      .attr('x1', (d: number) => this.cxy.x + Math.round(Math.cos(Math.PI / 2 - d) * (dt - graduationLenght)))
      .attr('y1', (d: number) => this.cxy.y - Math.round(Math.sin(Math.PI / 2 - d) * (dt - graduationLenght)))
      .attr('x2', (d: number) => this.cxy.x + Math.round(Math.cos(Math.PI / 2 - d) * dt))
      .attr('y2', (d: number) => this.cxy.y - Math.round(Math.sin(Math.PI / 2 - d) * dt));
  }

  drawArc(grow: number = 0): d3Shape.Arc<any, d3Shape.DefaultArcObject> {
    return d3Shape.arc()
      .innerRadius(this.innerRadius)
      .outerRadius(this.outterRadius - 10 + grow);
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

