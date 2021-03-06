import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';
import * as d3Interpolate from 'd3-interpolate';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccPieData } from '../data/pie-data';
import { IccScale, IccScaleLinear, IccD3Interactive, IccPosition } from '../model';

export class IccRadialGauge<T> extends IccAbstractDraw<T> {
  private values: T[];
  private lowerLimit: number;
  private upperLimit: number;
  private sxy: IccPosition;
  private cxy: IccPosition = { x: -1, y: -1 };
  private outterRadius = 0;
  private innerRadius: number;
  private majorGraduationLenght: number;
  private minorGraduationLenght: number;
  private majorGraduationMarginTop: number;
  private startColor: string;
  private colors: any;

  getDrawData(idx: number, data: T): IccD3Interactive[] {
    return this.data.map((d: any, i) => {
      return {
        key: '',
        value: d,
        color: d.data.color || this.getdrawColor(d.data, i),
        valueX: null,
        valueY: `${d.data.minv} - ${d.data.maxv}`,
        cy: null,
        hovered: i === idx,
        hasSummary: false
      };
    });
  }

  drawChart(data: T[]): void {
    if (this.options.radialGauge.range.length > 0) {
      this.setRangeScale();
      const pie = new IccPieData(this.options);
      pie.pieOptions = this.options.radialGauge;
      this.sxy = pie.setPieScaleXY();
      this.values = this.options.y0(data[0]) || [];
      // console.log('this.values =', this.values)
      if (this.isDataChangeOnly()) {
        this.inintCenterNeedle();
        this.drawCenterNeedle();
      } else {
        const piedata = pie.getPieData(this.getPieRangeData(), true);
        this.setColorScale(piedata);
        this.initDraw();
        super.drawChart(piedata);
      }
    }
  }

  private getPieRangeData(): any[] {
    const range = this.options.radialGauge.range;
    return range.filter((d, i) => i > 0)
      .map((d, i) => {
        if (i === 0) {
          this.startColor = range[0].color || 'green';
        }
        return {
          minv: range[i].value,
          maxv: d.value,
          color: d.color
        };
      });
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
    this.lowerLimit = d3Array.min(this.options.radialGauge.range, (d) => d.value);
    this.upperLimit = d3Array.max(this.options.radialGauge.range, (d) => d.value);
    this.scale.y.range([this.options.radialGauge.startAngle, this.options.radialGauge.endAngle]);
    this.scale.y.domain([this.lowerLimit, this.upperLimit]);
    this.scale.setColorDomain(this.options.radialGauge.range);
  }

  private setColorScale(data: T[]): void {
    const range = [];
    const domain = [];
    data.forEach((d: any, i) => {
      if (domain.length === 0) {
        domain.push(d.startAngle);
        range.push(this.startColor);
      }
      domain.push(d.endAngle);
      range.push(this.getdrawColor(d.data, i));
    });
    if (this.options.radialGauge.colorScale) {
      this.colors = this.options.radialGauge.colorScale.domain(domain);
    } else {
      const y: any = d3Interpolate.interpolateRgb;
      this.colors = d3Scale.scaleLinear().range(range).interpolate(y).domain(domain);
    }
  }

  private initDraw(): void {
    this.createDrawElement('gradients');
    this.majorGraduationLenght = Math.round(this.outterRadius * this.options.radialGauge.majorGraduationLenght);
    this.minorGraduationLenght = Math.round(this.outterRadius * this.options.radialGauge.minorGraduationLenght);
    this.majorGraduationMarginTop = Math.round(this.outterRadius * this.options.radialGauge.majorGraduationMarginTop);
    this.createDrawElement('radialGaugeLabel');
    this.createDrawElement('majorGraduations');
    this.createDrawElement('minorGraduations');
    this.inintCenterNeedle();
  }

  private inintCenterNeedle(): void {
    this.createDrawElement('graduationNeedle');
    this.createDrawElement('graduationValueText');
    this.createDrawElement('graduationNeedleCenter');
  }

  private drawCenterNeedle(): void {
    this.svg.select('.graduationNeedle').selectAll('g').data(this.values).join('g').append('path');
    this.svg.select('.graduationValueText').selectAll('g')
      .data(this.values.length > 0 ? this.values : [null]).join('g').append('text');
    this.svg.select('.graduationNeedleCenter').selectAll('g').data(this.values).join('g').append('circle');
    this.drawGraduationNeedles();
    this.drawGraduationValueText();
    this.drawNeedleCenters();
  }

  drawContents(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    this.svg.select(drawName).selectAll('g').data(this.data).join('g').append('path')
      .attr('class', 'arc draw')
      .style('fill-opacity', 0.75);
    if (drawName === `.${this.chartType}`) {
      const options = this.options.radialGauge;
      const majorAngles = this.getMajorValues(options.startAngle, options.endAngle, options.majorGraduations);
      const minorAngles = this.getMinorAngles(majorAngles);
      this.svg.select('.majorGraduations').selectAll('line').data(majorAngles).join('line')
        .attr('class', 'drawMajorGraduations');
      this.svg.select('.minorGraduations').selectAll('line').data(minorAngles).join('line')
        .attr('class', 'drawMinorGraduations');
      this.svg.select(`${drawName}Label`).selectAll('g').data(majorAngles).join('g').append('text')
        .attr('class', 'drawlabel');
      this.drawCenterNeedle();
    }
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName).selectAll('g').select('.draw')
      .attr('transform', () => `translate(${this.cxy.x}, ${this.cxy.y})`)
      .attr('d', this.drawArc())
      .attr('fill', (d: any, i) => this.options.radialGauge.enableGradients ? this.setGradients(d) : this.getdrawColor(d.data, i));
    if (drawName === `.${this.chartType}`) {
      drawContents.on('mouseover', (e, d) => this.drawMouseover(e, d, true))
        .on('mouseout', (e, d) => this.drawMouseover(e, d, false));
      this.drawGraduations('.drawMajorGraduations', this.majorGraduationLenght);
      this.drawGraduations('.drawMinorGraduations', this.minorGraduationLenght);
      this.drawMajorGraduationTexts(drawName);
    }
  }

  private drawGraduationNeedles(): void {
    this.svg.select('.graduationNeedle').selectAll('g').select('path')
      .attr('d', (d: number) => this.getTriangle(this.options.y(d)))
      .style('stroke-width', 1)
      .style('stroke', (d: number) => this.getNeddleColor(d))
      .style('fill', (d: number) => this.getNeddleColor(d));
  }

  private getNeddleColor(d: number): string {
    d = d !== null ? this.options.y(d) : null;
    const scale = this.scale.y as IccScaleLinear;
    const value = !isNaN(d) && d !== null ? scale(d) : null;
    return this.getValueColor(value);
  }

  private getTriangle(d: number): string {
    const scale = this.scale.y as IccScaleLinear;
    const thetaRad = scale(d) + Math.PI / 2;
    const needleLen = this.innerRadius - this.majorGraduationLenght - this.majorGraduationMarginTop;
    const needleRadius = this.outterRadius * this.options.radialGauge.needleEndRadius;
    const topX = this.cxy.x - needleLen * Math.cos(thetaRad);
    const topY = this.cxy.y - needleLen * Math.sin(thetaRad);
    const leftX = this.cxy.x - needleRadius * Math.cos(thetaRad - Math.PI / 2);
    const leftY = this.cxy.y - needleRadius * Math.sin(thetaRad - Math.PI / 2);
    const rightX = this.cxy.x - needleRadius * Math.cos(thetaRad + Math.PI / 2);
    const rightY = this.cxy.y - needleRadius * Math.sin(thetaRad + Math.PI / 2);
    const triangle = `M ${leftX} ${leftY} L ${topX} ${topY} L ${rightX} ${rightY}`;
    return triangle;
  }

  private drawNeedleCenters(): void {
    this.svg.select('.graduationNeedleCenter').selectAll('g').select('circle')
      .attr('r', this.outterRadius * this.options.radialGauge.needleCenterRadius)
      .attr('cx', this.cxy.x)
      .attr('cy', this.cxy.y)
      .attr('fill', (d: number) => this.getNeddleColor(d));
  }

  private drawGraduationValueText(): void {
    const textSize = this.outterRadius * this.options.radialGauge.valueTextSize;
    const y = this.cxy.y + Math.round(this.outterRadius * this.options.radialGauge.valueOffsetY);
    this.svg.select('.graduationValueText').selectAll('g').select('text')
      .attr('fill', (d: number) => this.getNeddleColor(d))
      .attr('x', this.cxy.x)
      .attr('y', (d, i) => y + i * (textSize + 2))
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .style('font', `${textSize}px Courier`)
      .text((d: number) => this.getValueText(d));
  }

  private getValueText(d: number): string {
    const label = d !== null && this.options.x(d) ? `${this.options.x(d)} ` : '';
    const y = d !== null ? this.options.y(d) : null;
    const text = y || y === 0 ? y.toFixed(this.options.radialGauge.valueDecimals) : '';
    return `[ ${label}${text} ${this.options.radialGauge.valueUnit} ]`;
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
    if (this.options.radialGauge.enableGradients) {
      return this.colors(value);
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

  private setGradients(data): string {
    const arcs = [];
    const dAngle = data.endAngle - data.startAngle;
    const noOfArcs = dAngle * 75;  // seems like a good number
    const angle = dAngle / noOfArcs;
    for (let j = 0; j < noOfArcs; j++) {
      const arc: any = {};
      arc.startAngle = data.startAngle + angle * j;
      arc.endAngle = arc.startAngle + angle + 0.01; // 0.01 so the colours overlap slightly, so there's no funny artefacts.
      arc.endAngle = arc.endAngle > data.endAngle ? data.endAngle : arc.endAngle;
      arcs.push(arc);
    }
    this.svg.select('.gradients')
      .attr('transform', () => `translate(${this.cxy.x}, ${this.cxy.y})`)
      .selectAll().data(arcs).enter().append('g').append('path')
      .attr('class', 'gradient-arc')
      .attr('d', this.drawArc())
      .style('fill', (d) => this.colors((d.startAngle + d.endAngle) / 2));
    return 'none';
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

