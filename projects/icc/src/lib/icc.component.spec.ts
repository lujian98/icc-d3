import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IccComponent } from './icc.component';

describe('IccComponent', () => {
  let component: IccComponent;
  let fixture: ComponentFixture<IccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IccComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
