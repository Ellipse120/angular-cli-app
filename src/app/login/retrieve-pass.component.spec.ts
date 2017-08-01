import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrievePassComponent } from './retrieve-pass.component';

describe('RetrievePassComponent', () => {
  let component: RetrievePassComponent;
  let fixture: ComponentFixture<RetrievePassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrievePassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrievePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
