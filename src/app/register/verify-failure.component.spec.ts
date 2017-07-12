import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyFailureComponent } from './verify-failure.component';

describe('VerifyFailureComponent', () => {
  let component: VerifyFailureComponent;
  let fixture: ComponentFixture<VerifyFailureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyFailureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
