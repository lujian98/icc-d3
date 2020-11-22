import { IccScale } from '../model/model';

export abstract class IccAbstractScale {
  abstract getScale(range: [], reverse: boolean): IccScale;
  abstract updateRange(scale: IccScale, range: [], reverse: boolean): void;
  abstract setXDomain(scale: IccScale, data: []): void;
  abstract setYDomain(scale: IccScale, data: []): void;

  constructor(
    protected options: any,
  ) {
  }
}

