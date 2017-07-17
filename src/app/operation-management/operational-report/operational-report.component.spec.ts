import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationalReportComponent } from './operational-report.component';

describe('OperationalReportComponent', () => {
  let component: OperationalReportComponent;
  let fixture: ComponentFixture<OperationalReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationalReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
