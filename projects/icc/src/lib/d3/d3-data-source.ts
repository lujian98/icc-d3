import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';

export class IccD3DataSource<T> extends DataSource<T> {
  _data = new BehaviorSubject<T[]>([]);

  get data(): T[] {
    return this._data.value;
  }

  set data(value: T[]) {
    this._data.next(value);
  }

  connect(): Observable<T[]> {
    return of(this.data);
  }

  disconnect(): void { }
}
