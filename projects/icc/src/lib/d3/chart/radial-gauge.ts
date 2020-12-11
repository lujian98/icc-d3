import * as d3Shape from 'd3-shape';
import * as d3Format from 'd3-format';
import * as d3Scale from 'd3-scale';
import { IccAbstractDraw } from '../draw/abstract-draw';
import { IccPieData } from '../data/pie-data';
import { IccScale, IccScaleLinear, IccD3Interactive, IccPosition } from '../model';

export class IccRadialGauge<T> extends IccAbstractDraw<T> {
  private value: number;
  cScale: any; // TODO change to scaleX??
  private sxy: IccPosition;
  private cxy: IccPosition;
  private innerRadius: number;
  private outterRadius: number;

  upperLimit = 6; // TODO change to domain options
  lowerLimit = 0; // TODO change to domain options
  majorGraduations = 10;
  unit = 'kW';
  precision = 2;

  minorGraduations = 10;
  majorGraduationLenght = 16;
  minorGraduationLenght = 10;
  majorGraduationMarginTop = 7;
  majorGraduationDecimals = 2;
  valueVerticalOffset = 50;

  unactiveColor: string;

  majorGraduationTextSize: number;

  private getMajorGraduationValues(lowerLimit, upperLimit): any[] {
    const scaleRange = upperLimit - lowerLimit;
    const majorGraduationValues = [];
    for (let i = 0; i <= this.majorGraduations; i++) {
      const scaleValue = lowerLimit + i * scaleRange / (this.majorGraduations);
      majorGraduationValues.push(scaleValue.toFixed(this.precision));
    }
    return majorGraduationValues;
  }

  private getMajorGraduationAngles(): any[] {
    const scaleRange = (this.options.pie.endAngle - this.options.pie.startAngle) * 180 / Math.PI;
    const minScale = this.options.pie.startAngle * 180 / Math.PI;
    const graduationsAngles = [];
    for (let i = 0; i <= this.majorGraduations; i++) {
      const scaleValue = minScale + i * scaleRange / (this.majorGraduations);
      graduationsAngles.push(scaleValue);
    }
    return graduationsAngles;
  }

  private getMinorGraduationAngles(majorGraduationsAngles: any[]): any[] {
    const minorGraduationsAngles = [];
    for (let indexMajor = 1; indexMajor <= this.majorGraduations; indexMajor++) {
      const minScale = majorGraduationsAngles[indexMajor - 1];
      const maxScale = majorGraduationsAngles[indexMajor];
      const scaleRange = maxScale - minScale;
      for (let i = 1; i < this.minorGraduations; i++) {
        const scaleValue = minScale + i * scaleRange / this.minorGraduations;
        minorGraduationsAngles.push(scaleValue);
      }
    }
    return minorGraduationsAngles;
  }

  drawChart(data: any[]): void {
    const pie = new IccPieData(this.options);
    this.sxy = pie.setPieScaleXY();
    this.cxy = {
      x: (this.sxy.x + 1) * this.options.drawWidth / 2,
      y: (this.sxy.y + 1) * this.options.drawHeight / 2 // TODO option to adujst x y position
    };
    this.outterRadius = Math.round(Math.min((Math.abs(this.sxy.x) + 1) * this.options.drawWidth,
      (Math.abs(this.sxy.y) + 1) * this.options.drawHeight) / 2);
    this.innerRadius = Math.round(this.outterRadius * this.options.pie.donut);

    this.cScale = d3Scale.scaleLinear().domain([this.lowerLimit, this.upperLimit])
      .range([this.options.pie.startAngle, this.options.pie.endAngle]);
    this.value = data[0].value;

    this.majorGraduationLenght = Math.round(this.outterRadius * 16 / 150);
    this.minorGraduationLenght = Math.round(this.outterRadius * 10 / 150);
    this.majorGraduationMarginTop = Math.round(this.outterRadius * 7 / 150);
    this.unactiveColor = '#D7D7D7';
    this.upperLimit = this.upperLimit ? this.upperLimit : 100; // TODO remove this
    this.lowerLimit = this.lowerLimit ? this.lowerLimit : 0;
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
    const piedata = pie.getPieData(data);
    super.drawChart(piedata);
  }

  drawContents(drawName: string, scaleX: IccScale, scaleY: IccScaleLinear): void {
    const drawContents = this.svg.select(drawName)
      .selectAll('g').data(this.data).join('g')
      .append('path')
      .attr('class', 'arc draw')
      .style('fill-opacity', 0.75);

    if (drawName === `.${this.chartType}`) {
      const majorGraduationsAngles = this.getMajorGraduationAngles();
      const minorGraduationsAngles = this.getMinorGraduationAngles(majorGraduationsAngles);
      this.svg.select('.majorGraduations').selectAll('line')
        .data(majorGraduationsAngles).join('line')
        .attr('class', 'drawMajorGraduations');
      this.svg.select('.minorGraduations').selectAll('line')
        .data(minorGraduationsAngles).join('line')
        .attr('class', 'drawMinorGraduations');
      this.svg.select(`${drawName}Label`)
        .selectAll('g').data(majorGraduationsAngles).join('g')
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

  private drawGraduationNeedle(): void { // TODO range
    const needleValue = this.cScale(this.value);
    const thetaRad = needleValue + Math.PI / 2;
    const needleLen = this.innerRadius - this.majorGraduationLenght - this.majorGraduationMarginTop;
    const needleRadius = (this.outterRadius * 2.5) / 150;
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

  private getValueColor(value: number, isAngle: boolean = false): string {
    const data: any = this.data.filter((d: any) => isAngle ? value * Math.PI / 180 < d.endAngle : value < d.value);
    if (data.length > 0) {
      return data[0].data.color;
    } else if ((!isAngle && value >= this.upperLimit) || (value >= this.options.pie.endAngle * Math.PI / 180)) {
      const td: any = this.data[this.data.length - 1];
      return td.data.color;
    }
  }

  private drawNeedleCenter(): void {
    this.svg.select('.graduationNeedleCenter')
      .append('circle')
      .attr('r', (this.outterRadius * 6) / 150)
      .attr('cx', this.cxy.x)
      .attr('cy', this.cxy.y)
      .attr('fill', this.getValueColor(this.value));
  }

  private drawGraduationValueText(): void {
    this.svg.select('.graduationValueText')
      .append('text')
      .attr('fill', this.getValueColor(this.value))
      .attr('x', this.cxy.x)
      .attr('y', this.cxy.y + this.valueVerticalOffset)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      // .style("font", fontStyle) // TODO option
      .text(`[ ${d3Format.format(',.2f')(this.value)} ${this.unit} ]`);
  }

  private drawMajorGraduationTexts(drawName: string): void {
    const majorGraduationValues = this.getMajorGraduationValues(this.lowerLimit, this.upperLimit);
    const textSize = isNaN(this.majorGraduationTextSize) ? (this.outterRadius * 7) / 150 : this.majorGraduationTextSize;
    const fontStyle = textSize + 'px Courier';

    this.svg.select(`${drawName}Label`).selectAll('g').select('.drawlabel')
      .style('font', fontStyle)
      .attr('text-anchor', (d: number) => {
        if (+d.toFixed(4) === 0) {
          return 'middle';
        } else {
          return d < 0 ? 'start' : 'end';
        }
      })
      .attr('x', (d: number) => this.getTextPosition(d, true))
      .attr('dy', (d: number) => this.getTextPosition(d, false))
      .attr('fill', (d: number) => this.getValueColor(d, true))
      .text((d: any, i) => `${majorGraduationValues[i]}${this.unit}`);
  }

  private getTextPosition(d: number, isX: boolean): number {
    const textVerticalPadding = 5;
    const textHorizontalPadding = 5;
    const angle = (90 - d) * Math.PI / 180;
    const dt = this.innerRadius - this.majorGraduationMarginTop - this.majorGraduationLenght;
    const cos1Adj = Math.round(Math.cos(angle) * (dt - textHorizontalPadding));
    const sin1Adj = Math.round(Math.sin(angle) * (dt - textVerticalPadding));
    let sin1Factor = 1;
    if (sin1Adj < 0) {
      sin1Factor = 1.1;
    }
    if (sin1Adj > 0) {
      sin1Factor = 0.9;
    }
    const x1 = this.cxy.x + cos1Adj;
    const y1 = this.cxy.y + sin1Adj * sin1Factor * -1;
    return isX ? x1 : y1;
  }

  private drawGraduations(drawName: string, graduationLenght: number): void {
    const dt = this.innerRadius - this.majorGraduationMarginTop;
    this.svg.selectAll(drawName)
      .style('stroke', (d: number) => this.getValueColor(d, true))
      .style('stroke-opacity', 1)
      .attr('x1', (d: number, i) => {
        const angle = (90 - d) * Math.PI / 180;
        const cos1Adj = Math.round(Math.cos(angle) * (dt - graduationLenght));
        return this.cxy.x + cos1Adj;
      })
      .attr('y1', (d: number, i) => {
        const angle = (90 - d) * Math.PI / 180;
        const sin1Adj = Math.round(Math.sin(angle) * (dt - graduationLenght));
        return this.cxy.y + sin1Adj * -1;
      })
      .attr('x2', (d: number, i) => {
        const angle = (90 - d) * Math.PI / 180;
        const cos2Adj = Math.round(Math.cos(angle) * dt);
        return this.cxy.x + cos2Adj;
      })
      .attr('y2', (d: number, i) => {
        const angle = (90 - d) * Math.PI / 180;
        const sin2Adj = Math.round(Math.sin(angle) * dt);
        return this.cxy.y + sin2Adj * -1;
      });
  }

  drawArc(grow: number = 0): d3Shape.Arc<any, d3Shape.DefaultArcObject> {
    return d3Shape.arc()
      .innerRadius(this.innerRadius)
      .outerRadius(this.outterRadius)
      .startAngle((d: any, i) => { // TODO initial data is incorrect ???
        d.startAngle = this.cScale(d.data.min);
        return d.startAngle;
      })
      .endAngle((d: any) => {
        d.endAngle = this.cScale(d.data.max);
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

  legendMouseover(e, data, mouseover: boolean): void {
    this.svg.select(`.${this.chartType}`).selectAll('g').select('.draw')
      .filter((d: any) => [d.data].indexOf(data) !== -1)
      .style('fill-opacity', (d) => mouseover ? 0.9 : 0.75)
      .attr('d', mouseover ? this.drawArc(5) : this.drawArc());
  }
}

