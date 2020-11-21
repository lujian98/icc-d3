
import { IccLinearScale } from './linear-scale';
import { IccTimeScale } from './time-scale';
import { IccBandScale } from './band-scale';

export class IccScaleFactory {
  componentMapper: {};
  componentRef: any;
  constructor(private scaleType: string, private options: any) {
    this.componentMapper = {
      linear: IccLinearScale,
      time: IccTimeScale,
      band: IccBandScale
    };
    this.setComponentRef();
  }

  setComponentRef(): void {
    let component = this.componentMapper[this.scaleType];
    if (!component) {
      component = this.componentMapper['linear'];
    }
    this.componentRef = new component(this.options);
  }

  getScale(range: any[], reverse = false): any {
    return this.componentRef.getScale(range, reverse);
  }

  updateRange(scale: any, range: [], reverse = false): void {
    this.componentRef.updateRange(scale, range, reverse);
  }

  setXDomain(scale: any, data: any[], type = null): void {
    this.componentRef.setXDomain(scale, data, type);
  }

  setYDomain(scale: any, data: any[], type = null): void {
    this.componentRef.setYDomain(scale, data, type);
  }
}
