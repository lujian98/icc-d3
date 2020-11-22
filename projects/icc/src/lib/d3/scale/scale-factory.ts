import { IccAbstractScale } from './abstract-scale';
import { IccLinearScale } from './linear-scale';
import { IccTimeScale } from './time-scale';
import { IccBandScale } from './band-scale';
import { IccScale } from '../model/model';

export class IccScaleFactory<T> {

  componentMapper = {
    linear: IccLinearScale,
    time: IccTimeScale,
    band: IccBandScale
  };

  componentRef: IccAbstractScale<T>;

  constructor(private scaleType: string, private options: any) {
    this.setComponentRef();
  }

  setComponentRef(): void {
    let component = this.componentMapper[this.scaleType];
    if (!component) {
      component = this.componentMapper.linear;
    }
    this.componentRef = new component(this.options);
  }

  getScale(range: number[], reverse = false): IccScale {
    return this.componentRef.getScale(range, reverse);
  }

  updateRange(scale: IccScale, range: number[], reverse = false): void {
    this.componentRef.updateRange(scale, range, reverse);
  }

  setXDomain(scale: IccScale, data: T[], type: string = null): void {
    this.componentRef.setXDomain(scale, data, type);
  }

  setYDomain(scale: IccScale, data: T[], type: string = null): void {
    this.componentRef.setYDomain(scale, data, type);
  }
}

